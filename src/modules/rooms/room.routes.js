import express from "express";
import { listRooms, toggleRoomDevice } from "./room.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listRooms);
router.post("/:id/devices/toggle", toggleRoomDevice);

export default router;
