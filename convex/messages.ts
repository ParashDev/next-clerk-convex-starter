import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("messages")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .order("desc")
      .take(50);
  },
});

export const send = mutation({
  args: { body: v.string() },
  handler: async (ctx, { body }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const trimmed = body.trim();
    if (!trimmed) throw new Error("Message cannot be empty");
    await ctx.db.insert("messages", {
      authorId: user._id,
      body: trimmed,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const message = await ctx.db.get(id);
    if (!message || message.authorId !== user._id) {
      throw new Error("Not allowed");
    }
    await ctx.db.delete(id);
  },
});
