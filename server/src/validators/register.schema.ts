
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

export const validateRegisterForm = (data: unknown) => {
    return registerSchema.safeParse(data)
}