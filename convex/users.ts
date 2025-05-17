import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "@/convex/_generated/server";
import { v } from "convex/values";

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    fullName: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
    });

    return userId;
  },
});

export const deleteUser = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    let user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkId}`
      );
    }
  },
});

export const getUserByClerkId = async ({
  ctx,
  clerkId,
}: {
  ctx: QueryCtx;
  clerkId: string;
}) => {
  const user = await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
    .unique();

  return user;
};

export const getAuthenticatedUser = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;

  return await getUserByClerkId({ ctx, clerkId: identity.subject });
};

export const getAuthenticatedUserProfile = query({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    return user;
  },
});
