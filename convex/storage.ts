import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    await ctx.storage.delete(storageId);
  },
});

/**
 * Direct client upload action.
 * Transmits base64 data directly through the established Convex client connection.
 * Completely immune to cross-origin fetch issues, mobile proxy drops, and mobile carrier timeouts.
 */
export const uploadFromClient = action({
  args: {
    base64Data: v.string(),
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const mime = args.contentType || "image/jpeg";
    const binary = atob(args.base64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    const storageId = await ctx.storage.store(blob);
    return { storageId };
  },
});
