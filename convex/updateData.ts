import { mutation } from "./_generated/server";

export const updateAllBookPrices = mutation({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("category"), "Books"))
      .collect();

    let count = 0;
    for (const book of books) {
      await ctx.db.patch(book._id, { price: 100 });
      count++;
    }
    return { updatedCount: count };
  },
});
