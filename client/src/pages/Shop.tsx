import { useState } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CATEGORIES = [
  "Speakers", 
  "Audio Equipment", 
  "Networking", 
  "Accessories", 
  "Car Audio"
];

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  
  const { data: products, isLoading } = useProducts({ 
    category: selectedCategory, 
    search: searchQuery 
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
  };

  const SidebarContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all" 
              checked={selectedCategory === ""}
              onCheckedChange={() => setSelectedCategory("")}
            />
            <label htmlFor="all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              All Categories
            </label>
          </div>
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox 
                id={cat} 
                checked={selectedCategory === cat}
                onCheckedChange={() => setSelectedCategory(cat)}
              />
              <label htmlFor={cat} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>

      {(selectedCategory || searchQuery) && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold">Shop</h1>
        
        {/* Mobile Filter */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24">
            <SidebarContent />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-secondary/20 rounded-2xl">
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
