import { AuthRequest } from "../types/auth.types";
import { Request, Response, NextFunction } from "express";
import { clearAccessToken } from "../utils/generate.access.token";
import { clearRefreshToken } from "../utils/generate.refresh.token";
import {
  getUsers as getUsersService,
  getUser as getUserService,
  deleteUser as deleteUserService,
} from "../services/user.service";

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserService(req.user!.id);
    if (!user) return next({ status: 404, message: "User was not found" });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await deleteUserService(req.user!.id);
    if (!user) return next({ status: 404, message: "User was not found" });

    clearAccessToken(res);
    clearRefreshToken(res);

    res.status(204).send();
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

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) return next({ status: 400, message: "Invalid id" });
    
    const user = await getUserService(id);
    if (!user) return next({ status: 404, message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) return next({ status: 400, message: "Invalid id" });
    
    const user = await deleteUserService(id);
    if (!user) return next({ status: 404, message: "User not found" });

    res.status(204).send()
  } catch (error) {
    next(error);
  }
};
