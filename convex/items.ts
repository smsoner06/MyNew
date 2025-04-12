import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addItem = mutation({
  args: {
    listId: v.id("shoppingLists"),
    name: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Giriş yapmalısınız");

    const list = await ctx.db.get(args.listId);
    if (!list || list.userId !== userId) {
      throw new Error("Liste bulunamadı");
    }

    await ctx.db.insert("items", {
      listId: args.listId,
      name: args.name,
      price: args.price,
    });

    await ctx.db.patch(args.listId, {
      totalAmount: list.totalAmount + args.price,
    });
  },
});

export const getItems = query({
  args: { listId: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const list = await ctx.db.get(args.listId);
    if (!list || list.userId !== userId) return [];

    return await ctx.db
      .query("items")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
  },
});

export const updateItem = mutation({
  args: {
    itemId: v.id("items"),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Giriş yapmalısınız");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Ürün bulunamadı");

    const list = await ctx.db.get(item.listId);
    if (!list || list.userId !== userId) {
      throw new Error("Liste bulunamadı");
    }

    const priceDiff = args.price - item.price;
    await ctx.db.patch(item.listId, {
      totalAmount: list.totalAmount + priceDiff,
    });

    await ctx.db.patch(args.itemId, {
      price: args.price,
    });
  },
});

export const deleteItem = mutation({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Giriş yapmalısınız");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Ürün bulunamadı");

    const list = await ctx.db.get(item.listId);
    if (!list || list.userId !== userId) {
      throw new Error("Liste bulunamadı");
    }

    await ctx.db.patch(item.listId, {
      totalAmount: list.totalAmount - item.price,
    });

    await ctx.db.delete(args.itemId);
  },
});
