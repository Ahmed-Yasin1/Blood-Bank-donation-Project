import mongoose from "mongoose";

const EmergencyRequestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital is required"],
    },
    bloodType: {
      type: String,
      required: [true, "Blood type is required"],
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
      uppercase: true,
    },
    unitsRequired: {
      type: Number,
      required: [true, "Units required is required"],
      min: [1, "At least 1 unit required"],
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      required: [true, "Urgency level is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{7,15}$/, "Please provide a valid phone number"],
    },
    status: {
      type: String,
      enum: ["Pending", "Searching", "Matched", "Completed", "Cancelled"],
      default: "Pending",
    },
    matchedDonors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
EmergencyRequestSchema.index({ status: 1, urgency: 1 });
EmergencyRequestSchema.index({ bloodType: 1, location: 1 });

export default mongoose.model("EmergencyRequest", EmergencyRequestSchema);
