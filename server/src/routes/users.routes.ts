import { Router } from "express";
import {
  getCurrentUser,
  deleteCurrentUser,
  getUsers,
  getUserById,
  deleteUserById,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import checkRole from "../middleware/role.middleware";

const usersRouter = Router();
 
usersRouter.use(authMiddleware);

usersRouter.get("/", checkRole(["admin"]), getUsers);
usersRouter.get("/me", getCurrentUser);
usersRouter.delete("/me", deleteCurrentUser);
usersRouter.get("/:id", checkRole(["admin"]), getUserById);
usersRouter.delete("/:id", checkRole(["admin"]), deleteUserById);

export default usersRouter;
