import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    receiptNo: { type: String, required: true },
    buyerId: { type: String, required: true },
    plotId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Cash', 'Card', 'EasyPaisa', 'Bank Transfer', 'JazzCash'], required: true },
    status: { type: String, enum: ['Received', 'Pending', 'Overdue'], required: true },
    timestamp: { type: String, required: true },
  },
  { _id: false, versionKey: false, toJSON: { virtuals: true } }
)

paymentSchema.virtual('id').get(function () {
  return this._id
})

export default mongoose.model('Payment', paymentSchema)
