import { useCart } from "@/hooks/use-cart";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="bg-secondary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 text-lg">Looks like you haven't added anything yet.</p>
        <Link href="/shop">
          <Button size="lg" className="px-8">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="h-24 w-24 shrink-0 bg-secondary/20 rounded-lg overflow-hidden border">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.brand}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Unit: ৳{Number(item.price).toLocaleString()}</p>
                    <p className="font-bold text-lg">৳{(Number(item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-heading font-bold text-xl mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>৳{total().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-primary">৳{total().toLocaleString()}</span>
              </div>
            </div>

            <Button size="lg" className="w-full h-14 text-lg font-bold" onClick={() => setLocation("/checkout")}>
              Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Secure checkout provided by Axiom Gearz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
