import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Login Form
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // Register Form
  const { register: registerReg, handleSubmit: handleRegSubmit, formState: { errors: regErrors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onLogin = (data: any) => loginMutation.mutate(data);
  const onRegister = (data: any) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md border-primary/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-heading font-bold text-primary">Axiom Gearz</CardTitle>
          <CardDescription>Your premium tech destination</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input {...registerLogin("username")} placeholder="Enter your username" />
                  {loginErrors.username && <span className="text-xs text-destructive">{String(loginErrors.username.message)}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" {...registerLogin("password")} placeholder="••••••••" />
                  {loginErrors.password && <span className="text-xs text-destructive">{String(loginErrors.password.message)}</span>}
                </div>
                <Button type="submit" className="w-full h-11" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...registerReg("name")} placeholder="John Doe" />
                  {regErrors.name && <span className="text-xs text-destructive">{String(regErrors.name.message)}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input {...registerReg("username")} placeholder="johndoe123" />
                  {regErrors.username && <span className="text-xs text-destructive">{String(regErrors.username.message)}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" {...registerReg("email")} placeholder="john@example.com" />
                  {regErrors.email && <span className="text-xs text-destructive">{String(regErrors.email.message)}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...registerReg("phone")} placeholder="+880..." />
                  {regErrors.phone && <span className="text-xs text-destructive">{String(regErrors.phone.message)}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input {...registerReg("address")} placeholder="Full address" />
                  {regErrors.address && <span className="text-xs text-destructive">{String(regErrors.address.message)}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" {...registerReg("password")} placeholder="••••••" />
                    {regErrors.password && <span className="text-xs text-destructive">{String(regErrors.password.message)}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm</Label>
                    <Input type="password" {...registerReg("confirmPassword")} placeholder="••••••" />
                    {regErrors.confirmPassword && <span className="text-xs text-destructive">{String(regErrors.confirmPassword.message)}</span>}
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 mt-2" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service.
        </CardFooter>
      </Card>
    </div>
  );
}
