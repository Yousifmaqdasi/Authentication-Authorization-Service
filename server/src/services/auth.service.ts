import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { usersTable } from "../models/users.schema";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { resetTokenTable } from "../models/tokens.schema";
import crypto from "crypto";
import { ROLE_PERMISSIONS } from "../config/permissions";

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

  const permissions =
    ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

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

  const permissions =
    ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

  return { id: user.id, permissions };
};

export const refresh = async (userId: number) => {
  const userInfo = await db
    .select({
      id: usersTable.id,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  const user = userInfo[0];
  if (!user) return { error: "User not found" };

  const permissions =
    ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

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

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: "noreply@myapp.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: https://yourfrontend.com/reset-password/${user.id}/${token}`,
  };

  await transporter.sendMail(mailOptions);
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
