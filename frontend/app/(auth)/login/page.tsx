"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wallet, TrendingUp, Eye, UserCog, Loader2, EyeIcon, EyeOffIcon } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const demoAccounts = [
  { role: "Admin", email: "admin@finance.com", password: "Admin@123", icon: UserCog, color: "bg-amber-100 text-amber-700 border-amber-200" },
  { role: "Analyst", email: "analyst@finance.com", password: "Analyst@123", icon: TrendingUp, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { role: "Viewer", email: "viewer@finance.com", password: "Viewer@123", icon: Eye, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error?.response?.data?.message || "Invalid credentials",
      });
    }
  };

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setValue("email", account.email);
    setValue("password", account.password);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 border border-gray-200 mb-4">
          <Wallet className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Finance Dashboard</h1>
        <p className="text-gray-500">Financial Data Processing & Access Control</p>
      </div>

      {/* Login Card */}
      <Card className="finance-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-gray-900">Sign in</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition-all duration-200"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Demo Accounts */}
      <div className="mt-8">
        <p className="text-center text-gray-400 text-sm mb-4">Demo Accounts</p>
        <div className="grid grid-cols-3 gap-3">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <button
                key={account.role}
                onClick={() => fillDemoAccount(account)}
                className={`p-3 rounded-xl border ${account.color} hover:opacity-80 transition-all duration-200 text-center group`}
              >
                <Icon className="h-5 w-5 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <Badge variant="outline" className={`${account.color} text-xs border-0`}>
                  {account.role}
                </Badge>
                <p className="text-[10px] mt-1 opacity-70">{account.email}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
