import mongoose from "mongoose";

const bloodInventorySchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    bloodType: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      default: 0
    },

    expiryDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("BloodInventory", bloodInventorySchema);