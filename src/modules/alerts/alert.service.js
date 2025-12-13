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
  const alert = await Alert.create(payload);
  return alert;
};
