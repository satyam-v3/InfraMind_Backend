import SensorReading from "./sensorReading.model.js";

export const ingestReading = async (payload) => {
  const reading = await SensorReading.create(payload);
  return reading;
};

export const getLatestReadingsPerRoom = async () => {
  // Simple version: get latest 100 readings and reduce in JS
  const docs = await SensorReading.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const map = new Map();

  for (const d of docs) {
    const key = String(d.roomId);
    if (!map.has(key)) {
      map.set(key, d);
    }
  }

  return Array.from(map.values()).map((r) => ({
    roomId: r.roomId,
    temperature: r.temperature,
    humidity: r.humidity,
    light: r.light,
    motion: r.motion,
    createdAt: r.createdAt,
  }));
};
