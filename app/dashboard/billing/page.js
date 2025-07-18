"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  RefreshCw,
} from "lucide-react";

// Helper function to safely convert Firestore timestamp to Date
const convertToDate = (timestamp) => {
  if (!timestamp) return null;

  // If it's already a Date object
  if (timestamp instanceof Date) return timestamp;

  // Handle Firestore timestamp with _seconds property (most common case)
  if (timestamp._seconds) {
    return new Date(timestamp._seconds * 1000);
  }

  // Handle regular Firestore timestamp with seconds property
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }

  // If it's a string, try to parse it
  if (typeof timestamp === "string") {
    return new Date(timestamp);
  }

  // If it's a number (Unix timestamp)
  if (typeof timestamp === "number") {
    return new Date(timestamp * 1000);
  }

  // Last resort: try toDate method
  try {
    if (
      timestamp &&
      timestamp.toDate &&
      typeof timestamp.toDate === "function"
    ) {
      return timestamp.toDate();
    }
  } catch (error) {
    console.error("Failed to convert timestamp:", error);
  }

  return null;
};

const BillingPage = observer(() => {
  const { authStore, subscriptionStore } = useStore();
  const [orders, setOrders] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      // Fetch orders and subscription details
      const [ordersResponse, subscriptionResponse] = await Promise.all([
        fetch("/api/billing/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
        fetch("/api/billing/subscription", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
      ]);

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      if (subscriptionResponse.ok) {
        const subData = await subscriptionResponse.json();
        setSubscriptionDetails(subData.subscription);
      }
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 NEW: Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Manually refreshing billing data...");

      // Refresh user data first
      await authStore.checkAuth();

      // Then refresh billing data
      await fetchBillingData();

      console.log("✅ Billing data refreshed successfully");
    } catch (error) {
      console.error("❌ Failed to refresh billing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const response = await fetch("/api/subscription/portal", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.portal_url) {
          window.location.href = data.portal_url;
        } else if (data.url) {
          window.location.href = data.url;
        } else {
          alert("No portal URL received from server");
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
      alert(
        `Failed to open billing portal: ${error.message}. Please try again or contact support.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll keep access until the end of your current billing period."
      )
    ) {
      return;
    }

    setCanceling(true);
    try {
      const response = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();

        // Refresh user data and billing data
        await authStore.checkAuth();
        await fetchBillingData();

        alert(
          result.endsAt
            ? `Subscription canceled successfully. You'll keep access until ${new Date(
                result.endsAt
              ).toLocaleDateString()}.`
            : "Subscription canceled successfully. You'll keep access until the end of your billing period."
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      alert(
        `Failed to cancel subscription: ${error.message}. Please try again or contact support.`
      );
    } finally {
      setCanceling(false);
    }
  };

  const getSubscriptionStatusInfo = () => {
    const user = authStore.user;

    if (!user?.activeMember) {
      return {
        status: "inactive",
        title: "No Active Subscription",
        description: "Subscribe to access premium yoga content",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        variant: "destructive",
      };
    }

    // Check if subscription is canceled
    if (user.subscriptionStatus === "canceled") {
      let endDate = null;
      let daysLeft = 0;

      // FIXED: Use the safe date conversion function
      endDate = convertToDate(user.subscriptionEndsAt);

      if (endDate) {
        const now = new Date();
        const timeDiff = endDate.getTime() - now.getTime();
        daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }

      return {
        status: "canceled",
        title: "Subscription Canceled",
        description:
          daysLeft > 0
            ? `Access ends in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
            : "Access has ended",
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
        variant: "default",
      };
    }

    return {
      status: "active",
      title: "Active Subscription",
      description: "Your subscription is active and up to date",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      variant: "default",
    };
  };

  const getActualPrice = () => {
    // Try to get price from subscription details first
    if (subscriptionDetails?.price?.amount) {
      return (subscriptionDetails.price.amount / 100).toFixed(2);
    }

    // Fallback to order data
    if (orders.length > 0) {
      const latestOrder = orders[0];
      return (latestOrder.amount / 100).toFixed(2);
    }

    // Default fallback
    return "15.00";
  };

  // Clean function to get next billing date
  const getNextBillingInfo = () => {
    const user = authStore.user;

    if (!user?.subscriptionEndsAt) {
      return { date: "Unknown", description: "No subscription data" };
    }

    // Convert Firestore timestamp to Date
    const billingDate = convertToDate(user.subscriptionEndsAt);

    if (!billingDate) {
      return { date: "Unknown", description: "Invalid date" };
    }

    const isRenewing = user.willRenew === true;

    return {
      date: billingDate.toLocaleDateString(),
      description: isRenewing ? "Auto-renewal date" : "Final access date",
    };
  };

  const statusInfo = getSubscriptionStatusInfo();
  const user = authStore.user;
  const actualPrice = getActualPrice();
  const nextBillingInfo = getNextBillingInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and view payment history
          </p>
        </div>

        {/* 🚀 NEW: Refresh Button */}
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh Status"}
        </Button>
      </div>

      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Subscription Overview
          </CardTitle>
          <CardDescription>
            Your current subscription details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant={statusInfo.variant}>
            <AlertDescription className="flex items-center">
              {statusInfo.icon}
              <div className="ml-2">
                <div className="font-medium">{statusInfo.title}</div>
                <div className="text-sm">{statusInfo.description}</div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Plan</p>
              </div>
              <p className="text-lg">Monthly Yoga Subscription</p>
              <p className="text-sm text-muted-foreground">
                ${actualPrice} per month
              </p>
            </div>

            {user?.analytics?.monthsPaid > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Member Since</p>
                </div>
                <p className="text-lg">
                  {user.analytics.monthsPaid}{" "}
                  {user.analytics.monthsPaid === 1 ? "month" : "months"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total paid: $
                  {(
                    user.analytics.monthsPaid * parseFloat(actualPrice)
                  ).toFixed(2)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {user?.willRenew ? "Next Billing" : "Access Ends"}
                </p>
              </div>
              <p className="text-lg">{nextBillingInfo.date}</p>
              <p className="text-sm text-muted-foreground">
                {nextBillingInfo.description}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Opening Portal..." : "Manage Subscription"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Cancel, update payment methods, and download invoices
          </p>
        </CardFooter>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            Your subscription payments - download invoices from the customer
            portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div key={order.id}>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Monthly Subscription</p>
                        <p className="text-sm text-muted-foreground">
                          {(() => {
                            const paidDate =
                              convertToDate(order.paidAt) ||
                              convertToDate(order.createdAt);
                            return paidDate
                              ? paidDate.toLocaleDateString()
                              : "Unknown Date";
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${(order.amount / 100).toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            order.status === "paid" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index < orders.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No payment history available
              </p>
              <p className="text-sm text-muted-foreground">
                Your payments will appear here once you subscribe
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!user?.activeMember && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Subscribe to access premium yoga content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Join thousands of yoga practitioners and get access to our premium
              video library, guided sessions, and exclusive content.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => (window.location.href = "/subscribe")}>
              Subscribe Now - $12/month
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
});

export default BillingPage;
