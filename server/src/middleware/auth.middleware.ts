import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../types/auth.types'


export const verifyAccessToken = (req: AuthRequest, res: Response, next: NextFunction) => {

    const token = req.cookies.accessToken
    if(!token) return res.status(401).json({message: "Unauthorized"})

    const secret = process.env.ACCESS_TOKEN_SECRET
    if(!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined') 

    try {
        const decodedToken = jwt.verify(token, secret) as {userId: number}
        const userId = decodedToken.userId

        req.userId = userId
        next()
    } 
    catch (error) {
        console.error("Authentication failed:", error); 
        return res.status(401).json({error: 'Unauthorized'})
    }
}