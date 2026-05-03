import { Request, Response, NextFunction } from "express";
import { Permission } from "../types/auth.types";

function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next({ status: 401, message: "Unauthorized" });
    }

    if (!user.permissions || !user.permissions.includes(permission)) {
      return next({ status: 403, message: "Access denied" });
    }

    next();
  };
}
export default requirePermission;
