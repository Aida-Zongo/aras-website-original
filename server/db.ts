import { eq, desc, and, SQLWrapper } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, activities, articles, media, membershipSubmissions, contactSubmissions, reactions, comments } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _connection: mysql.Connection | null = null;

// Lazily create the drizzle instance
export async function getDb() {
  if (!_db) {
    try {
      if (!ENV.databaseUrl) {
        throw new Error("DATABASE_URL is not defined in environment");
      }
      
      const connection = await mysql.createConnection({
        uri: ENV.databaseUrl,
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true
        }
      });
      _connection = connection;
      _db = drizzle(connection);
      console.log("[Database] Connected successfully to TiDB/MySQL");
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: any = {
      openId: user.openId,
    };
    const updateSet: Record<string, any> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    
    textFields.forEach(field => {
      const value = user[field];
      if (value !== undefined) {
        values[field] = value ?? null;
        updateSet[field] = value ?? null;
      }
    });

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ ACTIVITIES ============

export async function createActivity(data: {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  createdBy: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(activities).values({
    title: data.title,
    description: data.description,
    category: data.category as any,
    imageUrl: data.imageUrl,
    createdBy: data.createdBy,
  });

  return result;
}

export async function getActivities() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(activities).orderBy(desc(activities.createdAt));
}

export async function getActivitiesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(activities)
    .where(eq(activities.category, category as any))
    .orderBy(desc(activities.createdAt));
}

export async function updateActivity(id: number, data: {
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, any> = {};
  if (data.title) updateData.title = data.title;
  if (data.description) updateData.description = data.description;
  if (data.category) updateData.category = data.category as any;
  if (data.imageUrl) updateData.imageUrl = data.imageUrl;

  return await db.update(activities).set(updateData).where(eq(activities.id, id));
}

export async function deleteActivity(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(activities).where(eq(activities.id, id));
}

// ============ ARTICLES ============

export async function createArticle(data: {
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  published?: boolean;
  createdBy: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(articles).values({
    title: data.title,
    content: data.content,
    summary: data.summary,
    imageUrl: data.imageUrl,
    published: data.published ?? false,
    createdBy: data.createdBy,
  });
}

export async function getArticles(onlyPublished = true) {
  const db = await getDb();
  if (!db) return [];

  if (onlyPublished) {
    return await db.select().from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.createdAt));
  }

  return await db.select().from(articles).orderBy(desc(articles.createdAt));
}

export async function updateArticle(id: number, data: {
  title?: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  published?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, any> = {};
  if (data.title) updateData.title = data.title;
  if (data.content) updateData.content = data.content;
  if (data.summary) updateData.summary = data.summary;
  if (data.imageUrl) updateData.imageUrl = data.imageUrl;
  if (data.published !== undefined) updateData.published = data.published;

  return await db.update(articles).set(updateData).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(articles).where(eq(articles.id, id));
}

// ============ MEDIA ============

export async function createMedia(data: {
  title: string;
  description?: string;
  url: string;
  fileKey: string;
  mediaType: "photo" | "video";
  category?: string;
  createdBy: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(media).values({
    title: data.title,
    description: data.description,
    url: data.url,
    fileKey: data.fileKey,
    mediaType: data.mediaType,
    category: data.category,
    createdBy: data.createdBy,
  });
}

export async function getMedia(category?: string) {
  const db = await getDb();
  if (!db) return [];

  if (category) {
    return await db.select().from(media)
      .where(eq(media.category, category))
      .orderBy(desc(media.createdAt));
  }

  return await db.select().from(media).orderBy(desc(media.createdAt));
}

export async function updateMedia(id: number, data: {
  title?: string;
  description?: string;
  category?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, any> = {};
  if (data.title) updateData.title = data.title;
  if (data.description) updateData.description = data.description;
  if (data.category) updateData.category = data.category;

  return await db.update(media).set(updateData).where(eq(media.id, id));
}

export async function deleteMedia(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(media).where(eq(media.id, id));
}

// ============ MEMBERSHIP SUBMISSIONS ============

export async function createMembershipSubmission(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipType: string;
  motivation?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(membershipSubmissions).values({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    membershipType: data.membershipType as any,
    motivation: data.motivation,
  });
}

export async function getMembershipSubmissions() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(membershipSubmissions).orderBy(desc(membershipSubmissions.createdAt));
}

export async function updateMembershipSubmissionStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(membershipSubmissions).set({ status }).where(eq(membershipSubmissions.id, id));
}

// ============ CONTACT SUBMISSIONS ============

export async function createContactSubmission(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(contactSubmissions).values({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  });
}

export async function getContactSubmissions() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function updateContactSubmissionStatus(id: number, status: "new" | "read" | "responded") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
}

// ============ REACTIONS ============

export async function toggleReaction(
  targetType: "media" | "article" | "activity",
  targetId: number,
  type: "like" | "love" | "support",
  userId?: number,
  ipAddress?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Filter building logic
  let reactionQuery = db.select().from(reactions).where(and(
    eq(reactions.targetType, targetType),
    eq(reactions.targetId, targetId),
    userId ? eq(reactions.userId, userId) : eq(reactions.ipAddress, ipAddress!)
  )).limit(1);

  const existing = await reactionQuery;

  if (existing.length > 0) {
    const reaction = existing[0];
    if (reaction.type === type) {
      // Toggle off if same type
      await db.delete(reactions).where(eq(reactions.id, reaction.id));
      return { added: false, type };
    } else {
      // Update type if different
      await db.update(reactions).set({ type }).where(eq(reactions.id, reaction.id));
      return { added: true, type };
    }
  } else {
    // Create new
    await db.insert(reactions).values({
      targetType,
      targetId,
      type,
      userId,
      ipAddress,
    });
    return { added: true, type };
  }
}

export async function getReactions(targetType: "media" | "article" | "activity", targetId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(reactions)
    .where(and(
      eq(reactions.targetType, targetType),
      eq(reactions.targetId, targetId)
    ));
}

// ============ COMMENTS ============

export async function createComment(data: {
  targetType: "media" | "article" | "activity";
  targetId: number;
  content: string;
  authorName: string;
  authorEmail?: string;
  userId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(comments).values({
    targetType: data.targetType,
    targetId: data.targetId,
    content: data.content,
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    userId: data.userId,
  });
}

export async function getComments(targetType: "media" | "article" | "activity", targetId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(comments)
    .where(and(
      eq(comments.targetType, targetType),
      eq(comments.targetId, targetId)
    ))
    .orderBy(desc(comments.createdAt));
}
