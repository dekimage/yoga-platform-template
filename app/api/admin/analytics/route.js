import { NextResponse } from "next/server"
import { firestore } from "@/lib/firebase"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decodedToken = await verifyToken(token)
    const adminUserDoc = await firestore.collection("users").doc(decodedToken.uid).get()

    if (!adminUserDoc.exists || !adminUserDoc.data().isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Calculate analytics
    const usersSnapshot = await firestore.collection("users").get()
    let totalWatchTime = 0
    let totalSessions = 0
    let completedVideos = 0
    let totalVideosStarted = 0

    usersSnapshot.forEach((doc) => {
      const userData = doc.data()
      if (userData.analytics) {
        totalWatchTime += userData.analytics.minutesWatched || 0
        totalSessions++
        completedVideos += userData.analytics.completedVideos?.length || 0
        totalVideosStarted += (userData.analytics.completedVideos?.length || 0) + 10 // Estimate
      }
    })

    const avgSessionDuration = totalSessions > 0 ? totalWatchTime / totalSessions : 0
    const completionRate = totalVideosStarted > 0 ? (completedVideos / totalVideosStarted) * 100 : 0

    return NextResponse.json({
      totalWatchTime,
      avgSessionDuration,
      completionRate,
      popularVideos: [], // Would need to track video views separately
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
