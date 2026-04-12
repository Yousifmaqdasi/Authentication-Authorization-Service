import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { usersTable } from './users.schema'

export const resetTokenTable = pgTable("reset_tokens", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer("user_id").notNull().references(() => usersTable.id, {onDelete: "cascade"}).unique(),
    hashed_token: text("hashed_token").notNull(),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    expires_at: timestamp("expires_at", {withTimezone: true}).notNull(),
})

