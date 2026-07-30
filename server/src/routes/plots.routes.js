import { Router } from 'express'
import Plot from '../models/Plot.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req, res) => {
  const plots = await Plot.find().sort({ _id: 1 })
  res.json(plots)
})

router.get('/:id', async (req, res) => {
  const plot = await Plot.findById(req.params.id)
  if (!plot) return res.status(404).json({ error: 'Plot not found.' })
  res.json(plot)
})

router.post('/', requireAuth, async (req, res) => {
  const { block, type, sizeSqYd, category, price, status, amenities } = req.body

  const last = await Plot.find({}, { _id: 1 }).sort({ _id: -1 }).limit(1)
  const maxNum = last.length ? Number(last[0]._id.replace('PLT-', '')) : 0
  const id = `PLT-${String(maxNum + 1).padStart(4, '0')}`

  const inBlock = await Plot.find({ block }, { plotNo: 1 }).sort({ plotNo: -1 }).limit(1)
  const plotNo = (inBlock[0]?.plotNo ?? 0) + 1

  const plot = await Plot.create({
    _id: id,
    block,
    plotNo,
    type,
    sizeSqYd,
    category,
    price,
    status,
    amenities: amenities ?? [],
  })

  res.status(201).json(plot)
})

router.patch('/:id', requireAuth, async (req, res) => {
  const { status } = req.body
  const plot = await Plot.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!plot) return res.status(404).json({ error: 'Plot not found.' })
  res.json(plot)
})

router.delete('/:id', requireAuth, async (req, res) => {
  const plot = await Plot.findById(req.params.id)
  if (!plot) return res.status(404).json({ error: 'Plot not found.' })
  if (plot.buyerId) {
    return res.status(400).json({ error: 'Cannot delete a plot that has a linked buyer.' })
  }
  await plot.deleteOne()
  res.status(204).end()
})

export default router
