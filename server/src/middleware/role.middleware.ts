import { Response, NextFunction } from "express"
import { AuthRequest } from "../types/auth.types"


export const checkRoleMiddleware = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Access Denied" });
        }

        next()
    }
}

