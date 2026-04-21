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
