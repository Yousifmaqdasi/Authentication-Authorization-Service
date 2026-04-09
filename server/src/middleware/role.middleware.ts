import { Response, NextFunction } from "express"
import { RoleRequest } from "../types/role.types"
import { roles } from "../utils/roles"
import type { Roles } from "../types/role.types"

const checkRole = (role: string, action: string) => {
    return (req: RoleRequest, res: Response, next: NextFunction) => {
        const userRole = req.user.role
        const permissions = roles[userRole as keyof Roles].can

        if (permissions.includes(action)) {
            next()
        } 
        else {
            res.status(403).json({message: "Access Denied" })
        }
    }
}