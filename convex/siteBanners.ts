import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const banners = await ctx.db.query("siteBanners").order("desc").collect();
    return banners;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    imageStorageId: v.id("_storage"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) throw new Error("Failed to get image URL");

    return await ctx.db.insert("siteBanners", {
      imageStorageId: args.imageStorageId,
      imageUrl: imageUrl,
      description: args.description,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("siteBanners") },
  handler: async (ctx, { id }) => {
    const banner = await ctx.db.get(id);
    if (banner?.imageStorageId) {
      await ctx.storage.delete(banner.imageStorageId);
    }
    await ctx.db.delete(id);
  },
});
