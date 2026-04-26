import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import type { Permission } from "../types/auth.types";

export const verifyJwt = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;
  if (!token) return next({ status: 401, message: "Invalid token" });

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");

  try {
    const decoded = jwt.verify(token, secret) as {
      userId: number;
      permissions: Permission[]
    };

    req.user = { id: decoded.userId, permissions: decoded.permissions };

    next();
  } catch (error) {
    console.error("Authentication failed:", error);
    return next({ status: 401, message: "Unauthorized" });
  }
};


