import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  shoppingLists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    budget: v.number(),
    totalAmount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  items: defineTable({
    listId: v.id("shoppingLists"),
    name: v.string(),
    price: v.number(),
  }).index("by_list", ["listId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
