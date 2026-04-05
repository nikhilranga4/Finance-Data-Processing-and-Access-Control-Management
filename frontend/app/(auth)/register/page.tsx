"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Loader2, EyeIcon, EyeOffIcon } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const { register: registerUser, isRegistering } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerErrors({});
    try {
      await registerUser(data);
      toast({
        title: "Account created!",
        description: "Welcome to Finance Dashboard.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      const response = error?.response?.data;
      if (response?.errors && Array.isArray(response.errors)) {
        // Handle field-specific validation errors
        const fieldErrors: Record<string, string> = {};
        response.errors.forEach((err: { field: string; message: string }) => {
          fieldErrors[err.field] = err.message;
        });
        setServerErrors(fieldErrors);
        toast({
          variant: "destructive",
          title: "Validation failed",
          description: "Please fix the errors below",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: response?.message || "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 border border-gray-200 mb-4">
          <Wallet className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Finance Dashboard</h1>
        <p className="text-gray-500">Create your account</p>
      </div>

      {/* Register Card */}
      <Card className="finance-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-gray-900">Sign up</CardTitle>
          <CardDescription className="text-gray-500">
            Create an account to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
              {serverErrors.name && (
                <p className="text-sm text-red-500">{serverErrors.name}</p>
              )}
            </div>

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
              {serverErrors.email && (
                <p className="text-sm text-red-500">{serverErrors.email}</p>
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
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
              {serverErrors.password && (
                <p className="text-sm text-red-500">{serverErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition-all duration-200"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
