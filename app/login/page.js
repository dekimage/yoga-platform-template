"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

const LoginPage = observer(() => {
  const router = useRouter();
  const { authStore } = useStore();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authStore.login(email, password);
      router.push("/dashboard/videos");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            {/* Logo and Brand */}
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-foreground flex items-center justify-center mb-4">
                <div className="text-background text-2xl font-bold">Y</div>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome Back
              </h1>
              <p className="mt-2 text-muted-foreground">
                Sign in to continue your yoga journey
              </p>
            </div>

            {/* Login Card */}
            <Card>
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-semibold text-center">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                        autoComplete="email"
                        name="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                        autoComplete="current-password"
                        name="password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-foreground hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <div className="px-6 pb-6">
                <Separator className="mb-4" />

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <Link
                    href="/signup"
                    className="font-medium text-foreground hover:underline"
                  >
                    Sign up here
                  </Link>
                </div>

                <div className="flex justify-center space-x-4 text-xs text-muted-foreground mt-4">
                  <Link
                    href="/privacy"
                    className="hover:text-foreground hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link
                    href="/terms"
                    className="hover:text-foreground hover:underline"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Secure login powered by Firebase Authentication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoginPage;
