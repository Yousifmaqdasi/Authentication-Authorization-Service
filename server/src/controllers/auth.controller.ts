import { Request, Response, NextFunction } from "express";

import {
  registerUser,
  loginUser,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  refresh as refreshService,
} from "../services/auth.service";
import {
  createAccessToken,
  clearAccessToken,
} from "../utils/generate.access.token";

import {
  createRefreshToken,
  clearRefreshToken,
} from "../utils/generate.refresh.token";

import { AuthRequest, Permission } from "../types/auth.types";

import {
  validateRegisterForm,
  validateLoginForm,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from "../validators/auth.schema";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedResult = validateRegisterForm(req.body);
    if (!validatedResult.success)
      return next({ status: 400, message: "Failed validation" });

    const { name, email, password } = validatedResult.data;

    const result = await registerUser(name, email, password);

    if (result?.error === "User exists")
      return next({ status: 409, message: "User already exists" });

    if (!result.user)
      return next({ status: 500, message: "Could not create user" });

    const userPermissions: Permission[] = result.user.permissions;

    createAccessToken(res, result.user.id, userPermissions);
    await createRefreshToken(res, result.user.id, userPermissions);

    res.status(201).json(result.user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedResult = validateLoginForm(req.body);
    if (!validatedResult.success)
      return next({ status: 400, message: "Invalid request data" });

    const { email, password } = validatedResult.data;

    const result = await loginUser(email, password);

    if (result?.error === "Invalid credentials")
      return next({ status: 401, message: "Invalid credentials" });

    if (!result.id) return next({ status: 500, message: "Login failed" });

    const userPermissions: Permission[] = result.permissions;

    createAccessToken(res, result.id, userPermissions);
    await createRefreshToken(res, result.id, userPermissions);

    res.status(200).json({ message: "Logged in successfully", id: result.id });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  clearAccessToken(res);
  clearRefreshToken(res);

  res.status(200).json({ message: "Logged out successfully" });
};

export const refresh = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next({ status: 401, message: "Unauthorized" });

    const result = await refreshService(userId);

    if (result.error) return next({ status: 401, message: "Invalid token" });

    if (!result.id || !result.permissions) {
      return next({ status: 404, message: "User not found" });
    }

    createAccessToken(res, result.id, result.permissions);
    console.log(result.permissions)
    console.log(result.id)

    res.json({ message: "Access token refreshed successfully" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedResult = validateForgotPasswordInput(req.body);
    if (!validatedResult.success)
      return next({ status: 400, message: "Invalid request data" });

    const { email } = validatedResult.data;

    await forgotPasswordService(email);

    return res
      .status(200)
      .json({ message: "Check your email for password reset instructions" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedResult = validateResetPasswordInput(req.body);
    if (!validatedResult.success)
      return next({ status: 400, message: "Invalid request data" });

    const { userId, token } = req.params as { userId: string; token: string };

    if (!userId || !token) {
      return next({ status: 400, message: "Invalid request" });
    }

    const { password } = validatedResult.data;

    const result = await resetPasswordService(Number(userId), token, password);

    if (result?.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return next(error);
  }
};
