

import { Request, Response, NextFunction } from "express";
import { getUser, registerUser, loginUser } from "../services/auth.service";


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
            return res.status(400).json({message: "Invalid request data"})
        }

        if(user?.error === "Invalid credentials") {
            return res.status(401).json({message: "Invalid credentials"})
        }

        res.status(200).json({message: user.message, id: user.id})

    } 
    catch (error) {
        next(error)
    }
}


export const logout = async (req: Request, res: Response) => {
    try {
        
    } 
    
    catch (error) {
        
    }
}


export const refreshToken = async (req: Request, res: Response) => {
    try {
        
    } 
    
    catch (error) {
        
    }
}