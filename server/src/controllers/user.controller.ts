import { AuthRequest } from "../types/auth.types";
import { Request, Response, NextFunction } from "express";
import { clearAccessToken } from "../utils/generate.access.token";
import { clearRefreshToken } from "../utils/generate.refresh.token";
import {
  getMe as getMeService,
  deleteMe as deleteMeService,
  getUsers as getUsersService,
  getUser as getUserByIdService,
} from "../services/user.service";

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) return next({ status: 401, message: "Unauthorized" });

    const user = await getMeService(req.user.id);
    if (!user) return next({ status: 404, message: "User was not found" });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) return next({ status: 401, message: "Unauthorized" });

    const user = await deleteMeService(req.user?.id);
    if (!user) return next({ status: 404, message: "User was not found" });

    clearAccessToken(res);
    clearRefreshToken(res);

    res.status(204).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await getUsersService();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) return next({ status: 401, message: "Unauthorized" });

    const id = Number(req.params.id)

    const user = await getUserByIdService(id);
    if (user.length === 0)
      return next({ status: 404, message: "User not found" });

    if(req.user.role !== "admin" && req.user.id !== id) {
        return next({ status: 403, message: "Access denied" });
    }


    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
