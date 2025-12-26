import express from "express";
import { getAllUsers, login } from "./auth.controller.js";
import User from "./auth.model.js";

const router = express.Router();

router.post("/login", login);
router.get(
  "/users",
  async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
  }
);

export default router;
