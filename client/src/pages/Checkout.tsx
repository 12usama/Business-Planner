import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, Store, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CheckoutForm = {
  name: string;
  phone: string;
  deliveryMethod: "home" | "store_pickup";
  address: string;
  paymentMethod: "cod" | "bkash" | "nagad" | "bank";
};

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      deliveryMethod: "home",
      paymentMethod: "cod",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  
  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const onSubmit = (data: CheckoutForm) => {
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to place an order.", variant: "destructive" });
      setLocation("/login");
      return;
    }

    createOrder(
      {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        deliveryMethod: data.deliveryMethod,
        deliveryAddress: data.deliveryMethod === 'home' ? data.address : "Store Pickup",
        paymentMethod: data.paymentMethod,
      },
      {
        onSuccess: () => {
          clearCart();
          toast({ title: "Order Placed!", description: "Your order has been confirmed." });
          setLocation("/dashboard");
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <h1 className="text-3xl font-heading font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="text-primary w-5 h-5" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input {...register("name", { required: "Name is required" })} />
                {errors.name && <span className="text-destructive text-sm">{errors.name.message}</span>}
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input {...register("phone", { required: "Phone is required" })} />
                {errors.phone && <span className="text-destructive text-sm">{errors.phone.message}</span>}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="text-primary w-5 h-5" /> Delivery Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup defaultValue="home" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="home" id="home" className="peer sr-only" {...register("deliveryMethod")} />
                  <Label
                    htmlFor="home"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Truck className="mb-3 h-6 w-6" />
                    Home Delivery
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="store_pickup" id="store_pickup" className="peer sr-only" {...register("deliveryMethod")} />
                  <Label
                    htmlFor="store_pickup"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Store className="mb-3 h-6 w-6" />
                    Store Pickup
                  </Label>
                </div>
              </RadioGroup>

              {deliveryMethod === "home" && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <Label>Delivery Address</Label>
                  <Textarea {...register("address", { required: deliveryMethod === "home" })} className="mt-2" placeholder="Full street address..." />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-primary w-5 h-5" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="cod" className="space-y-3">
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem value="cod" id="cod" {...register("paymentMethod")} />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-lg opacity-50 cursor-not-allowed">
                  <RadioGroupItem value="bkash" id="bkash" disabled />
                  <Label htmlFor="bkash">bKash (Coming Soon)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

        </div>

        {/* Order Summary Side */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-primary/20 shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity} x {item.name}</span>
                    <span className="font-medium">৳{(Number(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-primary">৳{total().toLocaleString()}</span>
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6 h-12 text-lg font-bold" disabled={isPending}>
                {isPending ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
