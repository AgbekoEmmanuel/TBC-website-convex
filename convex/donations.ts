import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    donorName: v.optional(v.string()),
    donorEmail: v.optional(v.string()),
    amount: v.number(),
    message: v.optional(v.string()),
    paymentRef: v.optional(v.string()),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("donations", args);
  },
});

export const updateStatus = mutation({
  args: { id: v.id("donations"), paymentStatus: v.string() },
  handler: async (ctx, { id, paymentStatus }) => {
    await ctx.db.patch(id, { paymentStatus });
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    return await ctx.db.query("donations").order("desc").collect();
  },
});

export const getTotalThisMonth = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_status", (q) => q.eq("paymentStatus", "success"))
      .filter((q) => q.gte(q.field("_creationTime"), startOfMonth))
      .collect();

    return donations.reduce((sum, d) => sum + d.amount, 0);
  },
});
