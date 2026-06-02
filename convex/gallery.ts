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

export const removeMany = mutation({
  args: { ids: v.array(v.id("gallery")) },
  handler: async (ctx, { ids }) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");

    for (const id of ids) {
      const item = await ctx.db.get(id);
      if (item?.imageStorageId) {
        await ctx.storage.delete(item.imageStorageId);
      }
      await ctx.db.delete(id);
    }
  },
});

export const getDeletedStaticIds = query({
  args: {},
  handler: async (ctx) => {
    const deleted = await ctx.db.query("deletedStaticImages").collect();
    return deleted.map(d => d.staticId);
  },
});

export const deleteStaticItems = mutation({
  args: { ids: v.array(v.string()) },
  handler: async (ctx, { ids }) => {
    for (const id of ids) {
      const existing = await ctx.db
        .query("deletedStaticImages")
        .withIndex("by_staticId", q => q.eq("staticId", id))
        .first();
      if (!existing) {
        await ctx.db.insert("deletedStaticImages", { staticId: id });
      }
    }
  },
});
