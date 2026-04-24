import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import { Role } from "../types/auth.types";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");

  try {
    const decoded = jwt.verify(token, secret) as {
      userId: number;
      role: string;
    };

    req.user = { id: decoded.userId, role: decoded.role as Role };

    next();
  } catch (error) {
    console.error("Authentication failed:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};


