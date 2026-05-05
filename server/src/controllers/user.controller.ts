import { Request, Response, NextFunction } from "express";
import { clearAccessToken } from "../utils/tokens/generate.access.token";
import { clearRefreshToken } from "../utils/tokens/generate.refresh.token";
import {
  getUsers as getUsersService,
  getUser as getUserService,
  deleteUser as deleteUserService,
} from "../services/user.service";
import asyncHandler from "../utils/async.handler";
import { AppError } from "../utils/custom.error";
import { requireUser } from "../utils/require.user";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    requireUser(req);
    const user = await getUserService(req.user.id);
    if (!user) return next(new AppError("User not found", 404));

    res.json(user);
  },
);

export const deleteCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    requireUser(req);
    const user = await deleteUserService(req.user.id);
    if (!user) return next(new AppError("User not found", 404));

    clearAccessToken(res);
    clearRefreshToken(res);

    res.status(204).send();
  },
);

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await getUsersService();
  res.json(users);
});

export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return next(new AppError("Invalid id", 400));

    const user = await getUserService(id);
    if (!user) return next(new AppError("User not found", 404));

    res.json(user);
  },
);

export const deleteUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return next(new AppError("Invalid id", 400));

    const user = await deleteUserService(id);
    if (!user) return next(new AppError("User not found", 404));

    res.status(204).send();
  },
);
