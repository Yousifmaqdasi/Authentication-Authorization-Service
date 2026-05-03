import { pgTable, integer, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const usersTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", {length: 255}).notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: text("password_hash").notNull(),
    createdAt: timestamp("created_at", {withTimezone: false}).notNull().defaultNow(),
    role: text("role").notNull().default("user"),
    isVerified: boolean("is_verified").notNull().default(false),
    verificationToken: text("verification_token"),
    verificationTokenExpires: timestamp("verification_token_expires", { withTimezone: true })
})

