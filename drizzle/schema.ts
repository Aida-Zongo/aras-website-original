import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email").unique(),
  loginMethod: text("loginMethod"),
  passwordHash: text("passwordHash"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Activities table for managing ARAS activities and projects
 */
export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", {
    enum: [
      "culture_traditions",
      "droits_humains",
      "civisme_citoyennete",
      "education",
      "sante",
      "environnement"
    ]
  }).notNull(),
  imageUrl: text("imageUrl"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  createdBy: integer("createdBy").notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Articles table for managing blog posts and news
 */
export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  imageUrl: text("imageUrl"),
  published: integer("published", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  createdBy: integer("createdBy").notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Media table for managing photos and images
 */
export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  mediaType: text("mediaType", { enum: ["photo", "video"] }).notNull(),
  category: text("category"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  createdBy: integer("createdBy").notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

/**
 * Membership/Adhésion submissions table
 */
export const membershipSubmissions = sqliteTable("membershipSubmissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  membershipType: text("membershipType", {
    enum: [
      "membre_actif",
      "membre_associe",
      "membre_honneur"
    ]
  }).notNull(),
  motivation: text("motivation"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type MembershipSubmission = typeof membershipSubmissions.$inferSelect;
export type InsertMembershipSubmission = typeof membershipSubmissions.$inferInsert;

/**
 * Contact submissions table
 */
export const contactSubmissions = sqliteTable("contactSubmissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "read", "responded"] }).default("new").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;

/**
 * Reactions for media and articles
 */
export const reactions = sqliteTable("reactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  targetType: text("targetType", { enum: ["media", "article", "activity"] }).notNull(),
  targetId: integer("targetId").notNull(),
  type: text("type", { enum: ["like", "love", "support"] }).default("like").notNull(),
  ipAddress: text("ipAddress"),
  userId: integer("userId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Reaction = typeof reactions.$inferSelect;
export type InsertReaction = typeof reactions.$inferInsert;

/**
 * Comments for media and articles
 */
export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  targetType: text("targetType", { enum: ["media", "article", "activity"] }).notNull(),
  targetId: integer("targetId").notNull(),
  content: text("content").notNull(),
  authorName: text("authorName").notNull(),
  authorEmail: text("authorEmail"),
  userId: integer("userId"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
