import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { data: orders, isLoading } = useOrders();

  if (!user) {
    setLocation("/login");
    return null;
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      packed: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      confirmed: <CheckCircle className="w-3 h-3 mr-1" />,
      packed: <Package className="w-3 h-3 mr-1" />,
      out_for_delivery: <Truck className="w-3 h-3 mr-1" />,
      delivered: <CheckCircle className="w-3 h-3 mr-1" />,
      cancelled: <XCircle className="w-3 h-3 mr-1" />,
    };

    const key = status as keyof typeof styles;
    return (
      <Badge variant="secondary" className={`${styles[key] || "bg-gray-100"} capitalize`}>
        {icons[key]} {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Account</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Button variant="outline" onClick={() => logoutMutation.mutate()}>Log Out</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-bold uppercase">Full Name</label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-bold uppercase">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-bold uppercase">Phone</label>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-bold uppercase">Address</label>
              <p className="font-medium">{user.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-heading">Order History</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div>
                      <p className="font-bold text-lg">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(order.status)}
                      <p className="font-bold text-xl text-primary">৳{Number(order.totalAmount).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="bg-secondary px-2 py-1 rounded">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
                    </span>
                    <span className="bg-secondary px-2 py-1 rounded">
                      {order.deliveryMethod === 'home' ? 'Home Delivery' : 'Store Pickup'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/20 rounded-xl">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-lg">No orders yet</h3>
              <p className="text-muted-foreground">Start shopping to see your orders here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
