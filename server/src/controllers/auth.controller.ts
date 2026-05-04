import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { clearAccessToken } from "../utils/generate.access.token";
import { clearRefreshToken } from "../utils/generate.refresh.token";
import { sendVerificationEmail } from "../services/email.service";
import * as authValidators from "../validators/auth.schema";
import { handleValidationResult } from "../utils/validate.result";
import { issueTokens } from "../utils/issue.auth.tokens";
import asyncHandler from "../utils/async.handler";

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
      return next({
        status: 409,
        message: result.error,
      });
    }

    if (!result.user)
      return next({ status: 500, message: "Could not create user" });

    await sendVerificationEmail(result.user.email, result.verificationToken);

    res.status(201).json({ message: "Please verify your email" });
  },
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.verificationToken as string;

    if (!token) {
      return next({ status: 400, message: "Missing verification token" });
    }

    const result = await authService.verifyEmail(token);

    if (result.error === "Invalid token")
      return next({ status: 400, message: "Invalid verification link" });

    if (result.error === "Token expired") {
      return next({ status: 400, message: "Token expired, request a new one" });
    }

    if (!result.user)
      return next({ status: 500, message: "Verification failed" });

    await issueTokens(res, result.user);

    res.status(200).json({ message: "Email verified successfully" });
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

    if (result.error) return next({ status: 401, message: result.error });

    if (!result.user) return next({ status: 500, message: "Login failed" });

    await issueTokens(res, result.user);

    res
      .status(200)
      .json({ message: "Logged in successfully", id: result.user.id });
  },
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next({ status: 401, message: "Unauthorized" });

    await authService.logout(userId);

    clearAccessToken(res);
    clearRefreshToken(res);

    res.json({ message: "Logged out successfully" });
  },
);

export const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next({ status: 401, message: "Missing refresh token" });
    }

    const userId = req.user?.id;
    if (!userId) return next({ status: 401, message: "Unauthorized" });

    const result = await authService.refresh(refreshToken);

    if (result.error) return next({ status: 401, message: result.error });

    if (!result.user) {
      return next({ status: 404, message: "User not found" });
    }

    await issueTokens(res, result.user);

    res.json({ message: "Access token refreshed successfully" });
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

    await authService.forgotPassword(email);

    return res
      .status(200)
      .json({ message: "Check your email for password reset instructions" });
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
      return next({ status: 400, message: "Invalid request" });
    }

    const { password } = validated;

    const result = await authService.resetPassword(
      Number(userId),
      token,
      password,
    );

    if (result?.error) {
      return next({ status: 400, message: result.error });
    }

    res.json({ message: "Password reset successful" });
  },
);
