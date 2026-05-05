import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import type { Permission } from "../types/auth.types";
import { AppError } from "../utils/custom.error";

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;
  if (!token) return next(new AppError("Invalid token", 401));

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");

  try {
    const decoded = jwt.verify(token, secret) as {
      userId: number;
      permissions: Permission[];
      isVerified: boolean;
    };

    req.user = {
      id: decoded.userId,
      permissions: decoded.permissions,
      isVerified: decoded.isVerified,
    };

    next();
  } catch (error) {
    console.error("Authentication failed:", error);
    return next(new AppError("Unauthorized", 401));
  }
};
