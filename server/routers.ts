import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { sdk } from "./_core/sdk";
import { upsertUser, getUserByOpenId } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createActivity, getActivities, getActivitiesByCategory, updateActivity, deleteActivity,
  createArticle, getArticles, updateArticle, deleteArticle,
  createMedia, getMedia, updateMedia, deleteMedia,
  createMembershipSubmission, getMembershipSubmissions, updateMembershipSubmissionStatus,
  createContactSubmission, getContactSubmissions, updateContactSubmissionStatus,
  toggleReaction, getReactions,
  createComment, getComments,
} from "./db";
import { TRPCError } from "@trpc/server";

// Helper to check if user is admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ ACTIVITIES ============
  activities: router({
    list: publicProcedure.query(async () => {
      return await getActivities();
    }),

    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await getActivitiesByCategory(input.category);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.string(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await createActivity({
          ...input,
          createdBy: ctx.user.id,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateActivity(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteActivity(input.id);
      }),
  }),

  // ============ ARTICLES ============
  articles: router({
    list: publicProcedure
      .input(z.object({ includeUnpublished: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        return await getArticles(!input?.includeUnpublished);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        summary: z.string().optional(),
        imageUrl: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await createArticle({
          ...input,
          createdBy: ctx.user.id,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        summary: z.string().optional(),
        imageUrl: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateArticle(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteArticle(input.id);
      }),
  }),

  // ============ MEDIA ============
  media: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await getMedia(input?.category);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        url: z.string(), // Allow relative URLs
        fileKey: z.string(),
        mediaType: z.enum(["photo", "video"]),
        category: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await createMedia({
          ...input,
          createdBy: ctx.user.id,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateMedia(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteMedia(input.id);
      }),
  }),

  // ============ MEMBERSHIP SUBMISSIONS ============
  membership: router({
    submit: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        membershipType: z.enum(["membre_actif", "membre_associe", "membre_honneur"]),
        motivation: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        console.log("[Membership] Submitting:", input);
        try {
          const result = await createMembershipSubmission(input);
          console.log("[Membership] Success:", result);
          return result;
        } catch (err) {
          console.error("[Membership] Failed:", err);
          throw err;
        }
      }),

    list: adminProcedure.query(async () => {
      return await getMembershipSubmissions();
    }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      }))
      .mutation(async ({ input }) => {
        // 1. Update status
        const result = await updateMembershipSubmissionStatus(input.id, input.status);

        // 2. Fetch submission details to get email (optional, kept if we want to log)
        // No longer sending automated emails as per user request

        return result;
      }),
  }),

  // ============ CONTACT SUBMISSIONS ============
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        subject: z.string().min(1),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        return await createContactSubmission(input);
      }),

    list: adminProcedure.query(async () => {
      return await getContactSubmissions();
    }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "read", "responded"]),
      }))
      .mutation(async ({ input }) => {
        return await updateContactSubmissionStatus(input.id, input.status);
      }),
    setup: adminProcedure.mutation(async () => {
      // Placeholder for reaction setup if needed
    }),
  }),

  // ============ REACTIONS ============
  reactions: router({
    toggle: publicProcedure
      .input(z.object({
        targetType: z.enum(["media", "article", "activity"]),
        targetId: z.number(),
        type: z.enum(["like", "love", "support"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Simple toggle logic (anonymous or user)
        const userId = ctx.user?.id;
        const ip = "0.0.0.0"; // in real app, extract from req
        return await toggleReaction(input.targetType, input.targetId, input.type, userId, ip);
      }),

    stats: publicProcedure
      .input(z.object({
        targetType: z.enum(["media", "article", "activity"]),
        targetId: z.number(),
      }))
      .query(async ({ input }) => {
        return await getReactions(input.targetType, input.targetId);
      }),
  }),

  // ============ COMMENTS ============
  comments: router({
    create: publicProcedure
      .input(z.object({
        targetType: z.enum(["media", "article", "activity"]),
        targetId: z.number(),
        content: z.string().min(1),
        authorName: z.string().min(1),
        authorEmail: z.string().email().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await createComment({
          ...input,
          userId: ctx.user?.id,
        });
      }),

    list: publicProcedure
      .input(z.object({
        targetType: z.enum(["media", "article", "activity"]),
        targetId: z.number(),
      }))
      .query(async ({ input }) => {
        return await getComments(input.targetType, input.targetId);
      }),
  }),

  // ============ ADMIN LOGIN ============
  admin: router({
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        console.log("[AdminLogin] Attempting login for:", input.email);
        if (input.email === "admin@aras.local" && input.password === "admin123") {
          console.log("[AdminLogin] Credentials match.");

          // 1. Create session token
          const adminOpenId = "admin-aras-2025";
          const sessionToken = await sdk.createSessionToken(adminOpenId, {
            name: "Admin",
            expiresInMs: ONE_YEAR_MS
          });

          // 2. Ensure admin user exists in DB
          const existingConfig = await getUserByOpenId(adminOpenId);
          if (!existingConfig) {
            await upsertUser({
              openId: adminOpenId,
              name: "Administrateur",
              email: input.email,
              role: "admin",
              lastSignedIn: new Date()
            });
          }

          // 3. Set cookie
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, {
            ...cookieOptions,
            maxAge: ONE_YEAR_MS
          });

          return {
            success: true,
            token: sessionToken,
            message: "Connexion reussie",
          };
        }
        console.log("[AdminLogin] Invalid credentials");
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou mot de passe incorrect",
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
