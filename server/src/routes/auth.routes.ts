import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

import { verifyJwt } from "../middleware/auth.middleware";
import { authenticateWithRefreshToken } from "../middleware/refresh.validation.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", verifyJwt, logout);
authRouter.post("/refresh", authenticateWithRefreshToken, refresh);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:userId/:token", resetPassword);

export default authRouter;

