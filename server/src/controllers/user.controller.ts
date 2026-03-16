
import { AuthRequest } from "../types/auth.types";
import { Response, NextFunction } from "express";
import { getUser, deleteUser } from "../services/user.service";



export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.userId) return next({status: 401, message: "Unauthorized"})

        const user = await getUser(req.userId);
        if(!user) return next({status: 404, message: "User was not found"})

        res.status(200).json(user);
    } 
    catch (error) {
        next(error);
    }
}


export const deleteMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.userId) return next({status: 401, message: "Unauthorized"})

        const user = await deleteUser(req.userId)
        if(!user) return next({status: 404, message: "User was not found"})

        res.status(200).json(user)
    } 
    catch (error) {
        next(error)
    }
}