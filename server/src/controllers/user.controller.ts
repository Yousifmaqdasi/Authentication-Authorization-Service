import { Request, Response, NextFunction } from "express";
import { clearAccessToken } from "../utils/generate.access.token";
import { clearRefreshToken } from "../utils/generate.refresh.token";
import {
  getUsers as getUsersService,
  getUser as getUserService,
  deleteUser as deleteUserService,
} from "../services/user.service";
import asyncHandler from "../utils/async.handler";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUserService(req.user!.id);
    if (!user) return next({ status: 404, message: "User was not found" });

    res.json(user);
  },
);

export const deleteCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await deleteUserService(req.user!.id);
    if (!user) return next({ status: 404, message: "User was not found" });

    clearAccessToken(res);
    clearRefreshToken(res);

    res.status(204).send();
  },
);

export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await getUsersService();
    res.json(users);
  },
);

export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return next({ status: 400, message: "Invalid id" });

    const user = await getUserService(id);
    if (!user) return next({ status: 404, message: "User not found" });

    res.status(200).json(user);
  },
);

export const deleteUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return next({ status: 400, message: "Invalid id" });

    const user = await deleteUserService(id);
    if (!user) return next({ status: 404, message: "User not found" });

    res.status(204).send();
  },
);
