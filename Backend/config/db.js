import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    })

     console.log('MongoDB Connected Successfully ')
  } catch (error) {
    console.warn('Primary Atlas connection failed:', error.message)

    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/bloodbank', {
        serverSelectionTimeoutMS: 10000
      })
      console.log('MongoDB Connected Successfully ')
    } catch (fallbackError) {
      console.error('MongoDB Connection Failed:', fallbackError.message)
      process.exit(1)
    }
  }
}

export default connectDB
