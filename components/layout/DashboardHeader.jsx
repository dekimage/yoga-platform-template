"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";

export const Header = observer(() => {
  const { authStore } = useStore();

  const handleSubscribe = async () => {
    try {
      const params = new URLSearchParams({
        products: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID,
        customerEmail: authStore.user.email,
        customerName: authStore.user.fullName,
        metadata: JSON.stringify({
          fullName: authStore.user.fullName,
          marketingConsent:
            authStore.user.marketingConsent?.toString() || "false",
        }),
      });

      window.location.href = `/api/subscription/create?${params.toString()}`;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert("Failed to start subscription. Please try again.");
    }
  };

  const handleManageSubscription = async () => {
    // Simple redirect to Polar.sh customer dashboard
    // Users can log in with their email and manage their subscription
    window.open("https://polar.sh/dashboard/subscriptions", "_blank");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-end pr-4">
        <nav className="flex items-center space-x-4">
          {/* Show Subscribe Premium button only if user is not an active member */}
          {authStore.user && !authStore.user.activeMember && (
            <Button
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Subscribe Premium
            </Button>
          )}

          {/* User Navigation */}
          <UserNav />
        </nav>
      </div>
    </header>
  );
});
