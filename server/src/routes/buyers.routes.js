import { Router } from 'express'
import Buyer from '../models/Buyer.js'
import Plot from '../models/Plot.js'
import Payment from '../models/Payment.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req, res) => {
  const buyers = await Buyer.find().sort({ _id: 1 })
  res.json(buyers)
})

router.get('/:id', async (req, res) => {
  const buyer = await Buyer.findById(req.params.id)
  if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })
  res.json(buyer)
})

router.post('/', requireAuth, async (req, res) => {
  const { plotId, name, cnic, phone, email, agentId, installmentsTotal, markAsSold } = req.body

  const plot = await Plot.findById(plotId)
  if (!plot) return res.status(404).json({ error: 'Plot not found.' })

  const last = await Buyer.find({}, { _id: 1 }).sort({ _id: -1 }).limit(1)
  const maxNum = last.length ? Number(last[0]._id.replace('BUY-', '')) : 0
  const id = `BUY-${String(maxNum + 1).padStart(4, '0')}`

  const now = new Date()
  const baseAmount = Math.round(plot.price / installmentsTotal)
  const installments = Array.from({ length: installmentsTotal }, (_, i) => {
    const dueDate = new Date(now.getFullYear(), now.getMonth(), 1)
    dueDate.setMonth(dueDate.getMonth() + i + 1)
    dueDate.setDate(7)
    const amount = i === installmentsTotal - 1 ? plot.price - baseAmount * (installmentsTotal - 1) : baseAmount
    return { index: i, dueDate: dueDate.toISOString(), amount, status: 'due', paidDate: null }
  })

  const buyer = await Buyer.create({
    _id: id,
    name,
    cnic,
    phone,
    email,
    plotId,
    agentId,
    totalAmount: plot.price,
    installments,
    status: 'Current',
    registeredAt: now.toISOString(),
  })

  plot.status = markAsSold ? 'Sold' : 'Reserved'
  plot.buyerId = id
  await plot.save()

  res.status(201).json(buyer)
})

router.post('/:id/payments', requireAuth, async (req, res) => {
  const { amount, method } = req.body
  const buyer = await Buyer.findById(req.params.id)
  if (!buyer) return res.status(404).json({ error: 'Buyer not found.' })

  const idx = buyer.installments.findIndex((i) => i.status !== 'paid')
  if (idx === -1) return res.status(400).json({ error: 'All installments are already paid.' })

  const now = new Date()
  buyer.installments[idx].status = 'paid'
  buyer.installments[idx].paidDate = now.toISOString()

  const hasOverdue = buyer.installments.some((i) => i.status !== 'paid' && new Date(i.dueDate) <= now)
  const allPaid = buyer.installments.every((i) => i.status === 'paid')
  buyer.status = allPaid ? 'Completed' : hasOverdue ? 'Overdue' : 'Current'
  await buyer.save()

  const lastPayment = await Payment.find({}, { _id: 1 }).sort({ _id: -1 })
  const maxPmt = lastPayment.reduce((m, p) => Math.max(m, Number(p._id.replace('PMT-', '')) || 0), 999)
  const lastReceipt = await Payment.find({}, { receiptNo: 1 }).sort({ receiptNo: -1 })
  const maxRcp = lastReceipt.reduce((m, p) => Math.max(m, Number(p.receiptNo.replace('RCP-', '')) || 0), 49999)

  const payment = await Payment.create({
    _id: `PMT-${maxPmt + 1}`,
    receiptNo: `RCP-${maxRcp + 1}`,
    buyerId: buyer._id,
    plotId: buyer.plotId,
    amount,
    method,
    status: 'Received',
    timestamp: now.toISOString(),
  })

  res.status(201).json({ payment, buyer })
})

export default router
