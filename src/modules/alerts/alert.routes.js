import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getAlerts, setAlertRead, createAlertManual } from "./alert.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAlerts);
router.patch("/:id/read", setAlertRead);

// test-only endpoint for generating alerts
router.post("/", createAlertManual);

export default router;
