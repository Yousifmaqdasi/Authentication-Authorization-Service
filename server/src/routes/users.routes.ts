import { Router } from "express";
import { getMe, deleteMe, getUsers } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import checkRole from "../middleware/role.middleware";
import { getUser } from "../controllers/user.controller";
import { deleteUser } from "../controllers/user.controller";

const usersRouter = Router();

usersRouter.use(authMiddleware);

usersRouter.get("/", checkRole(["admin"]), getUsers);
usersRouter.get("/me", getMe);
usersRouter.delete("/me", deleteMe);
usersRouter.get("/:id", checkRole(["admin"]), getUser);
usersRouter.delete("/:id", checkRole(["admin"]), deleteUser);

export default usersRouter;
