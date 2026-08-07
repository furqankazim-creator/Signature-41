import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  requestedAt: { type: Date, default: Date.now },
})

export default mongoose.model('Otp', otpSchema)
