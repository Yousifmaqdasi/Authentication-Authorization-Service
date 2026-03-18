
import { eq } from "drizzle-orm";
import { db } from "../database";
import { usersTable } from "../database/schemas/users.schema";
import bcrypt from 'bcrypt';
import { resetToken } from "../utils/generate.reset.token";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { resetTokenTable } from "../database/schemas/tokens.schema";


export const registerUser = async (email: string, password: string) => {

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await db.insert(usersTable)
    .values({
        email: email,
        password: hashedPassword
    })
    .onConflictDoNothing({target: usersTable.email})
    .returning({
        id: usersTable.id,
        email: usersTable.email
    })

    if(newUser.length === 0) return {error: "User exists"}

    return {user: newUser[0]}
}


export const loginUser = async (email: string, password: string) => {

    const userCredentials = await db.select({
        id: usersTable.id,
        email: usersTable.email,
        password: usersTable.password
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))

    const user = userCredentials[0]
    if(!user) return {error: "Invalid credentials"}

    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch) return {error: "Invalid credentials"}

    return {id: user.id}
}


export const forgotPasswordService = async (email: string) => {

    const userCredentials = await db.select({
        id: usersTable.id,
        email: usersTable.email
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))

    const user = userCredentials[0]
    if(!user) return 

    const token = resetToken(user.id)
    const hashedToken = await bcrypt.hash(token, 12)

    const insertTokenInDb = await db.insert(resetTokenTable)
    .values({
        user_id: user.id,
        hashed_token: hashedToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000)
    })

    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        secure: false, 
        auth: {
            user: 'a0c33d396eb514',
            pass: '9df21a6d528ac7',
        }
    });

    const mailOptions = {
        from: 'noreply@myapp.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: https://yourfrontend.com/reset-password/${token}`
    }

    await transporter.sendMail(mailOptions)

}


export const resetPasswordService = async (token: string, password: string) => {

    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET!) as {userId: number}
    const hashedPassword = await bcrypt.hash(password, 12)

    await db
    .update(usersTable)
    .set({password: hashedPassword})
    .where(eq(usersTable.id, decoded.userId))
}