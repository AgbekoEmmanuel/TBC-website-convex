import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const live = await ctx.db.query("liveStream").first();
    if (!live) return null;

    if (live.eventId) {
      const event = await ctx.db.get(live.eventId);
      if (event) {
        const eventImageUrl = event.imageUrl || (event.imageStorageId ? await ctx.storage.getUrl(event.imageStorageId) : undefined);
        return {
          ...live,
          programName: live.programName || event.title,
          programType: live.programType || event.category || "Special Program",
          imageUrl: live.imageUrl || eventImageUrl,
          imageStorageId: live.imageStorageId || event.imageStorageId,
        };
      }
    }

    return live;
  },
});

export const update = mutation({
  args: {
    youtubeLink: v.string(),
    isLive: v.boolean(),
    programType: v.optional(v.string()),
    programName: v.optional(v.string()),
    eventId: v.optional(v.id("events")),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let imageUrl = args.imageUrl;
    let imageStorageId = args.imageStorageId;
    let programName = args.programName;
    let programType = args.programType;

    if (imageStorageId) {
      const url = await ctx.storage.getUrl(imageStorageId);
      if (url) {
        imageUrl = url;
      }
    }

    if (args.eventId) {
      const event = await ctx.db.get(args.eventId);
      if (event) {
        if (!imageUrl) {
          imageUrl = event.imageUrl || (event.imageStorageId ? (await ctx.storage.getUrl(event.imageStorageId)) ?? undefined : undefined);
        }
        if (!imageStorageId && event.imageStorageId) {
          imageStorageId = event.imageStorageId;
        }
        if (!programName) {
          programName = event.title;
        }
        if (!programType) {
          programType = event.category || "Special Program";
        }
      }
    }

    const existing = await ctx.db.query("liveStream").first();
    if (existing) {
      const patchData: any = {
        youtubeLink: args.youtubeLink,
        isLive: args.isLive,
        programType,
        programName,
        eventId: args.eventId ?? undefined,
        imageStorageId: imageStorageId ?? undefined,
      };

      const finalImageUrl = imageUrl ?? (args.eventId ? undefined : existing.imageUrl);
      if (finalImageUrl !== undefined) {
        patchData.imageUrl = finalImageUrl;
      }
      await ctx.db.patch(existing._id, patchData);
    } else {
      await ctx.db.insert("liveStream", {
        youtubeLink: args.youtubeLink,
        isLive: args.isLive,
        programType,
        programName,
        eventId: args.eventId,
        imageStorageId,
        imageUrl,
      });
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

export const endSession = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("liveStream").first();
    if (existing) {
      // Only delete old thumbnail from storage if it is NOT an event flyer
      if (existing.imageStorageId && !existing.eventId) {
        const eventUsingImage = await ctx.db
          .query("events")
          .filter((q) => q.eq(q.field("imageStorageId"), existing.imageStorageId))
          .first();
        if (!eventUsingImage) {
          try {
            await ctx.storage.delete(existing.imageStorageId);
          } catch (e) {
            console.error("Failed to delete storage file:", e);
          }
        }
      }
      await ctx.db.patch(existing._id, {
        isLive: false,
        youtubeLink: "",
        programType: undefined,
        programName: undefined,
        eventId: undefined,
        imageStorageId: undefined,
        imageUrl: undefined,
      });
    }
  },
});
