

import { Router } from "express";
import { getMe, register, login, logout, refresh } from "../controllers/auth.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { verifyRefreshToken } from "../middleware/refresh.validation.middleware";

const authRouter = Router()

authRouter.get('/me', verifyAccessToken, getMe)
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', verifyAccessToken, logout)
authRouter.post('/refresh', verifyRefreshToken, refresh)

export default authRouter