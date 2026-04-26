import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";

import { Permission } from "../types/auth.types";

function requirePermission(permission: Permission) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({ status: 401, message: "Unauthorized" });
    }

    if (!req.user.permissions.includes(permission)) {
      return next({ status: 403, message: "Access denied" });
    }

    next();
  };
}
export default requirePermission;
