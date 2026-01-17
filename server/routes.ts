import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  setupAuth(app);

  // Products
  app.get(api.products.list.path, async (req, res) => {
    // Manually parse query params to match expected types for storage
    const params = {
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
      brand: req.query.brand as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      sort: req.query.sort as 'price_asc' | 'price_desc' | undefined,
    };
    
    const products = await storage.getProducts(params);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Add admin check here later
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Orders
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(req.user!.id, input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getOrders(req.user!.id);
    res.json(orders);
  });

  app.get(api.orders.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user!.id) return res.sendStatus(403);
    res.json(order);
  });

  // Reviews
  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviews(Number(req.params.id));
    res.json(reviews);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.reviews.create.input.parse(req.body);
      const review = await storage.createReview({
        ...input,
        productId: Number(req.params.id),
        userId: req.user!.id
      });
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getProducts();
  if (existing.length === 0) {
    const products = [
      {
        name: "JBL Flip 6 Portable Speaker",
        description: "Bold sound for every adventure. The JBL Flip 6 delivers powerful JBL Original Pro Sound with exceptional clarity.",
        price: "129.99",
        stockStatus: "in_stock",
        category: "Speakers",
        subCategory: "JBL",
        brand: "JBL",
        images: ["https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&q=80&w=500"],
        specifications: { "Power": "20W", "Battery": "12 Hours", "Waterproof": "IP67" },
        isFeatured: true
      },
      {
        name: "5 Core 15 Inch PA Woofer",
        description: "High power handling and efficient design make this woofer a great choice for PA systems.",
        price: "89.50",
        stockStatus: "limited_stock",
        category: "Speakers",
        subCategory: "5 Core",
        brand: "5 Core",
        images: ["https://images.unsplash.com/photo-1558525046-2495dc857d4a?auto=format&fit=crop&q=80&w=500"],
        specifications: { "Size": "15 Inch", "Power": "1500W PMPO", "Impedance": "8 Ohm" },
        isFeatured: false
      },
      {
        name: "Professional Audio Mixer",
        description: "8-Channel compact mixer with high headroom and low noise performance.",
        price: "199.00",
        stockStatus: "in_stock",
        category: "Audio Equipment",
        subCategory: "Amplifiers",
        brand: "Yamaha",
        images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=500"],
        specifications: { "Channels": "8", "Effects": "Built-in SPX", "USB": "Yes" },
        isFeatured: true
      },
      {
        name: "Wireless Microphone System",
        description: "Dual channel wireless microphone system for crystal clear vocal performance.",
        price: "149.99",
        stockStatus: "in_stock",
        category: "Audio Equipment",
        subCategory: "Mics & Stands",
        brand: "Shure",
        images: ["https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=500"],
        specifications: { "Range": "300 ft", "Battery Life": "14 Hours" },
        isFeatured: false
      },
      {
        name: "High Performance Gigabit Router",
        description: "Dual-band WiFi 6 router for high-speed streaming and gaming.",
        price: "79.99",
        stockStatus: "in_stock",
        category: "Networking",
        subCategory: "Routers",
        brand: "TP-Link",
        images: ["https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80&w=500"],
        specifications: { "Speed": "AX1800", "Ports": "4 Gigabit" },
        isFeatured: true
      },
      {
        name: "Car Audio Subwoofer Kit",
        description: "Complete car audio upgrade kit with subwoofer and amplifier.",
        price: "249.99",
        stockStatus: "out_of_stock",
        category: "Car Audio",
        subCategory: "Car Sets",
        brand: "Pioneer",
        images: ["https://images.unsplash.com/photo-1549488497-657743d46777?auto=format&fit=crop&q=80&w=500"],
        specifications: { "Power": "1200W", "Size": "12 Inch" },
        isFeatured: false
      }
    ];

    for (const p of products) {
      await storage.createProduct(p as InsertProduct);
    }
  }
}
