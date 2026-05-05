import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

// ────────────────────────────────────────────────────────────────────
// Helpers — import these from any other query/mutation that needs the
// signed-in user. They translate Clerk's identity.subject (clerkId)
// into our internal users row, so the rest of your code only ever
// deals with `Id<"users">`.
// ────────────────────────────────────────────────────────────────────

export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

export async function getCurrentUserOrThrow(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Not signed in");
  return user;
}

// ────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────

export const current = query({
  args: {},
  handler: async (ctx) => getCurrentUser(ctx),
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not signed in");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const next = {
      email: identity.email,
      name: identity.name,
      imageUrl: identity.pictureUrl,
    };

    if (existing) {
      if (
        existing.email !== next.email ||
        existing.name !== next.name ||
        existing.imageUrl !== next.imageUrl
      ) {
        await ctx.db.patch(existing._id, next);
      }
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      ...next,
    });
  },
});
