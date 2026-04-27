import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/auth.types";
import { Permission } from "../types/auth.types";

export const verifyRefreshToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return next({
      status: 401,
      message: "Unauthorized! No refresh token provided",
    });

  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error("REFRESH_TOKEN_SECRET is not defined");

  try {
    const decoded = jwt.verify(refreshToken, secret) as {
      userId: number;
      permissions: Permission[];
    };

    const userId = decoded.userId;
    if (!userId) return next({ status: 401, message: "Invalid token" });

    req.user = { id: userId, permissions: decoded.permissions };
    console.log(decoded.permissions)

    next();
  } catch (error) {
    return next({ status: 401, message: "Invalid or expired refresh token" });
  }
};
