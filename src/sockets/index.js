import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND,
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    try {
      const user = jwt.verify(token, env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.user?.email || socket.id);

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });

  return io;
};

export default initSockets;
