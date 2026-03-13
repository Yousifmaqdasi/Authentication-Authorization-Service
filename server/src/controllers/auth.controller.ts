

import { Request, Response, NextFunction } from "express"
import { getUser, registerUser } from "../services/auth.service"


interface AuthRequest extends Request{
    userId?: number
}


export const getMe = async (req: AuthRequest, res: Response, next: NextFunction ) => {
    try {
        if(!req.userId) return res.status(401).json({message: "Not Authorized"})

        const user = await getUser()
        res.status(200).json(user)
    } 
    catch (error) {
        next(error)
    }
}


export const register = async (req: Request, res: Response) => {
    try {
        const user = await registerUser()
        res.status(201).json(user)
    } 
    
    catch (error) {

    }
}


export const login = async (req: Request, res: Response) => {
    try {
        
    } 
    
    catch (error) {
        
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