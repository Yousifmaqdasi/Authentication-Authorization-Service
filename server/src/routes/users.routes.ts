import { Router } from "express";
import {
  getCurrentUser,
  deleteCurrentUser,
  getUsers,
  getUserById,
  deleteUserById,
} from "../controllers/user.controller";
import { verifyJwt } from "../middleware/auth.middleware";
import requirePermission from "../middleware/role.middleware";
import { PERMISSIONS } from "../config/permissions";

const usersRouter = Router();

usersRouter.use(verifyJwt);

// IMPORTANT: authMiddleware must always be applied before these routes
// authMiddleware runs before these routes, so req.user is always defined.
// Safe to use req.user!.id without checking for null.

usersRouter.get("/", requirePermission(PERMISSIONS.USER_READ), getUsers);
usersRouter.get("/me", getCurrentUser);
usersRouter.delete("/me", deleteCurrentUser);
usersRouter.get("/:id", requirePermission(PERMISSIONS.USER_READ), getUserById);
usersRouter.delete("/:id", requirePermission(PERMISSIONS.USER_DELETE), deleteUserById,);

export default usersRouter;
