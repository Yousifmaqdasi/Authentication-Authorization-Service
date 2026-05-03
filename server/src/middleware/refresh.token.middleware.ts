import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyRefreshToken = (
  req: Request,
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
      isVerified: boolean;
    };

    req.user = { id: decoded.userId, isVerified: decoded.isVerified };

    next();
  } catch (error) {
    return next({ status: 401, message: "Invalid or expired refresh token" });
  }
};
