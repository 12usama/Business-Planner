import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { 
  ShoppingCart, 
  Search, 
  User as UserIcon, 
  Menu, 
  X,
  LogOut,
  Package
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const { itemCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    if (query) {
      setLocation(`/shop?search=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold">Home</Link>
                <Link href="/shop" className="text-lg font-semibold">Shop</Link>
                <Link href="/about" className="text-lg font-semibold">About Us</Link>
                <Link href="/support" className="text-lg font-semibold">Support</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-heading font-bold tracking-tight hidden sm:inline-block">
            Axiom Gearz
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            Home
          </Link>
          <Link href="/shop" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/shop' ? 'text-primary' : 'text-muted-foreground'}`}>
            Shop
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            About Us
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="absolute inset-x-0 top-0 h-16 bg-background flex items-center px-4 md:static md:w-64 md:h-auto md:p-0">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="q"
                  placeholder="Search products..."
                  className="w-full pl-9"
                  autoFocus
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="ml-2 md:hidden"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount() > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logoutMutation.mutate()}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="hidden sm:flex">
                Log In
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
