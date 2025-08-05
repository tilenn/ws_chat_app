import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Server } from "socket.io"; // 1. Import the Socket.IO Server type

interface DecodedToken {
  userId: string;
  username: string;
}

// Extend the Express Request type to include our custom properties
export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
  io?: Server; // 2. Add the optional io property
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_default_secret"
    ) as DecodedToken;

    // Attach the decoded user payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
