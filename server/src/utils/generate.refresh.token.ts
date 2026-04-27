import { Response } from "express";
import jwt from "jsonwebtoken";
import { Permission } from "../types/auth.types";
import { db } from "../config/db";
import { refreshTokenTable } from "../models/tokens.schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export const createRefreshToken = async (
  res: Response,
  userId: number,
  permissions: Permission[],
) => {
  const refreshToken = jwt.sign(
    { userId: userId, permissions: permissions },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" },
  );

  const hashedToken = await bcrypt.hash(refreshToken, 10);

  await db.delete(refreshTokenTable).where(eq(refreshTokenTable.user_id, userId))

  await db.insert(refreshTokenTable).values({
    hashed_token: hashedToken,
    user_id: userId,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });
};

export const clearRefreshToken = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};
