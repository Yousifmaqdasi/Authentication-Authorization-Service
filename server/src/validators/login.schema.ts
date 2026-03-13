
import z from 'zod'


const loginSchema = z.object({
    email: z
    .email()
    .trim(),

    password: z
    .string()
    .min(1, 'Password is required')
})

export const validateLoginForm = (data: unknown) => {
    return loginSchema.safeParse(data)
}