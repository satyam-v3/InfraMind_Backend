import Room from "./room.model.js";

export const getRooms = async () => {
  return Room.find().sort({ name: 1 });
};

export const toggleDevice = async (roomId, deviceType) => {
  const room = await Room.findById(roomId);
  if (!room) {
    const err = new Error("Room not found");
    err.statusCode = 404;
    throw err;
  }

  if (!room.devices) room.devices = {};

  if (!(deviceType in room.devices)) {
    const err = new Error("Invalid device type");
    err.statusCode = 400;
    throw err;
  }

  room.devices[deviceType] = !room.devices[deviceType];
  await room.save();
  return room;
};
