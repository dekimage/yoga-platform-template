"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/DashboardHeader"

const DashboardLayout = observer(({ children }) => {
  const router = useRouter()
  const { authStore, videoStore } = useStore()

  useEffect(() => {
    const initDashboard = async () => {
      try {
        // Check if user is authenticated
        if (!authStore.isInitialized) {
          await authStore.initialize()
        }

        // If not authenticated, redirect to login
        if (!authStore.isAuthenticated) {
          router.push("/login")
          return
        }

        // Load videos if not already loaded
        if (!videoStore.isInitialized) {
          await videoStore.fetchVideos()
        }
      } catch (error) {
        console.error("Dashboard initialization error:", error)
        router.push("/login")
      }
    }

    initDashboard()
  }, [authStore, videoStore, router])

  // Show loading state while initializing
  if (!authStore.isInitialized || !authStore.isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
})

export default DashboardLayout
