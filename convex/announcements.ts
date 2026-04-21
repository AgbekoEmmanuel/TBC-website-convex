import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    return await ctx.db.query("announcements").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    body: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    linkLabel: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("announcements", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.string(),
    body: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    linkLabel: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, ...args }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(id, args);
  },
});

export const remove = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(id);
  },
});
