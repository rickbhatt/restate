import { v } from "convex/values";
import { query } from "./_generated/server";

export const getLatestProperties = query({
  handler: async (ctx) => {
    try {
      const properties = await ctx.db
        .query("properties")
        .order("asc")
        .collect();

      return properties;
    } catch (error) {
      console.log(error);
      return [];
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
