"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Video, Star, Zap } from "lucide-react";
import Link from "next/link";

const ThankYouPage = observer(() => {
  const { authStore } = useStore();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

  const checkoutId = searchParams.get("checkoutId");
  const customerSessionToken = searchParams.get("customer_session_token");

  useEffect(() => {
    const refreshUserState = async () => {
      console.log("🔄 Refreshing user state after successful payment...");

      try {
        // Force refresh the user data from the server
        await authStore.initialize();

        // Check if user is now active member
        if (authStore.user?.activeMember) {
          console.log("✅ User is now an active member!");
          setIsLoading(false);
        } else if (refreshAttempts < 5) {
          // Sometimes the webhook takes a moment to process
          console.log(
            `⏳ User not yet active member, retrying... (${
              refreshAttempts + 1
            }/5)`
          );
          setRefreshAttempts((prev) => prev + 1);
          setTimeout(refreshUserState, 2000); // Retry after 2 seconds
        } else {
          console.log("⚠️ Max refresh attempts reached");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("❌ Error refreshing user state:", error);
        setIsLoading(false);
      }
    };

    if (checkoutId && authStore.isAuthenticated) {
      refreshUserState();
    } else {
      setIsLoading(false);
    }
  }, [checkoutId, authStore.isAuthenticated, refreshAttempts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">
                Processing Your Subscription
              </h3>
              <p className="text-gray-600">
                Please wait while we activate your premium access...
              </p>
              {refreshAttempts > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Attempt {refreshAttempts}/5
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Premium! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Your subscription is now active and you have full access to all yoga
            content
          </p>
        </div>

        {/* User Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Premium Member Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {authStore.user?.activeMember
                    ? "✅ Active"
                    : "⏳ Activating..."}
                </div>
                <div className="text-sm text-gray-600">Membership Status</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  Unlimited
                </div>
                <div className="text-sm text-gray-600">Video Access</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              What's Included in Your Premium Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Unlimited Video Access</h4>
                  <p className="text-sm text-gray-600">
                    Stream all yoga videos without restrictions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">HD Quality Streaming</h4>
                  <p className="text-sm text-gray-600">
                    Enjoy crystal clear video quality
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Progress Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Track your yoga journey and achievements
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Priority Support</h4>
                  <p className="text-sm text-gray-600">
                    Get help when you need it most
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link href="/dashboard/videos">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Video className="w-5 h-5 mr-2" />
                Start Watching Videos
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {checkoutId && (
            <p className="text-sm text-gray-500">Order ID: {checkoutId}</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default ThankYouPage;
