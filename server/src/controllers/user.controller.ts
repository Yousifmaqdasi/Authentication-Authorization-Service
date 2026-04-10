import { AuthRequest } from "../types/auth.types";
import { Request, Response, NextFunction} from "express";
import { clearAccessToken } from "../utils/clear.access.token";
import { clearRefreshToken } from "../utils/clear.refresh.token";
import {
    getMe as getMeService , 
    deleteMe as deleteMeService, 
    getUsers as getUsersService} 
from "../services/user.service";



export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.userId) return next({status: 401, message: "Unauthorized"})

        const user = await getMeService(req.userId);
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

        const user = await deleteMeService(req.userId)
        if(!user) return next({status: 404, message: "User was not found"})

        clearAccessToken(res)
        clearRefreshToken(res)

        res.status(204).json(user)
    } 
    catch (error) {
        next(error)
    }
}


export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getUsersService()
        res.json(users)
    } 
    catch (error) {
        next(error)
    }
}