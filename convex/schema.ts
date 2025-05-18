import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const User = {
  email: v.string(),
  clerkId: v.string(),
  imageUrl: v.optional(v.string()),
  fullName: v.optional(v.string()),
};

export const Agent = {
  name: v.string(),
  email: v.string(),
  avatarUrl: v.optional(v.string()),
};

export const Gallery = {
  imageUrl: v.string(),
  propertyId: v.id("properties"),
};

export const Review = {
  name: v.string(),
  avatarUrl: v.optional(v.string()),
  review: v.string(),
  rating: v.float64(),
  propertyId: v.id("properties"),
};

export const Property = {
  agentId: v.id("agents"),
  name: v.string(),
  type: v.union(
    v.literal("House"),
    v.literal("Townhouse"),
    v.literal("Apartment"),
    v.literal("Condo"),
    v.literal("Villa"),
    v.literal("Duplex"),
    v.literal("Studio"),
    v.literal("Other")
  ),
  description: v.string(),
  address: v.string(),
  price: v.int64(),
  area: v.float64(),
  bedrooms: v.number(),
  bathroom: v.number(),
  rating: v.float64(),
  facilities: v.union(
    v.literal("Gym"),
    v.literal("Parking"),
    v.literal("Laundry"),
    v.literal("WiFi"),
    v.literal("Pet Friendly")
  ),
  imageUrl: v.string(),
  geoLocation: v.string(),
};

export default defineSchema({
  users: defineTable(User)
    .index("byEmail", ["email"])
    .index("byClerkId", ["clerkId"]),
  agents: defineTable(Agent),
  properties: defineTable(Property).index("byAgent", ["agentId"]),
  galleries: defineTable(Gallery).index("byProperty", ["propertyId"]),
  reviews: defineTable(Review).index("byProperty", ["propertyId"]),
});
