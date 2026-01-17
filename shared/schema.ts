import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // email
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // 'admin' | 'customer'
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price").notNull(), // using decimal for price
  stockStatus: text("stock_status").notNull().default("in_stock"), // 'in_stock' | 'limited_stock' | 'out_of_stock'
  category: text("category").notNull(), // Speakers, Audio Equipment, Networking, Accessories, Car Audio
  subCategory: text("sub_category"), // JBL, 5 Core, Box Speakers, etc.
  brand: text("brand").notNull(),
  images: text("images").array().notNull(), // Array of image URLs
  specifications: jsonb("specifications").$type<Record<string, string>>().default({}),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Link to users table
  status: text("status").notNull().default("pending"), // 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled'
  totalAmount: decimal("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // 'cod' | 'bkash' | 'nagad' | 'bank'
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending' | 'paid' | 'failed'
  deliveryMethod: text("delivery_method").notNull(), // 'home' | 'store_pickup'
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price").notNull(), // Snapshot of price at purchase
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true, paymentStatus: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Request types
export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;

export type CreateOrderRequest = {
  items: { productId: number; quantity: number }[];
  deliveryMethod: string;
  deliveryAddress: string;
  paymentMethod: string;
};

export type UpdateOrderStatusRequest = {
  status: string;
};

// Response types
export type ProductResponse = Product;
export type OrderResponse = Order & { items: (OrderItem & { product: Product })[] };
export type ReviewResponse = Review & { user: { username: string } };

