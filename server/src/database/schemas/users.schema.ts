
import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", {length: 255}).notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: text("password_hash").notNull(),
    createdAt: timestamp("created_at", {withTimezone: false}).notNull().defaultNow()
})

