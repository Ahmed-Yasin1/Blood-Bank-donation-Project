import mongoose from 'mongoose'
import validator from 'validator'
 

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: true,
      validate: [validator.isStrongPassword, 'please enter a strong password']
    },
    role: {
      type: String,
      default: 'client',
      enum: ['client', 'admin', 'doctor']
    }
  },
  {
    collection: 'users',
    timestamps: true
  }
)
const User = mongoose.model('User', userSchema)
export default User
