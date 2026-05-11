import { Router } from "express";
import {
  getCurrentUser,
  deleteCurrentUser,
  getUsers,
  getUserById,
  deleteUserById,
} from "../controllers/user.controller";
import { verifyAccessToken } from "../middleware/access.token.middleware";
import requirePermission from "../middleware/role.middleware";
import { PERMISSIONS } from "../config/permissions";
import { requireVerified } from "../middleware/require.verified.middleware";

const usersRouter = Router();

usersRouter.use(verifyAccessToken);
usersRouter.use(requireVerified);

// IMPORTANT: accessToken middleware must always be applied before these routes
// the middleware runs before these routes, so req.user is always defined.
// Safe to use req.user!.id without checking for null.

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
usersRouter.get("/", requirePermission(PERMISSIONS.USER_READ), getUsers);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.get("/me", getCurrentUser);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Delete current logged in user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user deleted successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.delete("/me", deleteCurrentUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
usersRouter.get("/:id", requirePermission(PERMISSIONS.USER_READ), getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
usersRouter.delete(
  "/:id",
  requirePermission(PERMISSIONS.USER_DELETE),
  deleteUserById,
);

export default usersRouter;
