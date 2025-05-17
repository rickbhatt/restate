import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const User = {
  email: v.string(),
  clerkId: v.string(),
  imageUrl: v.optional(v.string()),
  fullName: v.optional(v.string()),
};

export default defineSchema({
  users: defineTable(User)
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),
});
