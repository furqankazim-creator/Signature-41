import mongoose from 'mongoose'

const plotSchema = new mongoose.Schema(
  {
    _id: { type: String },
    block: { type: String, enum: ['A', 'B', 'C', 'D', 'E'], required: true },
    plotNo: { type: Number, required: true },
    type: { type: String, enum: ['Residential', 'Commercial'], required: true },
    sizeSqYd: { type: Number, required: true },
    category: { type: String, enum: ['A', 'B', 'C'], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Reserved', 'Sold', 'On-Hold'], required: true },
    amenities: { type: [String], default: [] },
    buyerId: { type: String, default: null },
  },
  { _id: false, versionKey: false, toJSON: { virtuals: true } }
)

plotSchema.virtual('id').get(function () {
  return this._id
})

export default mongoose.model('Plot', plotSchema)
