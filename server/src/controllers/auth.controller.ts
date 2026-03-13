
import { Request, Response, NextFunction } from "express";
import { getUser, registerUser, loginUser } from "../services/auth.service";
import { accessToken } from "../utils/generate.access.token";
import { refreshToken } from "../utils/generate.refresh.token";
import { clearAccessToken } from "../utils/clear.access.token";
import { clearRefreshToken } from "../utils/clear.refresh.token";



interface AuthRequest extends Request{
    userId?: number;
}


export const getMe = async (req: AuthRequest, res: Response, next: NextFunction ) => {
    try {
        if(!req.userId) return res.status(401).json({message: "Not Authorized"});

        const user = await getUser(req.userId);

        if(!user) return res.status(404).json({message: "User was not found"})

        res.status(200).json(user);
    } 
    catch (error) {
        console.log(error)
        next(error);
    }
}



export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await registerUser(req.body);

        if(user?.error === "Failed validation") {
            return res.status(400).json({message: "Invalid request data"})
        }

        if(user?.error === "User exists") {
            return res.status(409).json({message: "User already exists"})
        }

        if(!user.user) return res.status(500).json({message: "Could not create user"})

        accessToken(res, user.user.id)
        refreshToken(res, user.user.id)
        
        res.status(201).json(user);
    } 
    catch (error) {
        console.log(error)
        next(error)
    }
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await loginUser(req.body)

        if(user?.error === "Failed validation") {
            return res.status(400).json({message: "Invalid request data"})
        }

        if(user?.error === "Invalid credentials") {
            return res.status(401).json({message: "Invalid credentials"})
        }

        if(!user.id) return res.status(500).json({message: "Login failed"})
        
        accessToken(res, user.id)
        refreshToken(res, user.id)

        res.status(200).json({message: user.message, id: user.id})

    } 
    catch (error) {
        console.log(error)
        next(error)
    }
}


export const logout = (req: Request, res: Response) => {
    clearAccessToken(res)
    clearRefreshToken(res)

    res.status(200).json({message: "Logged out successfully"})
}


export const refresh = async (req: Request, res: Response) => {
    try {
        
    } 
    
    catch (error) {
        
    }
}