import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/custom.error";

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    next(new AppError("Unauthorized! No refresh token provided", 401));

  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error("REFRESH_TOKEN_SECRET is not defined");

  try {
    const decoded = jwt.verify(refreshToken, secret) as {
      userId: number;
      isVerified: boolean;
    };

    req.user = { id: decoded.userId, isVerified: decoded.isVerified };

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired refresh token", 401));
  }
};
