"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Users,
  ShoppingCart,
  Activity,
  Video,
  CreditCard,
  Upload,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAuthenticated(true);
    } else if (pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    setLoading(false);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return children;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: pathname === "/admin/users",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: pathname === "/admin/orders",
    },
    {
      name: "Subscription Events",
      href: "/admin/subscription-events",
      icon: Activity,
      current: pathname === "/admin/subscription-events",
    },
  ];

  const externalLinks = [
    {
      name: "Videos (Contentful)",
      icon: Video,
      url:
        process.env.NEXT_PUBLIC_CONTENTFUL_ADMIN_URL ||
        "https://app.contentful.com",
    },
    {
      name: "Payments (Polar.sh)",
      icon: CreditCard,
      url:
        process.env.NEXT_PUBLIC_POLAR_ADMIN_URL || "https://polar.sh/dashboard",
    },
    {
      name: "Uploads (Bunny.net)",
      icon: Upload,
      url: process.env.NEXT_PUBLIC_BUNNY_ADMIN_URL || "https://panel.bunny.net",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      item.current
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                  />
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  External Links
                </p>
                {externalLinks.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleExternalLink(item.url)}
                    className="w-full text-left group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                    {item.name}
                    <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden">
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
