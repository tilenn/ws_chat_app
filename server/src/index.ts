import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authRouter from "./auth.router";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

const PORT = process.env.PORT || 3000;
const GENERAL_ROOM = "general";

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use("/api/auth", authRouter);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 1. Automatically join the user to the "general" room
  socket.join(GENERAL_ROOM);
  console.log(`User ${socket.id} joined room: ${GENERAL_ROOM}`);

  // 2. Listen for a message from this user
  socket.on("chat_message", (msg) => {
    // 3. Broadcast the message to everyone in the "general" room
    io.to(GENERAL_ROOM).emit("chat_message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
