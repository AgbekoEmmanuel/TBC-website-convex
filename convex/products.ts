import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .collect();
    return Promise.all(
      products.map(async (p) => ({
        ...p,
        imageUrl: p.imageUrl || (p.imageStorageId ? (await ctx.storage.getUrl(p.imageStorageId)) ?? undefined : undefined),
      }))
    );
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", category))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
    return Promise.all(
      products.map(async (p) => ({
        ...p,
        imageUrl: p.imageUrl || (p.imageStorageId ? (await ctx.storage.getUrl(p.imageStorageId)) ?? undefined : undefined),
      }))
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!product) return null;
    return {
      ...product,
      imageUrl: product.imageUrl || (product.imageStorageId ? (await ctx.storage.getUrl(product.imageStorageId)) ?? undefined : undefined),
    };
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    const products = await ctx.db.query("products").order("desc").collect();
    return Promise.all(
      products.map(async (p) => ({
        ...p,
        imageUrl: p.imageUrl || (p.imageStorageId ? (await ctx.storage.getUrl(p.imageStorageId)) ?? undefined : undefined),
      }))
    );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    category: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    inStock: v.boolean(),
    isPublished: v.boolean(),
    isComingSoon: v.optional(v.boolean()),
    isNewRelease: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    let imageUrl = args.imageUrl;
    if (args.imageStorageId && !imageUrl) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }
    return await ctx.db.insert("products", { ...args, imageUrl });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    category: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    inStock: v.boolean(),
    isPublished: v.boolean(),
    isComingSoon: v.optional(v.boolean()),
    isNewRelease: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...args }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    let imageUrl = args.imageUrl;
    if (args.imageStorageId && !imageUrl) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }
    await ctx.db.patch(id, { ...args, imageUrl });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    const product = await ctx.db.get(id);
    if (product?.imageStorageId) {
      await ctx.storage.delete(product.imageStorageId);
    }
    await ctx.db.delete(id);
  },
});

export const togglePublished = mutation({
  args: { id: v.id("products"), isPublished: v.boolean() },
  handler: async (ctx, { id, isPublished }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(id, { isPublished });
  },
});

export const toggleInStock = mutation({
  args: { id: v.id("products"), inStock: v.boolean() },
  handler: async (ctx, { id, inStock }) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(id, { inStock });
  },
});

export const backfillImageUrls = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let updated = 0;
    for (const p of products) {
      if (p.imageStorageId && !p.imageUrl) {
        const url = await ctx.storage.getUrl(p.imageStorageId);
        if (url) {
          await ctx.db.patch(p._id, { imageUrl: url });
          updated++;
        }
      }
    }
    return { total: products.length, updated };
  },
});

