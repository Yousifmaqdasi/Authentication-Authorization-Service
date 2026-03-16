
import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, forgotPasswordService, resetPasswordService } from "../services/auth.service";
import { accessToken } from "../utils/generate.access.token";
import { refreshToken } from "../utils/generate.refresh.token";
import { clearAccessToken } from "../utils/clear.access.token";
import { clearRefreshToken } from "../utils/clear.refresh.token";
import { AuthRequest } from "../types/auth.types";
import { validateRegisterForm } from "../validators/auth.schema";
import { validateLoginForm } from "../validators/auth.schema";
import { validateForgotPasswordInput } from "../validators/auth.schema";
import { validateResetPasswordInput } from "../validators/auth.schema";


export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedResult = validateRegisterForm(req.body)
        if(!validatedResult.success) return next({status: 400, message: "Failed validation"})
        
        const {email, password} = validatedResult.data

        const result = await registerUser(email, password);

        if(result?.error === "User exists") {
            return next({status: 409, message: "User already exists"})
        }

        if(!result.user) return next({status: 500, message: "Could not create user"})

        accessToken(res, result.user.id)
        refreshToken(res, result.user.id)
        
        res.status(201).json(result.user);
    } 
    catch (error) {
        next(error)
    }
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedResult = validateLoginForm(req.body)
        if(!validatedResult.success) return next({status: 400, message: "Invalid request data"})

        const {email, password} = validatedResult.data

        const result = await loginUser(email, password)

        if(result?.error === "Invalid credentials") {
            return next({status: 401, message: "Invalid credentials"})
        }

        if(!result.id) return next({status: 500, message: "Login failed"})
        
        accessToken(res, result.id)
        refreshToken(res, result.id)

        res.status(200).json({message: result.message, id: result.id})

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


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedResult = validateForgotPasswordInput(req.body) 
        if(!validatedResult.success) return next({status: 400, message: "Invalid request data"})

        const {email} = validatedResult.data

        const result = await forgotPasswordService(email)
    } 
    catch (error) {
        
    }
}


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedResult = validateResetPasswordInput(req.body)  
        if(!validatedResult.success) return next({status: 400, message: "Invalid request data"})
    } 
    catch (error) {
        
    }
}