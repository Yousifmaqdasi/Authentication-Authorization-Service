import { Router } from "express";
import { getMe, deleteMe, getUsers} from "../controllers/user.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { checkRoleMiddleware } from "../middleware/role.middleware";

const usersRouter = Router()

usersRouter.get('/', verifyAccessToken, checkRoleMiddleware("admin"), getUsers)
usersRouter.get('/me', verifyAccessToken, getMe)
usersRouter.delete('/me', verifyAccessToken, deleteMe)


export default usersRouter