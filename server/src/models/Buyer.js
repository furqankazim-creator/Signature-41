import mongoose from 'mongoose'

const installmentSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    dueDate: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'due', 'overdue'], required: true },
    paidDate: { type: String, default: null },
  },
  { _id: false }
)

const buyerSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    cnic: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    plotId: { type: String, required: true },
    agentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    installments: { type: [installmentSchema], default: [] },
    status: { type: String, enum: ['Current', 'Overdue', 'Completed'], required: true },
    registeredAt: { type: String, required: true },
  },
  { _id: false, versionKey: false, toJSON: { virtuals: true } }
)

buyerSchema.virtual('id').get(function () {
  return this._id
})

export default mongoose.model('Buyer', buyerSchema)
