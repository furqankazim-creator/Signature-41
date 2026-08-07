import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Otp from '../models/Otp.js'

const router = Router()

const OTP_TTL_MS = 5 * 60 * 1000
const MAX_REQUESTS_PER_HOUR = 3
const MAX_VERIFY_ATTEMPTS = 5

function normalizePhone(phone) {
  let digits = String(phone ?? '').replace(/[^\d]/g, '')
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`
  else if (!digits.startsWith('92')) digits = `92${digits}`
  return digits
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

async function sendSms(phone, code) {
  if (!process.env.SMS_TO_API_KEY) return false

  try {
    const res = await fetch('https://api.sms.to/sms/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SMS_TO_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        to: `+${phone}`,
        message: `Your Signature 41 verification code is ${code}. It expires in 5 minutes.`,
        sender_id: process.env.SMS_TO_SENDER_ID ?? 'Signature41',
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('SMS.to send failed:', res.status, body)
      return false
    }
    return true
  } catch (err) {
    console.error('SMS.to request error:', err.message)
    return false
  }
}

router.post('/request', async (req, res) => {
  const phone = normalizePhone(req.body.phone)
  if (phone.length < 10) {
    return res.status(400).json({ error: 'Enter a valid mobile number.' })
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const recentCount = await Otp.countDocuments({ phone, requestedAt: { $gte: oneHourAgo } })
  if (recentCount >= MAX_REQUESTS_PER_HOUR) {
    return res.status(429).json({ error: 'Too many OTP requests for this number. Please try again later.' })
  }

  const code = generateCode()
  await Otp.create({ phone, code, expiresAt: new Date(Date.now() + OTP_TTL_MS) })
  const smsSent = await sendSms(phone, code)

  res.json({
    ok: true,
    message: smsSent
      ? 'OTP sent via SMS.'
      : 'Could not confirm SMS delivery — showing the code here as a fallback.',
    ...(smsSent ? {} : { testCode: code }),
  })
})

router.post('/verify', async (req, res) => {
  const phone = normalizePhone(req.body.phone)
  const code = String(req.body.code ?? '').trim()

  const otp = await Otp.findOne({ phone, verified: false }).sort({ requestedAt: -1 })
  if (!otp) {
    return res.status(400).json({ error: 'No pending OTP for this number. Request a new one.' })
  }
  if (otp.expiresAt < new Date()) {
    return res.status(400).json({ error: 'This code has expired. Request a new one.' })
  }
  if (otp.attempts >= MAX_VERIFY_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many incorrect attempts. Request a new code.' })
  }
  if (otp.code !== code) {
    otp.attempts += 1
    await otp.save()
    return res.status(400).json({ error: 'Incorrect code.' })
  }

  otp.verified = true
  await otp.save()

  const token = jwt.sign({ phone, scope: 'registration-form' }, process.env.JWT_SECRET, { expiresIn: '15m' })
  res.json({ ok: true, token })
})

export default router
