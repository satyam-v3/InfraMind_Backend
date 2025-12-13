import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },      // e.g. "temperature"
    message: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
