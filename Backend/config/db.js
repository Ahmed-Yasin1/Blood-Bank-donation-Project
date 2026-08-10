import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI

    if (!mongoUri) {
      throw new Error('MONGODB_URI or MONGO_URI is not configured')
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    })

    console.log(`MongoDB Atlas connected successfully: ${mongoose.connection.host}`)
  } catch (error) {
    console.error('MongoDB Atlas connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB