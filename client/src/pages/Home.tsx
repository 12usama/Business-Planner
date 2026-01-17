import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, Truck, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/* Unsplash: Modern tech setup dark blue lighting */
const HERO_IMAGE = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.filter(p => p.isFeatured).slice(0, 4) || [];

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE} 
            alt="Tech Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight">
              Smart Tech.<br />
              <span className="text-accent">Real Value.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
              Upgrade your setup with premium audio gear, networking solutions, and accessories.
            </p>
            <div className="flex gap-4">
              <Link href="/shop">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-6 h-auto text-lg rounded-full">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary font-bold px-8 py-6 h-auto text-lg rounded-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-secondary/30 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">100% Original</h3>
                <p className="text-muted-foreground text-sm">Authentic products guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Fast Delivery</h3>
                <p className="text-muted-foreground text-sm">Nationwide shipping available</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Local Support</h3>
                <p className="text-muted-foreground text-sm">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Find exactly what you need from our wide range of curated collections.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Speakers", img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800" },
              { name: "Audio Equipment", img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800" },
              { name: "Networking", img: "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&w=800" },
              { name: "Accessories", img: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=800" }
            ].map((cat) => (
              <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`}>
                <div className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer">
                  <img 
                    src={cat.img} 
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-white text-xl font-bold mb-2 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                      {cat.name}
                    </h3>
                    <div className="text-accent text-sm font-semibold opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-1">
                      View Products <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-heading font-bold">Featured Products</h2>
            <Link href="/shop">
              <Button variant="ghost" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to upgrade your gear?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who trust Axiom Gearz for their tech needs.
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold px-10 py-6 h-auto rounded-full text-lg shadow-xl shadow-accent/20">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
