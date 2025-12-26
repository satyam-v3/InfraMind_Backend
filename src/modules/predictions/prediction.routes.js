import express from "express";
import { getPredictions } from "./prediction.controller.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPredictions);

export default router;
