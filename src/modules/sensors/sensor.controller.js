import { ingestReading, getLatestReadingsPerRoom } from "./sensor.service.js";

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
