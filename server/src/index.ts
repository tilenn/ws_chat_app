import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import authRouter from "./auth.router";
import roomRouter from "./room.router";
import userRouter from "./user.router";
import cors from "cors";
import jwt from "jsonwebtoken";
import prisma from "./db";
import { AuthenticatedRequest } from "./auth.middleware";
import { Request, Response, NextFunction } from "express";

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

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as AuthenticatedRequest).io = io;
  next();
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/users", userRouter);

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

io.on("connection", (socket: SocketWithAuth) => {
  console.log(
    `Authenticated user connected: ${socket.decoded_token?.username} (${socket.id})`
  );

  if (socket.decoded_token) {
    onlineUsers.set(socket.id, socket.decoded_token.username);
    // broadcast the updated user list to EVERYONE.
    io.emit("update_user_list", getOnlineUserList());
  }

  // Listen for a request to join a specific room
  socket.on("join_room", async (roomId: string) => {
    // Leave all other rooms before joining a new one
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.leave(room);
      }
    }

    // Join the new room
    socket.join(roomId);
    console.log(
      `User ${socket.decoded_token?.username} joined room: ${roomId}`
    );

    // Broadcast the updated global user list to this room
    io.to(roomId).emit("update_user_list", getOnlineUserList());

    // Fetch message history for the newly joined room
    const messageHistory = await prisma.message.findMany({
      where: { roomId: roomId },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: { author: { select: { username: true } } },
    });

    const formattedHistory = messageHistory.map((msg) => ({
      id: msg.id,
      author: msg.author.username,
      content: msg.content,
      createdAt: msg.createdAt,
      likes: msg.likes,
    }));

    // Send the history only to the client that just joined
    socket.emit("message_history", formattedHistory);
  });

  socket.on(
    "chat_message",
    async ({ roomId, content }: { roomId: string; content: string }) => {
      if (!socket.decoded_token) return;

      const { userId } = socket.decoded_token;

      try {
        const newMessage = await prisma.message.create({
          data: {
            content,
            authorId: userId,
            roomId: roomId,
          },
          include: { author: { select: { username: true } } },
        });

        io.to(roomId).emit("chat_message", {
          id: newMessage.id,
          author: newMessage.author.username,
          content: newMessage.content,
          createdAt: newMessage.createdAt,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
  );

  socket.on("like_message", async ({ messageId }: { messageId: string }) => {
    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        return;
      }

      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: { likes: { increment: 1 } },
        include: { author: { select: { username: true } } },
      });

      io.to(message.roomId).emit("message_updated", {
        id: updatedMessage.id,
        author: updatedMessage.author.username,
        content: updatedMessage.content,
        createdAt: updatedMessage.createdAt,
        likes: updatedMessage.likes,
      });
    } catch (error) {
      console.error("Error liking message:", error);
    }
  });

  socket.on("disconnect", () => {
    if (socket.decoded_token) {
      onlineUsers.delete(socket.id);
      io.emit("update_user_list", getOnlineUserList());
      console.log(`User ${socket.decoded_token.username} disconnected`);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
