
import jwt from "jsonwebtoken"

export const resetToken = (userId: number) => {
    const resetToken = jwt.sign(
        {userId: userId},
        process.env.RESET_TOKEN_SECRET!,
        {expiresIn: "15m"}
    )

    return resetToken
}