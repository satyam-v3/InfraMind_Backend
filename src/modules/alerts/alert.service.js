import Alert from "./alert.model.js";

export const listAlerts = async () => {
  return Alert.find().sort({ createdAt: -1 }).limit(100);
};

export const markAlertRead = async (id) => {
  const alert = await Alert.findById(id);
  if (!alert) {
    const err = new Error("Alert not found");
    err.statusCode = 404;
    throw err;
  }
  alert.read = true;
  await alert.save();
  return alert;
};

export const createAlert = async (payload) => {
  const created = await Alert.create(payload);

  // 🔥 realtime emit
  global.io?.emit("alert:new", created);

  return created;
};

// ---------------- RULE ENGINE ----------------

export const evaluateRoomAlerts = async (room) => {
  if (!room) return;

  const alerts = [];

  // 🔥 High temperature
  if (room.currentTemperature !== null && room.currentTemperature > 30) {
    alerts.push({
      roomId: room._id,
      type: "High Temperature",
      severity: "high",
      message: `Temperature reached ${room.currentTemperature}°C`,
    });
  }

  // 🚨 Over capacity
  if (room.capacity > 0 && room.currentOccupancy > room.capacity) {
    alerts.push({
      roomId: room._id,
      type: "Over Capacity",
      severity: "high",
      message: `Occupancy ${room.currentOccupancy}/${room.capacity}`,
    });
  }

  // ⚠️ Sensor offline
  if (
    room.lastSensorUpdate &&
    Date.now() - room.lastSensorUpdate.getTime() > 2 * 60 * 1000
  ) {
    alerts.push({
      roomId: room._id,
      type: "Sensor Offline",
      severity: "medium",
      message: "No sensor update in last 2 minutes",
    });
  }

  for (const alert of alerts) {
    const exists = await Alert.findOne({
      roomId: alert.roomId,
      type: alert.type,
      read: false,
    });

    if (!exists) {
      const created = await Alert.create(alert);
      global.io?.emit("alert:new", created);
    }
  }
};
