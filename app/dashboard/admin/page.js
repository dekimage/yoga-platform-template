"use client"

import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserTable } from "@/components/admin/UserTable"
import { AnalyticsOverview } from "@/components/admin/AnalyticsOverview"
import { VideoManagement } from "@/components/admin/VideoManagement"

const AdminPage = observer(() => {
  const { authStore, adminStore } = useStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        // Check if user is admin
        if (!authStore.user?.isAdmin) {
          setError("You do not have permission to access this page")
          return
        }

        // Load admin data
        await adminStore.initialize()
      } catch (err) {
        console.error("Error loading admin data:", err)
        setError("Failed to load admin data")
      } finally {
        setLoading(false)
      }
    }

    if (authStore.isInitialized) {
      loadAdminData()
    }
  }, [authStore, adminStore])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, content, and view analytics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{adminStore.totalUsers}</CardTitle>
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{adminStore.activeSubscriptions}</CardTitle>
            <CardDescription>Active Subscriptions</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${adminStore.monthlyRevenue.toFixed(2)}</CardTitle>
            <CardDescription>Monthly Revenue</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
              <div className="mt-4">
                <Input placeholder="Search users..." onChange={(e) => adminStore.setUserSearchQuery(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              <UserTable users={adminStore.filteredUsers} onToggleActivation={adminStore.toggleUserActivation} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsOverview data={adminStore.analyticsData} />
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <VideoManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
})

export default AdminPage
