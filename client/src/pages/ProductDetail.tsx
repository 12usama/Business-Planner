import { useRoute } from "wouter";
import { useProduct, useProductReviews, useCreateReview } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck,
  Truck
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Textarea } from "@/components/ui/textarea";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading } = useProduct(id);
  const { data: reviews } = useProductReviews(id);
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  
  if (isLoading) return <ProductSkeleton />;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> In Stock</Badge>;
      case "limited_stock":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" /> Limited Stock</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-secondary/20 rounded-2xl overflow-hidden border">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-24 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-gray-300"
                }`}
              >
                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</span>
              {getStockBadge(product.stockStatus)}
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">৳{Number(product.price).toLocaleString()}</span>
              {/* Fake Rating for Demo */}
              <div className="flex items-center text-yellow-500">
                <Star className="fill-current w-5 h-5" />
                <span className="ml-1 text-foreground font-medium">4.8</span>
                <span className="text-muted-foreground ml-1 text-sm">(124 reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-lg">
            {product.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 py-6 border-y">
            <Button 
              size="lg" 
              className="flex-1 text-lg h-14" 
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'out_of_stock'}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>1 Year Official Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Truck className="w-5 h-5 text-primary" />
              <span>Fast Delivery across Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="specs" className="space-y-8">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="specs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 text-lg"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger 
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 text-lg"
          >
            Reviews ({reviews?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specs" className="mt-8">
          <div className="bg-secondary/20 rounded-2xl p-8 border">
            <h3 className="font-heading font-bold text-xl mb-6">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex border-b border-border/50 pb-3">
                  <span className="font-medium w-1/3 text-muted-foreground">{key}</span>
                  <span className="w-2/3">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {reviews?.map((review) => (
                <div key={review.id} className="bg-card p-6 rounded-xl border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                        {review.user.username[0].toUpperCase()}
                      </div>
                      <span className="font-bold">{review.user.username}</span>
                    </div>
                    <div className="flex text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
              {(!reviews || reviews.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </div>
            <div>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReviewForm({ productId }: { productId: number }) {
  const { user } = useAuth();
  const { mutate, isPending } = useCreateReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!user) {
    return (
      <div className="bg-secondary/20 p-6 rounded-xl text-center">
        <h3 className="font-bold mb-2">Write a Review</h3>
        <p className="text-sm text-muted-foreground mb-4">Please log in to leave a review.</p>
        <Link href="/login">
          <Button variant="outline" className="w-full">Log In</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { productId, data: { rating, comment } },
      { onSuccess: () => setComment("") }
    );
  };

  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-lg mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Comment</label>
          <Textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            required
            className="min-h-[100px]"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square rounded-2xl w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
