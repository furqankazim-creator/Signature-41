import mongoose from 'mongoose'

const agentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    agency: { type: String, required: true },
    phone: { type: String, default: '' },
    initials: { type: String, required: true },
    mtdSales: { type: Number, required: true },
    mtdRevenue: { type: Number, required: true },
    commission: { type: Number, required: true },
    leadsNew: { type: Number, required: true },
    leadsContacted: { type: Number, required: true },
    leadsBooked: { type: Number, required: true },
  },
  { _id: false, versionKey: false, toJSON: { virtuals: true } }
)

agentSchema.virtual('id').get(function () {
  return this._id
})

export default mongoose.model('Agent', agentSchema)
