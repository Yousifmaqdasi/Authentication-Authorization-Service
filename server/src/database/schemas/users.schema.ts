



import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: text("password_hash").notNull(),
    createdAt: timestamp("created_at", {withTimezone: false}).notNull().defaultNow()
})

