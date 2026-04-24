import { Router } from "express";
import { getMe, deleteMe, getUsers} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import checkRole from "../middleware/role.middleware";
import { getUser } from "../controllers/user.controller";

const usersRouter = Router()

usersRouter.get('/', authMiddleware, checkRole(["admin"]), getUsers)
usersRouter.get('/:id', authMiddleware ,getUser)
usersRouter.get('/me', authMiddleware, getMe)
usersRouter.delete('/me', authMiddleware, deleteMe)


export default usersRouter