import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import predictionRoutes from "./modules/predictions/prediction.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import roomRoutes from "./modules/rooms/room.routes.js";
import sensorRoutes from "./modules/sensors/sensor.routes.js";
import alertRoutes from "./modules/alerts/alert.routes.js";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND,
    credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/predictions", predictionRoutes);


// error middleware last
app.use(errorHandler);

export default app;
