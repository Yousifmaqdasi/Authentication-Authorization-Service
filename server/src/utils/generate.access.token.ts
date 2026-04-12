import { Response } from "express"
import jwt from "jsonwebtoken"


export const accessToken = (res: Response, userId: number, role: string) => {
    const accessToken = jwt.sign(
        {userId: userId, role: role },
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: "15m"}
    )
    
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "lax"
    })
}