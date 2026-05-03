import { mysqlTable, serial, varchar, text, timestamp, boolean, int, mysqlEnum } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  loginMethod: varchar("loginMethod", { length: 50 }),
  passwordHash: text("passwordHash"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Activities table for managing ARAS activities and projects
 */
export const activities = mysqlTable("activities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", [
    "culture_traditions",
    "droits_humains",
    "civisme_citoyennete",
    "education",
    "sante",
    "environnement"
  ]).notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Articles table for managing blog posts and news
 */
export const articles = mysqlTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  imageUrl: text("imageUrl"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Media table for managing photos and images
 */
export const media = mysqlTable("media", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: text("url").notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(),
  mediaType: mysqlEnum("mediaType", ["photo", "video"]).notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

/**
 * Membership/Adhésion submissions table
 */
export const membershipSubmissions = mysqlTable("membershipSubmissions", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  membershipType: mysqlEnum("membershipType", [
    "membre_actif",
    "membre_associe",
    "membre_honneur"
  ]).notNull(),
  motivation: text("motivation"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow().notNull(),
});

export type MembershipSubmission = typeof membershipSubmissions.$inferSelect;
export type InsertMembershipSubmission = typeof membershipSubmissions.$inferInsert;

/**
 * Contact submissions table
 */
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "responded"]).default("new").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;

/**
 * Reactions for media and articles
 */
export const reactions = mysqlTable("reactions", {
  id: serial("id").primaryKey(),
  targetType: mysqlEnum("targetType", ["media", "article", "activity"]).notNull(),
  targetId: int("targetId").notNull(),
  type: mysqlEnum("type", ["like", "love", "support"]).default("like").notNull(),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userId: int("userId"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Reaction = typeof reactions.$inferSelect;
export type InsertReaction = typeof reactions.$inferInsert;

/**
 * Comments for media and articles
 */
export const comments = mysqlTable("comments", {
  id: serial("id").primaryKey(),
  targetType: mysqlEnum("targetType", ["media", "article", "activity"]).notNull(),
  targetId: int("targetId").notNull(),
  content: text("content").notNull(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 255 }),
  userId: int("userId"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
