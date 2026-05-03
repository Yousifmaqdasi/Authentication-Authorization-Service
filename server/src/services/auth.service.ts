import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { usersTable } from "../models/users.schema";
import bcrypt from "bcrypt";
import { refreshTokenTable, resetTokenTable } from "../models/tokens.schema";
import crypto from "crypto";
import { sendResetEmail } from "./email.service";
import { hashToken } from "../utils/hash.token";
import { getExpiry } from "../utils/get.expiry.date";
import {
  ERR_INVALID_CREDENTIALS,
  ERR_INVALID_TOKEN,
  ERR_EXPIRED_TOKEN,
} from "../constants/errors";
import { ONE_HOUR, FIFTEEN_MIN } from "../constants/time";

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const [existingUser] = await db
    .select({
      isVerified: usersTable.isVerified,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser) {
    return existingUser.isVerified
      ? { error: "User already exists, please log in" }
      : { error: "You need to verify your email" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedVerificationToken = hashToken(verificationToken);
  const expiresAt = getExpiry(ONE_HOUR);

  const [newUser] = await db
    .insert(usersTable)
    .values({
      email,
      name,
      password: hashedPassword,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires: expiresAt,
    })
    .returning({
      name: usersTable.name,
      email: usersTable.email,
    });

  return { user: newUser, verificationToken };
};

export const verifyEmail = async (verificationToken: string) => {
  const hashedToken = hashToken(verificationToken);

  const [user] = await db
    .select({
      id: usersTable.id,
      expiresAt: usersTable.verificationTokenExpires,
      role: usersTable.role,
      isVerified: usersTable.isVerified,
    })
    .from(usersTable)
    .where(eq(usersTable.verificationToken, hashedToken));

  if (!user) return { error: ERR_INVALID_TOKEN };

  if (!user.expiresAt || user.expiresAt < new Date())
    return {
      error: ERR_EXPIRED_TOKEN,
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

export const login = async (email: string, password: string) => {
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

  if (!user || !user.isVerified) return { error: ERR_INVALID_CREDENTIALS };

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return { error: ERR_INVALID_CREDENTIALS };

  return {
    user: { id: user.id, role: user.role, isVerified: user.isVerified },
  };
};

export const logout = async (userId: number) => {
  await db
    .delete(refreshTokenTable)
    .where(eq(refreshTokenTable.user_id, userId));
};

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) return { error: ERR_INVALID_TOKEN };

  const hashedToken = hashToken(refreshToken);

  const [token] = await db
    .select()
    .from(refreshTokenTable)
    .where(eq(refreshTokenTable.hashed_token, hashedToken));

  if (!token) return { error: ERR_INVALID_TOKEN };

  if (token.expires_at < new Date()) {
    return { error: ERR_EXPIRED_TOKEN };
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
  const hashedToken = hashToken(token);
  const expiresAt = getExpiry(FIFTEEN_MIN);

  await db
    .insert(resetTokenTable)
    .values({
      user_id: user.id,
      hashed_token: hashedToken,
      expires_at: expiresAt,
    })
    .onConflictDoUpdate({
      target: resetTokenTable.user_id,
      set: {
        hashed_token: hashedToken,
        expires_at: expiresAt,
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

  const hashedToken = hashToken(token);

  if (
    !tokenInDB ||
    tokenInDB.expiresAt < new Date() ||
    hashedToken !== tokenInDB.hashedToken
  ) {
    return { error: ERR_INVALID_TOKEN };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, userId));

  await db.delete(resetTokenTable).where(eq(resetTokenTable.user_id, userId));
};
