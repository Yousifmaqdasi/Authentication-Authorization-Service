import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

import { verifyAccessToken } from "../middleware/access.token.middleware";
import { verifyRefreshToken } from "../middleware/refresh.token.middleware";
import { authLimiter } from "../middleware/rate.limiter.middleware";

const authRouter = Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post("/logout", verifyAccessToken, logout);
authRouter.post("/refresh", verifyRefreshToken, refresh);
authRouter.post("/forgot-password", authLimiter, forgotPassword);
authRouter.post("/reset-password/:userId/:token", authLimiter, resetPassword);

export default authRouter;

