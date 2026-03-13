
import { Response } from "express"
import jwt from "jsonwebtoken"


export const refreshToken = (res: Response, userId: number) => {
    const refreshToken = jwt.sign(
        {userId: userId},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: "7d"}
    )

     res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax"
    })

}