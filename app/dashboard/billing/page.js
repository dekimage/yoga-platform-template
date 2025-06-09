"use client"

import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const BillingPage = observer(() => {
  const { authStore, subscriptionStore } = useStore()

  const handleManageSubscription = async () => {
    try {
      const portalUrl = await subscriptionStore.getCustomerPortalUrl()
      window.location.href = portalUrl
    } catch (error) {
      console.error("Failed to get customer portal URL:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Your current subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authStore.user?.activeMember ? (
            <Alert>
              <AlertDescription className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Your subscription is active
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                Your subscription is inactive. Please renew to access premium content.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-1">
            <p className="text-sm font-medium">Plan</p>
            <p>Monthly Yoga Subscription</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Price</p>
            <p>$12.00 per month</p>
          </div>

          {authStore.user?.analytics?.monthsPaid > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Membership Duration</p>
              <p>
                {authStore.user.analytics.monthsPaid} {authStore.user.analytics.monthsPaid === 1 ? "month" : "months"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleManageSubscription}>Manage Subscription</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent payments</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionStore.paymentHistory.length > 0 ? (
            <div className="space-y-4">
              {subscriptionStore.paymentHistory.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{new Date(payment.timestamp).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Monthly Subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{payment.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No payment history available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
})

export default BillingPage
