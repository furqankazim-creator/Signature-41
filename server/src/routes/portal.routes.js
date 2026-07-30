import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Buyer from '../models/Buyer.js'
import Plot from '../models/Plot.js'
import Agent from '../models/Agent.js'
import Payment from '../models/Payment.js'
import { requireBuyerAuth } from '../middleware/buyerAuth.js'

const router = Router()

// ── Buyer Login (CNIC + Phone) ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { cnic, phone } = req.body
  if (!cnic || !phone) {
    return res.status(400).json({ error: 'CNIC and phone number are required.' })
  }

  const cleanCnic = String(cnic).replace(/\s/g, '')
  const cleanPhone = String(phone).replace(/\s/g, '')

  const buyer = await Buyer.findOne({ cnic: cleanCnic, phone: cleanPhone })
  if (!buyer) {
    return res.status(401).json({ error: 'No account found with this CNIC and phone number.' })
  }

  const token = jwt.sign(
    { sub: buyer._id, role: 'buyer' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    buyer: {
      id: buyer._id,
      name: buyer.name,
      cnic: buyer.cnic,
      phone: buyer.phone,
      email: buyer.email,
      plotId: buyer.plotId,
      status: buyer.status,
    },
  })
})

// ── Get Authenticated Buyer Profile ────────────────────────────────────
router.get('/me', requireBuyerAuth, async (req, res) => {
  const buyer = await Buyer.findById(req.buyer.sub)
  if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })

  res.json({
    id: buyer._id,
    name: buyer.name,
    cnic: buyer.cnic,
    phone: buyer.phone,
    email: buyer.email,
    plotId: buyer.plotId,
    agentId: buyer.agentId,
    totalAmount: buyer.totalAmount,
    status: buyer.status,
    registeredAt: buyer.registeredAt,
  })
})

// ── Get Buyer's Plot + Agent Info ──────────────────────────────────────
router.get('/plot', requireBuyerAuth, async (req, res) => {
  const buyer = await Buyer.findById(req.buyer.sub)
  if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })

  const plot = await Plot.findById(buyer.plotId)
  const agent = await Agent.findById(buyer.agentId)

  res.json({
    plot: plot
      ? {
          id: plot._id,
          block: plot.block,
          plotNo: plot.plotNo,
          type: plot.type,
          sizeSqYd: plot.sizeSqYd,
          category: plot.category,
          price: plot.price,
          status: plot.status,
          amenities: plot.amenities,
        }
      : null,
    agent: agent
      ? {
          id: agent._id,
          name: agent.name,
          agency: agent.agency,
          phone: agent.phone || '',
          initials: agent.initials,
        }
      : null,
  })
})

// ── Get Buyer's Payments + Installments ────────────────────────────────
router.get('/payments', requireBuyerAuth, async (req, res) => {
  const buyer = await Buyer.findById(req.buyer.sub)
  if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })

  const payments = await Payment.find({ buyerId: buyer._id }).sort({ timestamp: -1 })

  res.json({
    totalAmount: buyer.totalAmount,
    status: buyer.status,
    installments: buyer.installments,
    payments: payments.map((p) => ({
      id: p._id,
      receiptNo: p.receiptNo,
      amount: p.amount,
      method: p.method,
      status: p.status,
      timestamp: p.timestamp,
    })),
  })
})

// ── Get Buyer's Computed Notifications ─────────────────────────────────
router.get('/notifications', requireBuyerAuth, async (req, res) => {
  const buyer = await Buyer.findById(req.buyer.sub)
  if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })

  const now = new Date()
  const notifications = []
  let notifId = 1

  // Check each installment for notification-worthy events
  for (const inst of buyer.installments) {
    const dueDate = new Date(inst.dueDate)

    if (inst.status === 'overdue') {
      const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24))
      notifications.push({
        id: `notif-${notifId++}`,
        type: 'overdue',
        title: 'Installment Overdue',
        detail: `Installment #${inst.index + 1} of PKR ${inst.amount.toLocaleString()} was due on ${dueDate.toISOString().slice(0, 10)} — ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue.`,
        timestamp: dueDate.toISOString(),
        read: false,
      })
    } else if (inst.status === 'due') {
      const daysUntilDue = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24))
      if (daysUntilDue <= 30 && daysUntilDue >= 0) {
        notifications.push({
          id: `notif-${notifId++}`,
          type: 'upcoming',
          title: 'Installment Due Soon',
          detail: `Installment #${inst.index + 1} of PKR ${inst.amount.toLocaleString()} is due on ${dueDate.toISOString().slice(0, 10)} — ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} remaining.`,
          timestamp: dueDate.toISOString(),
          read: false,
        })
      }
    } else if (inst.status === 'paid' && inst.paidDate) {
      const paidDate = new Date(inst.paidDate)
      const daysSincePaid = Math.floor((now - paidDate) / (1000 * 60 * 60 * 24))
      if (daysSincePaid <= 60) {
        notifications.push({
          id: `notif-${notifId++}`,
          type: 'paid',
          title: 'Payment Received',
          detail: `Installment #${inst.index + 1} of PKR ${inst.amount.toLocaleString()} was successfully received on ${paidDate.toISOString().slice(0, 10)}.`,
          timestamp: inst.paidDate,
          read: false,
        })
      }
    }
  }

  // Overall status notifications
  if (buyer.status === 'Completed') {
    notifications.unshift({
      id: `notif-${notifId++}`,
      type: 'completed',
      title: 'All Payments Complete! 🎉',
      detail: 'Congratulations! All your installments have been paid in full. Your plot ownership is now fully settled.',
      timestamp: now.toISOString(),
      read: false,
    })
  }

  // Sort: overdue first, then upcoming, then paid
  const priority = { overdue: 0, upcoming: 1, completed: 2, paid: 3 }
  notifications.sort((a, b) => (priority[a.type] ?? 9) - (priority[b.type] ?? 9))

  res.json(notifications)
})

export default router
