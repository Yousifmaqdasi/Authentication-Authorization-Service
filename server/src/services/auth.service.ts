
import { eq } from "drizzle-orm";
import { db } from "../database";
import { usersTable } from "../database/schemas/users.schema";
import bcrypt from 'bcrypt';
import { resetToken } from "../utils/generate.reset.token";
import nodemailer from 'nodemailer'


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

    return {message: "Logged in successfully", id: user.id}
}


export const forgotPasswordService = async (email: string) => {

    const userCredentials = await db.select({
        id: usersTable.id,
        email: usersTable.email
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))

    const user = userCredentials[0]
    if(!user) return {error: "Invalid credentials"}

    const token = resetToken(user.id)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'my-email@gmail.com',
            pass: 'my-email-password'
        }
    })

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`
    }

    await transporter.sendMail(mailOptions)

}


export const resetPasswordService = async (password: string) => {

}