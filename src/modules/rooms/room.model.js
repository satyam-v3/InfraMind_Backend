import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    light: { type: Boolean, default: false },
    fan: { type: Boolean, default: false },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    // ---- static info ----
    name: { type: String, required: true },
    building: { type: String, required: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, default: 0 },

    // ---- live state (UPDATED BY MQTT) ----
    currentTemperature: { type: Number, default: null },
    currentLight: { type: Boolean, default: false },
    currentOccupancy: { type: Number, default: 0 },
    motionDetected: { type: Boolean, default: false },
    lastSensorUpdate: { type: Date, default: null },

    // ---- derived ----
    isOccupied: { type: Boolean, default: false },

    // ---- devices ----
    devices: { type: deviceSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
