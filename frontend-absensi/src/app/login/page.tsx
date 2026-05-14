"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import Link from "next/link";
import { useAuth } from "@/features/auth/use-auth";

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      await login(data);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : null;
      setError(message || "Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5" />
        <div className="relative z-20 flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Clock className="size-5" />
            </div>
            Absensi Enterprise
          </div>
          
          <div className="flex flex-col gap-4 max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight">
              Manage your workforce with precision and ease.
            </h1>
            <p className="text-lg text-muted-foreground">
              A comprehensive attendance management system designed for modern enterprises. 
              Track check-ins, manage leaves, and generate detailed reports in one place.
            </p>
            <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-8">
               <div className="flex flex-col">
                  <span className="text-2xl font-bold">99.9%</span>
                  <span className="text-sm text-muted-foreground">Uptime Guarantee</span>
               </div>
               <div className="h-10 w-[1px] bg-border mx-2" />
               <div className="flex flex-col">
                  <span className="text-2xl font-bold">1k+</span>
                  <span className="text-sm text-muted-foreground">Active Employees</span>
               </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2026 Absensi App. All rights reserved.
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center p-8 lg:p-12 bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoggingIn}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoggingIn}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoggingIn} className="mt-2 h-10">
                {isLoggingIn && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </div>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
