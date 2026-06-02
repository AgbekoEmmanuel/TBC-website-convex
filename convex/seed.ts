import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createAdminUser = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }
    return { success: true, message: "Run: npx convex auth add-user to create admin" };
  },
});

export const defaultSermon = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if it already exists
    const existing = await ctx.db
      .query("sermons")
      .withIndex("by_slug", (q) => q.eq("slug", "invading-the-mountains"))
      .first();

    if (!existing) {
      await ctx.db.insert("sermons", {
        title: "Invading the Mountains",
        slug: "invading-the-mountains",
        description: "Join Apostle Michael Dadzie as he explores the seven mountains of influence and how to have dominion over them.",
        speaker: "Apostle Michael Dadzie",
        date: "2026-04-12",
        videoUrl: "https://youtu.be/CIuIhNbxIhY",
        thumbnailUrl: "https://img.youtube.com/vi/CIuIhNbxIhY/maxresdefault.jpg",
        series: "Featured",
        isPublished: true,
        isFeatured: true,
      });
    } else {
      await ctx.db.patch(existing._id, { isFeatured: true });
    }
  },
});
