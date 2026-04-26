import { Response } from "express";
import jwt from "jsonwebtoken";
import { Permission } from "../types/auth.types";

export const createAccessToken = (res: Response, userId: number, permissions: Permission[]) => {
  const accessToken = jwt.sign(
    { userId: userId, permissions: permissions },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" },
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
    sameSite: "lax",
  });
};

export const clearAccessToken = (res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};
