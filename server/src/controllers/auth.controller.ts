
import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { accessToken } from "../utils/generate.access.token";
import { refreshToken } from "../utils/generate.refresh.token";
import { clearAccessToken } from "../utils/clear.access.token";
import { clearRefreshToken } from "../utils/clear.refresh.token";
import { AuthRequest } from "../types/auth.types";




export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await registerUser(req.body);

        if(user?.error === "Failed validation") {
            return next({status: 400, message: "Invalid request data"})
            
        }

        if(user?.error === "User exists") {
            return next({status: 409, message: "User already exists"})
        }

        if(!user.user) return next({status: 500, message: "Could not create user"})

        accessToken(res, user.user.id)
        refreshToken(res, user.user.id)
        
        res.status(201).json(user);
    } 
    catch (error) {
        next(error)
    }
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await loginUser(req.body)

        if(user?.error === "Failed validation") {
            
            return next({status: 400, message: "Invalid request data"})
        }

        if(user?.error === "Invalid credentials") {
            return next({status: 401, message: "Invalid credentials"})
        }

        if(!user.id) return next({status: 500, message: "Login failed"})
        
        accessToken(res, user.id)
        refreshToken(res, user.id)

        res.status(200).json({message: user.message, id: user.id})

    } 
    catch (error) {
        next(error)
    }
}


export const logout = (req: Request, res: Response) => {
    clearAccessToken(res)
    clearRefreshToken(res)

    res.status(200).json({message: "Logged out successfully"})
}


export const refresh = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return next({status: 401, message: "Unauthorized"})
        
        const userId = req.userId
        if(!userId) return next({status: 401, message: "Invalid token payload"})

        accessToken(res, userId)

        res.json({message: "Access token refreshed successfully"})
    } 
    
    catch (error) {
        next(error)
    }
}


export const forgotPassword = async () => {
    
}


export const resetPassword = async () => {

}