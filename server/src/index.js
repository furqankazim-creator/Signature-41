import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.routes.js'
import plotsRoutes from './routes/plots.routes.js'
import buyersRoutes from './routes/buyers.routes.js'
import paymentsRoutes from './routes/payments.routes.js'
import agentsRoutes from './routes/agents.routes.js'
import portalRoutes from './routes/portal.routes.js'
import otpRoutes from './routes/otp.routes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? '*' }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/plots', plotsRoutes)
app.use('/api/buyers', buyersRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/agents', agentsRoutes)
app.use('/api/portal', portalRoutes)
app.use('/api/otp', otpRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal server error.' })
})

const PORT = process.env.PORT ?? 4000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB:', process.env.MONGODB_URI)
    app.listen(PORT, () => console.log(`Signature 41 API listening on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
