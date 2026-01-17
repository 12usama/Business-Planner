import { db } from "./db";
import {
  users, products, orders, orderItems, reviews,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Review, type InsertReview,
  type CreateOrderRequest
} from "@shared/schema";
import { eq, desc, and, ilike, gte, lte, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Auth & Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;

  // Products
  getProducts(params?: {
    category?: string;
    search?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'price_asc' | 'price_desc';
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product>;

  // Orders
  createOrder(userId: number, order: CreateOrderRequest): Promise<Order>;
  getOrders(userId: number): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>; // Return orders with items
  getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  getAllOrders(): Promise<Order[]>; // Admin

  // Reviews
  getReviews(productId: number): Promise<(Review & { user: { username: string } })[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(params: {
    category?: string;
    search?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'price_asc' | 'price_desc';
  } = {}): Promise<Product[]> {
    let query = db.select().from(products);
    const conditions = [];
    
    if (params.category) conditions.push(eq(products.category, params.category));
    if (params.search) conditions.push(ilike(products.name, `%${params.search}%`));
    if (params.brand) conditions.push(eq(products.brand, params.brand));
    // Cast price to numeric for comparison if it's stored as text/decimal
    if (params.minPrice) conditions.push(gte(products.price, params.minPrice.toString()));
    if (params.maxPrice) conditions.push(lte(products.price, params.maxPrice.toString()));

    if (conditions.length > 0) {
      // @ts-ignore - drizzle type complexity
      query = query.where(and(...conditions));
    }

    if (params.sort === 'price_asc') {
      return await query.orderBy(asc(products.price));
    } else if (params.sort === 'price_desc') {
      return await query.orderBy(desc(products.price));
    } else {
      return await query.orderBy(desc(products.createdAt));
    }
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async createOrder(userId: number, request: CreateOrderRequest): Promise<Order> {
    // Transaction ideally
    let total = 0;
    
    // Calculate total first (simplified)
    for (const item of request.items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        total += Number(product.price) * item.quantity;
      }
    }

    const [order] = await db.insert(orders).values({
      userId,
      totalAmount: total.toString(),
      deliveryMethod: request.deliveryMethod,
      deliveryAddress: request.deliveryAddress,
      paymentMethod: request.paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    }).returning();

    for (const item of request.items) {
       const product = await this.getProduct(item.productId);
       if(product) {
         await db.insert(orderItems).values({
           orderId: order.id,
           productId: item.productId,
           quantity: item.quantity,
           price: product.price,
         });
       }
    }

    return order;
  }

  async getOrders(userId: number): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    
    const result = [];
    for (const order of userOrders) {
      const items = await db.query.orderItems.findMany({
        where: eq(orderItems.orderId, order.id),
        with: {
          product: true
        }
      });
      result.push({ ...order, items });
    }
    return result;
  }

  async getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, order.id),
      with: {
        product: true
      }
    });

    return { ...order, items };
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getReviews(productId: number): Promise<(Review & { user: { username: string } })[]> {
    return await db.query.reviews.findMany({
      where: eq(reviews.productId, productId),
      with: {
        user: {
          columns: {
            username: true
          }
        }
      },
      orderBy: desc(reviews.createdAt)
    });
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
}

export const storage = new DatabaseStorage();
