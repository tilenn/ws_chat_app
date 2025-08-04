import { Router } from "express";
import { authMiddleware } from "./auth.middleware";
import prisma from "./db";

const router = Router();

// This endpoint fetches all users in the system.
// It's protected, so only logged-in users can see the list.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
      orderBy: {
        username: "asc",
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

export default router;
