import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { usersTable } from "../models/users.schema";
import bcrypt from "bcrypt";
import { refreshTokenTable, resetTokenTable } from "../models/tokens.schema";
import crypto from "crypto";
import { sendResetEmail } from "./email.service";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60);

  const [newUser] = await db
    .insert(usersTable)
    .values({
      email: email,
      name: name,
      password: hashedPassword,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires: verificationTokenExpires,
    })
    .onConflictDoNothing({ target: usersTable.email })
    .returning({
      name: usersTable.name,
      email: usersTable.email,
    });

  // FOR POST /register ROUTE
  // If user is not verified → tell them to verify their email
  // If user is verified → tell them the account already exists
  // First register → "Check your email for verification"
  // Any later attempts (still unverified) → "You need to verify your email"
  // If already verified → "User already exists, please log in"

  if (!newUser) return { error: "User exists" };

  return { user: { ...newUser }, verificationToken };
};

export const verifyEmail = async (verificationToken: string) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const [user] = await db
    .select({
      id: usersTable.id,
      verificationTokenExpires: usersTable.verificationTokenExpires,
      role: usersTable.role,
      isVerified: usersTable.isVerified,
    })
    .from(usersTable)
    .where(eq(usersTable.verificationToken, hashedToken));

  if (!user) return { error: "Invalid token" };

  if (
    !user.verificationTokenExpires ||
    user.verificationTokenExpires < new Date()
  )
    return {
      error: "Token expired",
    };

  await db
    .update(usersTable)
    .set({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    })
    .where(eq(usersTable.id, user.id));

  return {
    user: { id: user.id, role: user.role, isVerified: true },
  };
};

export const loginUser = async (email: string, password: string) => {
  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      password: usersTable.password,
      role: usersTable.role,
      isVerified: usersTable.isVerified,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) return { error: "Invalid email or password" };

  if (!user.isVerified) return { error: "Invalid email or password" };

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return { error: "Invalid email or password" };

  return {
    user: { id: user.id, role: user.role, isVerified: user.isVerified },
  };
};

export const logout = async (userId: number) => {
  await db
    .delete(refreshTokenTable)
    .where(eq(refreshTokenTable.user_id, userId));
};

export const refresh = async (refreshToken: string, userId: number) => {
  if (!refreshToken || !userId) return { error: "Invalid token" };

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const [token] = await db
    .select()
    .from(refreshTokenTable)
    .where(eq(refreshTokenTable.hashed_token, hashedToken));

  if (!token || token.user_id !== userId) return { error: "Invalid token" };

  if (token.expires_at < new Date()) {
    return { error: "Expired token" };
  }

  const [user] = await db
    .select({
      id: usersTable.id,
      role: usersTable.role,
      isVerified: usersTable.isVerified,
    })
    .from(usersTable)
    .where(eq(usersTable.id, token.user_id));

  if (!user) return { error: "User not found" };

  return {
    user: { id: user.id, role: user.role, isVerified: user.isVerified },
  };
};

export const forgotPassword = async (email: string) => {
  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) return;

  await db.delete(resetTokenTable).where(eq(resetTokenTable.user_id, user.id));

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

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
  const [tokenInDB] = await db
    .select({
      userId: resetTokenTable.user_id,
      hashedToken: resetTokenTable.hashed_token,
      expiresAt: resetTokenTable.expires_at,
    })
    .from(resetTokenTable)
    .where(eq(resetTokenTable.user_id, userId));

  if (!tokenInDB) return { error: "Invalid token" };

  if (tokenInDB.expiresAt < new Date()) return { error: "Invalid token" };

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  if (hashedToken !== tokenInDB.hashedToken) return { error: "Invalid token" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, userId));

  await db.delete(resetTokenTable).where(eq(resetTokenTable.user_id, userId));
};
