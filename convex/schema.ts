import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  events: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()), // Added category
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    isFeatured: v.boolean(),
    isPublished: v.boolean(),
  })
    .index("by_date", ["date"])
    .index("by_published", ["isPublished"])
    .index("by_slug", ["slug"]),

  sermons: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    speaker: v.string(),
    date: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    thumbnailStorageId: v.optional(v.id("_storage")),
    thumbnailUrl: v.optional(v.string()),
    series: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_date", ["date"])
    .index("by_published", ["isPublished"])
    .index("by_slug", ["slug"]),

  products: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    category: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    inStock: v.boolean(),
    isPublished: v.boolean(),
  })
    .index("by_published", ["isPublished"])
    .index("by_category", ["category"])
    .index("by_slug", ["slug"]),

  announcements: defineTable({
    title: v.string(),
    body: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    linkLabel: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_active", ["isActive"]),

  donations: defineTable({
    donorName: v.optional(v.string()),
    donorEmail: v.optional(v.string()),
    amount: v.number(),
    message: v.optional(v.string()),
    paymentRef: v.optional(v.string()),
    paymentStatus: v.string(),
  }).index("by_status", ["paymentStatus"]),

  orders: defineTable({
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        title: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    totalAmount: v.number(),
    paymentRef: v.optional(v.string()),
    paymentStatus: v.string(),
  }).index("by_status", ["paymentStatus"]),

  liveStream: defineTable({
    youtubeLink: v.string(),
    isLive: v.boolean(),
  }),

  gallery: defineTable({
    title: v.optional(v.string()),
    category: v.string(),
    imageStorageId: v.id("_storage"),
    imageUrl: v.string(),
  }).index("by_category", ["category"]),
});
