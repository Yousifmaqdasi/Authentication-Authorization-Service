import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { usersTable } from "../models/users.schema";
import bcrypt from "bcrypt";
import { refreshTokenTable, resetTokenTable } from "../models/tokens.schema";
import crypto from "crypto";
import { getPermissions } from "../utils/permissions";
import { sendResetEmail } from "./email.service";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await db
    .insert(usersTable)
    .values({
      email: email,
      name: name,
      password: hashedPassword,
    })
    .onConflictDoNothing({ target: usersTable.email })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
    });

  if (newUser.length === 0) return { error: "User exists" };

  const user = newUser[0];

  const permissions = getPermissions(user.role);

  return { user: { ...user, permissions } };
};

export const loginUser = async (email: string, password: string) => {
  const userCredentials = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      password: usersTable.password,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  const user = userCredentials[0];
  if (!user) return { error: "Invalid credentials" };

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return { error: "Invalid credentials" };

  const permissions = getPermissions(user.role);

  return { id: user.id, permissions };
};

export const logout = async (userId: number) => {
  await db
    .delete(refreshTokenTable)
    .where(eq(refreshTokenTable.user_id, userId));
};

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) return { error: "Invalid token" };

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const refreshTokenInDb = await db
    .select()
    .from(refreshTokenTable)
    .where(eq(refreshTokenTable.hashed_token, hashedToken));

  const token = refreshTokenInDb[0];
  if (!token) return { error: "Invalid token" };

  if (token.expires_at < new Date()) {
    return { error: "Expired token" };
  }

  const userInfo = await db
    .select({ id: usersTable.id, role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, token.user_id));

  const user = userInfo[0];
  if (!user) return { error: "User not found" };

  const permissions = getPermissions(user.role);

  return { id: user.id, permissions };
};

export const forgotPassword = async (email: string) => {
  const userCredentials = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  const user = userCredentials[0];
  if (!user) return;

  await db.delete(resetTokenTable).where(eq(resetTokenTable.user_id, user.id));

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(token, 12);

  await db
    .insert(resetTokenTable)
    .values({
      user_id: user.id,
      hashed_token: hashedToken,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    })
    .onConflictDoUpdate({
      target: resetTokenTable.user_id,
      set: {
        hashed_token: hashedToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

  await sendResetEmail(email, user.id, token);
};

export const resetPassword = async (
  userId: number,
  token: string,
  password: string,
) => {
  const tokens = await db
    .select({
      userId: resetTokenTable.user_id,
      hashedToken: resetTokenTable.hashed_token,
      expiresAt: resetTokenTable.expires_at,
    })
    .from(resetTokenTable)
    .where(eq(resetTokenTable.user_id, userId));

  if (tokens.length === 0) return { error: "Invalid token" };

  if (tokens[0].expiresAt < new Date()) return { error: "Invalid token" };

  const isMatch = await bcrypt.compare(token, tokens[0].hashedToken);
  if (!isMatch) return { error: "Invalid token" };

  const hashedPassword = await bcrypt.hash(password, 12);

  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, userId));

  await db.delete(resetTokenTable).where(eq(resetTokenTable.user_id, userId));
};
