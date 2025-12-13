import express from "express";
import { ingestSensorData, getLatestSensors } from "./sensor.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// IoT devices: unauthenticated simple POST (you can secure later via token/shared key)
router.post("/ingest", ingestSensorData);

// Dashboard: protected
router.get("/latest", authMiddleware, getLatestSensors);

export default router;
