import { Response, NextFunction } from "express"
import { roles } from "../utils/roles"
import type { Roles } from "../types/role.types"
import { AuthRequest } from "../types/auth.types"

export const checkRoleMiddleware = (action: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const userRole = req.user?.role
        if(!userRole) return res.status(403).json({ message: "Access Denied" })

        const permissions = roles[userRole as keyof Roles].can
        if (!permissions) return res.status(403).json({ message: "Access Denied" })

        if (permissions.includes(action)) {
            next()
        } 
        else {
            res.status(403).json({message: "Access Denied" })
        }
    }
}

