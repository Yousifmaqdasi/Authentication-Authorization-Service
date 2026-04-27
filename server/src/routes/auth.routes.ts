import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

import { verifyAccessToken } from "../middleware/accessToken.middleware";
import { verifyRefreshToken } from "../middleware/refreshToken.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", verifyAccessToken, logout);
authRouter.post("/refresh", verifyRefreshToken, refresh);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:userId/:token", resetPassword);

export default authRouter;

