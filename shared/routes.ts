import { z } from 'zod';
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertReviewSchema, products, orders, reviews, users } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect | null>(),
      },
    },
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        brand: z.string().optional(),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
        sort: z.enum(['price_asc', 'price_desc']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    // Admin only
    create: {
      method: 'POST' as const,
      path: '/api/products',
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({
        items: z.array(z.object({ productId: z.number(), quantity: z.number() })),
        deliveryMethod: z.string(),
        deliveryAddress: z.string(),
        paymentMethod: z.string(),
      }),
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/orders',
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id',
      responses: {
        200: z.custom<typeof orders.$inferSelect & { items: any[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  reviews: {
    list: {
      method: 'GET' as const,
      path: '/api/products/:id/reviews',
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect & { user: { username: string } }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products/:id/reviews',
      input: insertReviewSchema.omit({ productId: true, userId: true }),
      responses: {
        201: z.custom<typeof reviews.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
