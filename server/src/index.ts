import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import authRouter from "./auth.router";
import cors from "cors";
import jwt from "jsonwebtoken";

const onlineUsers = new Map<string, string>();

function getOnlineUserList() {
  return Array.from(onlineUsers.values());
}

interface DecodedToken {
  userId: string;
  username: string;
}

interface SocketWithAuth extends Socket {
  decoded_token?: DecodedToken;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3000;
const GENERAL_ROOM = "general"; // The only room we are using for now

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use("/api/auth", authRouter);

io.use((socket: SocketWithAuth, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_default_secret"
    ) as DecodedToken;
    socket.decoded_token = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", async (socket: SocketWithAuth) => {
  console.log(
    `Authenticated user connected: ${socket.decoded_token?.username} (${socket.id})`
  );

  // Automatically join the user to the "general" room
  socket.join(GENERAL_ROOM);
  console.log(
    `User ${socket.decoded_token?.username} joined room: ${GENERAL_ROOM}`
  );

  if (socket.decoded_token) {
    onlineUsers.set(socket.id, socket.decoded_token.username);
    io.to(GENERAL_ROOM).emit("update_user_list", getOnlineUserList());
  }

  // Listen for a message from this user
  socket.on("chat_message", (msg) => {
    const username = socket.decoded_token?.username || "Anonymous";
    const messageWithAuthor = {
      author: username,
      content: msg,
    };

    // Broadcast directly to the only room we have
    io.to(GENERAL_ROOM).emit("chat_message", messageWithAuthor);
  });

  socket.on("disconnect", () => {
    // Remove user from the list and broadcast the update
    if (socket.decoded_token) {
      onlineUsers.delete(socket.id);
      io.to(GENERAL_ROOM).emit("update_user_list", getOnlineUserList());
      console.log(`User ${socket.decoded_token.username} disconnected`);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
