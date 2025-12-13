import mongoose from "mongoose";

const sensorReadingSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    temperature: Number,
    humidity: Number,
    light: Boolean,
    motion: Boolean,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.model("SensorReading", sensorReadingSchema);
