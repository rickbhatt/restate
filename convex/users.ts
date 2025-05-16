import { query } from "@/convex/_generated/server";

export const getAllUsers = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query("users").collect();
  },
});
