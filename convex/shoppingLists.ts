import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createList = mutation({
  args: {
    name: v.string(),
    budget: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Giriş yapmalısınız");

    return await ctx.db.insert("shoppingLists", {
      userId,
      name: args.name,
      budget: args.budget,
      totalAmount: 0,
      createdAt: Date.now(),
    });
  },
});

export const getLists = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("shoppingLists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const deleteList = mutation({
  args: { listId: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Giriş yapmalısınız");

    const list = await ctx.db.get(args.listId);
    if (!list || list.userId !== userId) {
      throw new Error("Liste bulunamadı");
    }

    // Önce listedeki tüm ürünleri sil
    const items = await ctx.db
      .query("items")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    
    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    // Sonra listeyi sil
    await ctx.db.delete(args.listId);
  },
});
