import { Router } from 'express'
import Payment from '../models/Payment.js'

const router = Router()

router.get('/', async (_req, res) => {
  const payments = await Payment.find().sort({ timestamp: -1 })
  res.json(payments)
})

export default router
