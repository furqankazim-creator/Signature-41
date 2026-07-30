import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const admin = await Admin.findOne({ email: String(email).toLowerCase() })
  if (!admin) {
    return res.status(401).json({ error: 'Invalid admin email or password.' })
  }

  const ok = await bcrypt.compare(password, admin.passwordHash)
  if (!ok) {
    return res.status(401).json({ error: 'Invalid admin email or password.' })
  }

  const token = jwt.sign({ sub: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, admin: { name: admin.name, role: admin.role, email: admin.email } })
})

router.get('/me', requireAuth, async (req, res) => {
  const admin = await Admin.findById(req.admin.sub)
  if (!admin) return res.status(404).json({ error: 'Admin not found.' })
  res.json({ admin: { name: admin.name, role: admin.role, email: admin.email } })
})

export default router
