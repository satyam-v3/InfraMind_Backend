import { ingestReading, getLatestReadingsPerRoom } from "./sensor.service.js";
import SensorReading from "./sensorReading.model.js";
export const ingestSensorData = async (req, res, next) => {
  try {
    // ESP32 will send { roomId, temperature, humidity, light, motion }
    const reading = await ingestReading(req.body);

    const io = req.app.get("io");
    if (io) {
      io.emit("sensor:update", {
        roomId: reading.roomId,
        temperature: reading.temperature,
        humidity: reading.humidity,
        light: reading.light,
        motion: reading.motion,
        createdAt: reading.createdAt,
      });
    }

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getLatestSensors = async (req, res, next) => {
  try {
    const result = await getLatestReadingsPerRoom();
    res.json(result);
  } catch (err) {
    next(err);
  }
};
export const getSensorHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;

    const readings = await SensorReading.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(readings);
  } catch (err) {
    next(err);
  }
};