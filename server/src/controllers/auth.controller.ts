import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { clearAccessToken } from "../utils/generate.access.token";
import { clearRefreshToken } from "../utils/generate.refresh.token";
import { sendVerificationEmail } from "../services/email.service";
import * as authValidators from "../validators/auth.schema";
import { handleValidationResult } from "../utils/validate.result";
import { issueTokens } from "../utils/issue.auth.tokens";
import asyncHandler from "../utils/async.handler";
import { AppError } from "../utils/custom.error";
import { ERR_INVALID_TOKEN, ERR_EXPIRED_TOKEN } from "../constants/errors";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = handleValidationResult(
      authValidators.validateRegisterForm(req.body),
      next,
    );
    if (!validated) return;

    const { name, email, password } = validated;

    const result = await authService.register(name, email, password);

    if (result.error) {
      return next(new AppError(result.error, 409));
    }

    if (!result.user) {
      return next(new AppError("Registration failed", 500));
    }

    await sendVerificationEmail(result.user.email, result.verificationToken);

    res.status(201).json(result);
  },
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.verificationToken as string;

    if (!token) {
      return next(new AppError("Missing verification token", 400));
    }

    const result = await authService.verifyEmail(token);

    if (result.error) {
      const status =
        result.error === ERR_INVALID_TOKEN || result.error === ERR_EXPIRED_TOKEN
          ? 400
          : 500;

      return next(new AppError(result.error, status));
    }

    if (!result.user) {
      return next(new AppError("Verification failed", 500));
    }

    await issueTokens(res, result.user);

    res.status(200).json(result);
  },
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = handleValidationResult(
      authValidators.validateLoginForm(req.body),
      next,
    );
    if (!validated) return;

    const { email, password } = validated;

    const result = await authService.login(email, password);

    if (result.error) {
      return next(new AppError(result.error, 401));
    }

    if (!result.user) {
      return next(new AppError("Login failed", 500));
    }

    await issueTokens(res, result.user);

    res.status(200).json(result);
  },
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const result = await authService.logout(userId);

    clearAccessToken(res);
    clearRefreshToken(res);

    res.json(result);
  },
);

export const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError("Missing refresh token", 401));
    }

    const userId = req.user?.id;
    if (!userId) return next(new AppError("Unauthorized", 401));

    const result = await authService.refresh(refreshToken);

    if (result.error) {
      return next(new AppError(result.error, 401));
    }

    if (!result.user) {
      return next(new AppError("User not found", 404));
    }

    await issueTokens(res, result.user);

    res.json({ message: result.message });
  },
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = handleValidationResult(
      authValidators.validateForgotPasswordInput(req.body),
      next,
    );
    if (!validated) return;

    const { email } = validated;

    const result = await authService.forgotPassword(email);

    return res.status(200).json(result);
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = handleValidationResult(
      authValidators.validateResetPasswordInput(req.body),
      next,
    );
    if (!validated) return;

    const { userId, token } = req.params as { userId: string; token: string };

    if (!userId || !token) {
      return next(new AppError("Invalid request", 400));
    }

    const { password } = validated;

    const result = await authService.resetPassword(
      Number(userId),
      token,
      password,
    );

    if (result?.error) {
      return next(new AppError(result.error, 400));
    }
    res.json(result);
  },
);
