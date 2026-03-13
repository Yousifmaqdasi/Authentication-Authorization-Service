
import { eq } from "drizzle-orm"
import { db} from "../database"
import { usersTable } from "../database/schemas/users.schema"
import { validateRegisterForm } from "../validators/register.schema";
import { validateLoginForm } from "../validators/login.schema";
import bcrypt from 'bcrypt'


export const getUser = async (userId: number) => {

    const user = await db.select({
        id: usersTable.id,
        email: usersTable.email
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))

    if(user.length === 0) return null

    return user[0]
} 


export const registerUser = async (body: unknown) => {

    const validatedResult = validateRegisterForm(body)
    if(!validatedResult.success) return {error: "Failed validation"}

    const {email, password} = validatedResult.data
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


export const loginUser = async (body: unknown) => {

    const validatedResult = validateLoginForm(body)
    if(!validatedResult.success) return {error: "Failed validation"}

    const {email, password} = validatedResult.data

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


