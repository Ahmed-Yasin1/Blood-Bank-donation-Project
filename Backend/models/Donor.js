import mongoose from 'mongoose'

const donationHistorySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    location: { type: String, trim: true },
    status: { type: String, enum: ['Completed', 'Scheduled', 'Cancelled'], default: 'Completed' }
  },
  { _id: false }
)

const donorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 65 },
    bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    lastDonationDate: { type: Date },
    eligibilityStatus: { type: Boolean, default: true },
    donationHistory: [donationHistorySchema],
    medicalNotes: { type: String, trim: true }
  },
  { collection: 'donors', timestamps: true }
)

donorSchema.pre('save', function (next) {
  this.eligibilityStatus = this.age >= 18 && this.age <= 65
  next()
})

const Donor = mongoose.model('Donor', donorSchema)
export default Donor
