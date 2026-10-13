import { customType, int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

type UserRole = "basic" | "admin"
export const customRole = customType<{data: UserRole, config: {role: UserRole}}>({
    dataType(config){
        return config?.role ? config.role : "text"
    }
})

export const users = sqliteTable("users", {
    // Required
    id: int().primaryKey({autoIncrement: true}),
    email: text().notNull().unique(),
    passwordHash: text().notNull(),
    // Optional
    name: text().notNull(),
    role: customRole().default("basic"),
    age: int().notNull(),
}, (table) => [uniqueIndex("email_idx").on(table.email)])

