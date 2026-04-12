import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { usersTable } from "../models/users.schema";


export const getMe = async (userId: number) => {

    const user = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))

    if(user.length === 0) return null

    return user[0]
} 


export const deleteMe = async (userId: number) => {

    const user = await db
    .delete(usersTable)
    .where(eq(usersTable.id, userId))
    .returning({id: usersTable.id})

    if(user.length === 0) return null

    return user[0]
}


export const getUsers = async () => {

    const users = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email
    })
    .from(usersTable)

    return users
}