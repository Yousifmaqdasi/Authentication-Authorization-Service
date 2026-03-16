
import z from 'zod'

const registerSchema = z.object({
    email: z
    .email()
    .trim(),

    password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{10,}$/,
    `Minimum ten characters, at least one uppercase letter, one lowercase letter and one number`)
})

const loginSchema = z.object({
    email: z
    .email()
    .trim(),

    password: z
    .string()
    .min(1, 'Password is required')
})

const forgotPasswordSchema = z.object({
    email: z
    .email()
    .trim()
})

const resetPasswordSchema = z.object({
    password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{10,}$/,
    `Minimum ten characters, at least one uppercase letter, one lowercase letter and one number`)
})


export const validateRegisterForm = (data: unknown) => {
    return registerSchema.safeParse(data)
}

export const validateLoginForm = (data: unknown) => {
    return loginSchema.safeParse(data)
}

export const validateForgotPasswordInput = (data: unknown) => {
    return forgotPasswordSchema.safeParse(data)
}

export const validateResetPasswordInput = (data: unknown) => {
    return resetPasswordSchema.safeParse(data)
}

