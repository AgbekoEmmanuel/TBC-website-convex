import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        title: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    totalAmount: v.number(),
    paymentRef: v.optional(v.string()),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", args);
  },
});

export const updateStatus = mutation({
  args: { id: v.id("orders"), paymentStatus: v.string() },
  handler: async (ctx, { id, paymentStatus }) => {
    await ctx.db.patch(id, { paymentStatus });
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("paymentStatus", "pending"))
      .collect();
  },
});
