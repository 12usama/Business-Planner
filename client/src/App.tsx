import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/login" component={AuthPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/about" component={() => <div className="p-20 text-center text-xl">About Page Coming Soon</div>} />
      <Route path="/support" component={() => <div className="p-20 text-center text-xl">Support Page Coming Soon</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 bg-background">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
