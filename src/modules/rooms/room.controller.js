import { getRooms, toggleDevice } from "./room.service.js";

export const listRooms = async (req, res, next) => {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

export const toggleRoomDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deviceType } = req.body;

    const updated = await toggleDevice(id, deviceType);

    // emit socket event
    const io = req.app.get("io");
    if (io) {
      io.emit("room:update", updated);
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
