
import { eq } from "drizzle-orm"
import { db} from "../database"
import { usersTable } from "../database/schemas/users.schema"
import { validateRegisterForm } from "../validators/register.schema";
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

    // GENERATE TOKENS LATER

}