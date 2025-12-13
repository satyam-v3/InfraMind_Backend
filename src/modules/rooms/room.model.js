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
    name: { type: String, required: true },
    building: { type: String, required: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, default: 0 },
    isOccupied: { type: Boolean, default: false },
    devices: { type: deviceSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
