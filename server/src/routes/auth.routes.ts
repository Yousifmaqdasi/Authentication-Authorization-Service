

import { Router } from "express";
import { getMe, register, login, logout, refresh } from "../controllers/auth.controller";

const authRouter = Router()

authRouter.get('/me', getMe)
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/refresh', refresh)

export default authRouter