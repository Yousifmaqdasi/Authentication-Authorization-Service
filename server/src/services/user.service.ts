import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { usersTable } from "../models/users.schema";
import { userFields } from "../drizzle/selects/user.select";


export const getUsers = async () => {
  const users = await db
    .select(userFields)
    .from(usersTable);

  return users;
};

export const getUser = async (userId: number) => {
  const [user] = await db
    .select(userFields)
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return user ?? null;
};

export const deleteUser = async (userId: number) => {
  const [user] = await db
  .delete(usersTable)
  .where(eq(usersTable.id, userId))
  .returning({id: usersTable.id})

  return user ?? null
};

