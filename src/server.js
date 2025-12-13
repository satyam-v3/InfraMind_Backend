import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import initSockets from "./sockets/index.js";

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = initSockets(server);

  // make io accessible in controllers via req.app.get("io")
  app.set("io", io);

  server.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();
