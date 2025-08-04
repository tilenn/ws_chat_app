import { Router } from "express";
import { authMiddleware, AuthenticatedRequest } from "./auth.middleware";
import prisma from "./db";

const router = Router();

// This endpoint will fetch all rooms the authenticated user is a member of.
router.get("/", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    // This case should theoretically not be reached due to the middleware, but it's good practice
    return res.status(401).json({ message: "Authentication error" });
  }

  try {
    const rooms = await prisma.room.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
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
