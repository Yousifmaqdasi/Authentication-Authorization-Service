import { getPermissions } from "../get.permissions";
import { createAccessToken } from "./generate.access.token";
import { createRefreshToken } from "./generate.refresh.token";
import { Response } from "express";

export const issueTokens = async (
  res: Response,
  user: { id: number; role: string; isVerified: boolean }
) => {
  const permissions = getPermissions(user.role);
  createAccessToken(res, user.id, permissions, user.isVerified);
  await createRefreshToken(res, user.id, user.isVerified);
};