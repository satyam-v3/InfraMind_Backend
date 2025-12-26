import SensorReading from "../sensors/sensorReading.model.js";
import Room from "../rooms/room.model.js";

/**
 * Simple AI-like prediction using recent sensor data
 */
export const generatePredictions = async () => {
  const rooms = await Room.find();

  const predictions = [];

  for (const room of rooms) {
    const readings = await SensorReading.find({ roomId: room._id })
      .sort({ createdAt: -1 })
      .limit(20);

    if (readings.length === 0) continue;

    const avgTemp =
      readings.reduce((sum, r) => sum + (r.temperature || 0), 0) /
      readings.length;

    const avgOccupancy =
      readings.reduce((sum, r) => sum + (r.occupancy || 0), 0) /
      readings.length;

    let risk = "low";

    if (avgTemp > 30 || avgOccupancy > room.capacity) {
      risk = "high";
    } else if (avgTemp > 26 || avgOccupancy > room.capacity * 0.8) {
      risk = "medium";
    }

    predictions.push({
      roomId: room._id,
      roomName: room.name,
      predictedTemperature: avgTemp.toFixed(1),
      predictedOccupancy: Math.round(avgOccupancy),
      riskLevel: risk,
      generatedAt: new Date(),
    });
  }

  return predictions;
};
