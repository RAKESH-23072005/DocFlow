import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const compressionJobs = pgTable("compression_jobs", {
    id: serial("id").primaryKey(),
    originalFileName: text("original_file_name").notNull(),
    originalSize: integer("original_size").notNull(),
    compressedSize: integer("compressed_size"),
    quality: integer("quality").notNull(),
    isCompleted: boolean("is_completed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const insertCompressionJobSchema = createInsertSchema(compressionJobs).omit({
    id: true,
    createdAt: true,
});
export const insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
});
//# sourceMappingURL=schema.js.map