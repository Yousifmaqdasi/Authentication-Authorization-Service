import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types/auth.types'

export const verifyAccessToken = (req: AuthRequest, res: Response, next: NextFunction) => {

    const token = req.cookies.accessToken
    if(!token) return res.status(401).json({message: "Unauthorized"})

    const secret = process.env.ACCESS_TOKEN_SECRET
    if(!secret) throw new Error('ACCESS_TOKEN_SECRET is not defined') 

    try {
        const decodedToken = jwt.verify(token, secret) as {id: number, role: string}

        const userId = decodedToken.id
        const userRole = decodedToken.role

        req.user = {id: userId, role: userRole}

        next()
    } 
    catch (error) {
        console.error("Authentication failed:", error); 
        return res.status(401).json({error: 'Unauthorized'})
    }
}