import { Router } from 'express'
import Agent from '../models/Agent.js'

const router = Router()

router.get('/', async (_req, res) => {
  const agents = await Agent.find().sort({ _id: 1 })
  res.json(agents)
})

router.get('/:id', async (req, res) => {
  const agent = await Agent.findById(req.params.id)
  if (!agent) return res.status(404).json({ error: 'Agent not found.' })
  res.json(agent)
})

export default router
