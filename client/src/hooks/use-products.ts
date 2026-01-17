import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertProduct, type InsertReview } from "@shared/routes";

export function useProducts(filters?: { category?: string; search?: string }) {
  const queryKey = [api.products.list.path, filters?.category, filters?.search];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);
      
      const url = `${api.products.list.path}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Product not found");
      return api.products.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useProductReviews(id: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, id],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return api.reviews.list.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: number; data: Omit<InsertReview, "productId" | "userId"> }) => {
      const url = buildUrl(api.reviews.create.path, { id: productId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      return api.reviews.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, productId] });
    },
  });
}
