import mongoose from "mongoose";
import validator from "validator";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format"
      }
    }
  },
  {
    collection: "hospitals",
    timestamps: true
  }
);

export default mongoose.model("Hospital", hospitalSchema);