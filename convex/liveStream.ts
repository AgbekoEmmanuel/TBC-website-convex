import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("liveStream").first();
  },
});

export const update = mutation({
  args: {
    youtubeLink: v.string(),
    isLive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("liveStream").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("liveStream", args);
    }
  },
});

export const toggleLive = mutation({
  args: { isLive: v.boolean() },
  handler: async (ctx, { isLive }) => {
    const existing = await ctx.db.query("liveStream").first();
    if (existing) {
      await ctx.db.patch(existing._id, { isLive });
    } else {
      // If none exists, we can't really toggle without a link, but let's default to empty
      await ctx.db.insert("liveStream", { youtubeLink: "", isLive });
    }
  },
});
