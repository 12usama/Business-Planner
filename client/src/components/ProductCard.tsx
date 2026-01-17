import { Product } from "@shared/schema";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" /> In Stock</Badge>;
      case "limited_stock":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" /> Limited</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border-border/50">
        <div className="relative aspect-square overflow-hidden bg-secondary/20">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.brand}</span>
          </div>
          <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-primary">৳{Number(product.price).toLocaleString()}</span>
            {getStockBadge(product.stockStatus)}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full gap-2 font-semibold" 
            onClick={handleAddToCart}
            disabled={product.stockStatus === 'out_of_stock'}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
