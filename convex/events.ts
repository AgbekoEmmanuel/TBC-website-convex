import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPublishedUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const events = await ctx.db
      .query("events")
      .withIndex("by_published_and_date", (q) =>
        q.eq("isPublished", true).gte("date", today)
      )
      .order("asc")
      .collect();

    // Sort chronologically by date
    events.sort((a, b) => a.date.localeCompare(b.date));

    return Promise.all(
      events.map(async (event) => ({
        ...event,
        imageUrl: event.imageUrl || (event.imageStorageId ? await ctx.storage.getUrl(event.imageStorageId) : undefined)
      }))
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    // First try to find an upcoming published featured event
    const upcomingFeatured = await ctx.db
      .query("events")
      .withIndex("by_published_and_date", (q) =>
        q.eq("isPublished", true).gte("date", today)
      )
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .first();

    // Fallback to any published featured event if none upcoming
    const event = upcomingFeatured || (await ctx.db
      .query("events")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .first());

    if (!event) return null;
    return {
      ...event,
      imageUrl: event.imageUrl || (event.imageStorageId ? await ctx.storage.getUrl(event.imageStorageId) : undefined)
    };
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    const events = await ctx.db.query("events").order("desc").collect();
    return Promise.all(
      events.map(async (event) => ({
        ...event,
        imageUrl: event.imageUrl || (event.imageStorageId ? await ctx.storage.getUrl(event.imageStorageId) : undefined)
      }))
    );
  },
});

export const getRecentPast = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const events = await ctx.db
      .query("events")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .filter((q) => q.lte(q.field("date"), today))
      .collect();

    // Sort events by date descending (newest past/today event first)
    events.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // Take top 3
    const recent = events.slice(0, 3);

    return Promise.all(
      recent.map(async (event) => ({
        ...event,
        imageUrl: event.imageUrl || (event.imageStorageId ? await ctx.storage.getUrl(event.imageStorageId) : undefined)
      }))
    );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    isFeatured: v.boolean(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    let imageUrl = args.imageUrl;
    if (args.imageStorageId && !imageUrl) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }
    return await ctx.db.insert("events", { ...args, imageUrl });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    isFeatured: v.boolean(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, { id, ...args }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.get(id);
    let imageUrl = args.imageUrl || existing?.imageUrl;
    if (args.imageStorageId && args.imageStorageId !== existing?.imageStorageId) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? imageUrl;
    }
    await ctx.db.patch(id, { ...args, imageUrl });
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    const event = await ctx.db.get(id);
    if (event?.imageStorageId) {
      await ctx.storage.delete(event.imageStorageId);
    }
    await ctx.db.delete(id);
  },
});

export const togglePublished = mutation({
  args: { id: v.id("events"), isPublished: v.boolean() },
  handler: async (ctx, { id, isPublished }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(id, { isPublished });
  },
});

export const toggleFeatured = mutation({
  args: { id: v.id("events"), isFeatured: v.boolean() },
  handler: async (ctx, { id, isFeatured }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(id, { isFeatured });
  },
});
