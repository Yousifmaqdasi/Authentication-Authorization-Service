
import { Router } from "express";
import { getMe } from "../controllers/user.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";

const usersRouter = Router()


usersRouter.get('/me', verifyAccessToken, getMe)



export default usersRouter