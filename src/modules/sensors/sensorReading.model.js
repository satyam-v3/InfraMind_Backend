import mongoose from "mongoose";

const sensorReadingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    temperature: { type: Number, default: null },
    humidity: { type: Number, default: null },

    light: { type: Boolean, default: false },
    motion: { type: Boolean, default: false },
    occupancy: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.model("SensorReading", sensorReadingSchema);
