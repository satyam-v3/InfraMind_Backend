import { listAlerts, markAlertRead, createAlert } from "./alert.service.js";

export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await listAlerts();
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

export const setAlertRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await markAlertRead(id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Optional endpoint to test alerts manually
export const createAlertManual = async (req, res, next) => {
  try {
    const alert = await createAlert(req.body);

    const io = req.app.get("io");
    if (io) {
      io.emit("alert:new", alert);
    }

    res.status(201).json(alert);
  } catch (err) {
    next(err);
  }
};
