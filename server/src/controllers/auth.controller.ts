import { Request, Response, NextFunction } from "express";

import {
  registerUser,
  loginUser,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  refresh as refreshService,
  logout as logoutService,
  verifyEmail as verifyEmailService,
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
import { sendVerificationEmail } from "../services/email.service";

import {
  validateRegisterForm,
  validateLoginForm,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from "../validators/auth.schema";

import { getPermissions } from "../utils/permissions";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedResult = validateRegisterForm(req.body);
    if (!validatedResult.success)
      return next({
        status: 400,
        message: validatedResult.error.issues[0].message,
      });

    const { name, email, password } = validatedResult.data;

    const result = await registerUser(name, email, password);

    if (result?.error === "User exists")
      return next({ status: 409, message: "User already exists" });

    if (!result.user)
      return next({ status: 500, message: "Could not create user" });

    await sendVerificationEmail(result.user.email, result.verificationToken);

    res.status(201).json({ message: "Please verify your email" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await verifyEmailService(
    req.query.verificationToken as string,
  );

  if (result.error === "Invalid token")
    return next({ status: 400, message: "Invalid verification link" });

  if (result.error === "Token expired") {
    return next({ status: 400, message: "Token expired, request a new one" });
  }

  if (!result.user)
    return next({ status: 500, message: "Verification failed" });

  const permissions: Permission[] = getPermissions(result.user.role);

  createAccessToken(res, result.user.id, permissions);
  await createRefreshToken(res, result.user.id);

  res.status(200).json({ message: "Email verified successfully" });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedResult = validateLoginForm(req.body);
    if (!validatedResult.success)
      return next({
        status: 400,
        message: validatedResult.error.issues[0].message,
      });

    const { email, password } = validatedResult.data;

    const result = await loginUser(email, password);

    if (result.error)
      return next({ status: 401, message: "Invalid credentials" });

    if (!result.user) return next({ status: 500, message: "Login failed" });

    const permissions: Permission[] = getPermissions(result.user.role);

    createAccessToken(res, result.user.id, permissions);
    await createRefreshToken(res, result.user.id);

    res
      .status(200)
      .json({ message: "Logged in successfully", id: result.user.id });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  clearAccessToken(res);
  clearRefreshToken(res);

  const userId = req.user?.id;
  if (!userId) return next({ status: 401, message: "Unauthorized" });

  await logoutService(userId);

  res.json({ message: "Logged out successfully" });
};

export const refresh = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const userId = req.user?.id;
    if (!userId) return next({ status: 401, message: "Unauthorized" });

    const result = await refreshService(refreshToken, userId);

    if (result.error) return next({ status: 401, message: "Invalid token" });

    if (!result.user) {
      return next({ status: 404, message: "User not found" });
    }

    const permissions: Permission[] = getPermissions(result.user.role);

    createAccessToken(res, result.user.id, permissions);
    await createRefreshToken(res, result.user.id);

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
      return next({
        status: 400,
        message: validatedResult.error.issues[0].message,
      });

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
      return next({
        status: 400,
        message: validatedResult.error.issues[0].message,
      });

    const { userId, token } = req.params as { userId: string; token: string };

    if (!userId || !token) {
      return next({ status: 400, message: "Invalid request" });
    }

    const { password } = validatedResult.data;

    const result = await resetPasswordService(Number(userId), token, password);

    if (result?.error) {
      return res.status(400).json({ message: result.error });
    }

    res.json({ message: "Password reset successful" });
  } catch (error) {
    return next(error);
  }
};
