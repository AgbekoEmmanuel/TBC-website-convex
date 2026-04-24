import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("gallery").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    category: v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) throw new Error("Could not get image URL");

    return await ctx.db.insert("gallery", {
      ...args,
      imageUrl,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("gallery") },
  handler: async (ctx, { id }) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(id);
    if (item?.imageStorageId) {
      await ctx.storage.delete(item.imageStorageId);
    }
    await ctx.db.delete(id);
  },
});
