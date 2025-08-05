import { Router } from "express";
import { authMiddleware } from "./auth.middleware"; // Still protected
import prisma from "./db";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
});

export default router;
