import { v } from "convex/values";
import { query } from "./_generated/server";
import { gallery } from "@/constants/data";

export const getPropertiesForHome = query({
  handler: async (ctx) => {
    try {
      const featuredProperties = await ctx.db
        .query("properties")
        .filter((q) => q.eq(q.field("isFeatured"), true))
        .collect();
      const recommendedProperties = await ctx.db
        .query("properties")
        .filter((q) => q.eq(q.field("isRecommended"), true))
        .collect();

      return {
        featuredProperties,
        recommendedProperties,
      };
    } catch (error) {
      console.log(error);
      return {
        featuredProperties: [],
        recommendedProperties: [],
      };
    }
  },
});

export const getProperties = query({
  args: {
    filter: v.optional(
      v.union(
        v.literal("House"),
        v.literal("Townhouse"),
        v.literal("Apartment"),
        v.literal("Condo"),
        v.literal("Villa"),
        v.literal("Duplex"),
        v.literal("Studio"),
        v.literal("Other"),
        v.literal("All")
      )
    ),
    query: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { filter, query: searchQuery, limit }) => {
    try {
      let dbQuery;

      if (searchQuery && searchQuery.trim() !== "") {
        dbQuery = ctx.db
          .query("properties")
          .withSearchIndex("fullTextSearch", (q) => {
            let builder = q.search("searchText", searchQuery.toLowerCase());
            if (filter && filter !== "All") {
              builder = builder.eq("type", filter);
            }
            return builder;
          });
      } else if (filter && filter !== "All") {
        dbQuery = ctx.db
          .query("properties")
          .withIndex("byType", (q) => q.eq("type", filter));
      } else {
        dbQuery = ctx.db.query("properties");
      }

      if (limit) {
        return await dbQuery.take(limit);
      } else {
        return await dbQuery.collect();
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  },
});

export const getPropertyById = query({
  args: {
    id: v.id("properties"),
  },
  handler: async (ctx, { id }) => {
    try {
      // Fetch the property by ID
      const property = await ctx.db.get(id);
      if (!property) {
        return null; // Property not found
      }

      // Fetch all reviews for this property
      const reviews = await ctx.db
        .query("reviews")
        .filter((q) => q.eq(q.field("propertyId"), id))
        .collect();

      const agent = await ctx.db.get(property.agentId);

      const gallery = await ctx.db
        .query("galleries")
        .filter((q) => q.eq(q.field("propertyId"), id))
        .collect();

      // Return both property and its reviews
      return {
        ...property,
        reviews,
        agent: agent,
        gallery,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});
