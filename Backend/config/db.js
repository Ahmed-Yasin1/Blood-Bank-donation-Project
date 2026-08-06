import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("No MongoDB URI found. Set MONGODB_URI in your environment.");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.warn("Primary Atlas connection failed:", error.message);

    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/bloodbank", {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("MongoDB Connected Successfully using local fallback");
    } catch (fallbackError) {
      console.error("MongoDB Connection Failed:", fallbackError.message);
      process.exit(1);
    }
  }
};

export default connectDB;