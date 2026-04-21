import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // TEMPORARY BYPASS: if (!userId) throw new Error("Not authenticated");

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const upcomingEventsCount = await ctx.db
      .query("events")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .filter((q) => q.gte(q.field("date"), today))
      .collect();

    const publishedSermonsCount = await ctx.db
      .query("sermons")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();

    const totalProductsCount = await ctx.db
      .query("products")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();

    const totalOrders = await ctx.db.query("orders").collect();
    
    const pendingOrdersCount = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("paymentStatus", "pending"))
      .collect();

    const successfulDonations = await ctx.db
      .query("donations")
      .withIndex("by_status", (q) => q.eq("paymentStatus", "success"))
      .filter((q) => q.gte(q.field("_creationTime"), startOfMonth))
      .collect();

    const totalDonationsThisMonth = successfulDonations.reduce((sum, d) => sum + d.amount, 0);

    const nextEvent = await ctx.db
      .query("events")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .filter((q) => q.gte(q.field("date"), today))
      .order("asc")
      .first();

    return {
      upcomingEvents: upcomingEventsCount.length,
      publishedSermons: publishedSermonsCount.length,
      totalProducts: totalProductsCount.length,
      totalOrders: totalOrders.length,
      pendingOrders: pendingOrdersCount.length,
      totalDonationsThisMonth,
      nextEvent,
    };
  },
});
