
import { eq } from "drizzle-orm";
import { db } from "../database";
import { usersTable } from "../database/schemas/users.schema";


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


export const deleteUser = async (userId: number) => {

    const user = await db
    .delete(usersTable)
    .where(eq(usersTable.id, userId))
    .returning({id: usersTable.id})

    if(user.length === 0) return null

    return user[0]
}