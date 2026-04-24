import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";


const checkRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!user.role || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
}
  

export default checkRole;