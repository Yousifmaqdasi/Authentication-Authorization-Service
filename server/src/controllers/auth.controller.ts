import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { clearAccessToken } from "../utils/generate.access.token";
import { clearRefreshToken } from "../utils/generate.refresh.token";
import { sendVerificationEmail } from "../services/email.service";
import * as authValidators from "../validators/auth.schema";
import { handleValidationResult } from "../utils/validate.result";
import { issueTokens } from "../utils/issueAuthTokens";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.query.verificationToken as string;

    if (!token) {
      return next({ status: 400, message: "Missing verification token" });
    }

    const result = await authService.verifyEmail(token);

    const user = result.user;

    if (result.error === "Invalid token")
      return next({ status: 400, message: "Invalid verification link" });

    if (result.error === "Token expired") {
      return next({ status: 400, message: "Token expired, request a new one" });
    }

    if (!user) return next({ status: 500, message: "Verification failed" });

    await issueTokens(res, user);

    res.status(200).json({ message: "Email verified successfully" });
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
    const validated = handleValidationResult(
      authValidators.validateLoginForm(req.body),
      next,
    );
    if (!validated) return;

    const { email, password } = validated;

    const result = await authService.login(email, password);

    const user = result.user;

    if (result.error) return next({ status: 401, message: result.error });

    if (!user) return next({ status: 500, message: "Login failed" });

    await issueTokens(res, user);

    res.status(200).json({ message: "Logged in successfully", id: user.id });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    clearAccessToken(res);
    clearRefreshToken(res);

    const userId = req.user?.id;
    if (!userId) return next({ status: 401, message: "Unauthorized" });

    await authService.logout(userId);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const userId = req.user?.id;
    if (!userId) return next({ status: 401, message: "Unauthorized" });

    const result = await authService.refresh(refreshToken);

    const user = result.user;

    if (result.error) return next({ status: 401, message: result.error });

    if (!user) {
      return next({ status: 404, message: "User not found" });
    }

    await issueTokens(res, user);

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
  } catch (error) {
    return next(error);
  }
};
