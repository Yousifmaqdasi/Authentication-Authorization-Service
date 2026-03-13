

import { Router } from "express";
import { getMe, register, login, logout, refreshToken } from "../controllers/auth.controller";

const authRouter = Router()

authRouter.get('/me', getMe)
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/refresh', refreshToken)

export default authRouter