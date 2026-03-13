
import { Response } from "express"

export const clearAccessToken = (res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })
}