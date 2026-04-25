import { Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { AuthRequest } from "../types/auth.types"

export const authenticateWithRefreshToken = (req: AuthRequest, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.status(401).json({message: "Unauthorized! No refresh token provided"})

    const secret = process.env.REFRESH_TOKEN_SECRET
    if(!secret) throw new Error('REFRESH_TOKEN_SECRET is not defined') 

    try {
        const decoded = jwt.verify(refreshToken, secret) as {userId: number}

        const userId = decoded.userId
        if(!userId) return 

        req.user = { id: userId }

        next()
    } 
    catch (error) {
        console.error("Authentication failed:", error); 
        return res.status(401).json({error: 'Invalid or expired refresh token'})
    }
}