import { NextResponse } from "next/server"
import { firestore } from "@/lib/firebase"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decodedToken = await verifyToken(token)
    const { action, videoId, minutesWatched } = await request.json()

    const userRef = firestore.collection("users").doc(decodedToken.uid)

    if (action === "view") {
      await userRef.update({
        "analytics.lastSession": new Date(),
      })
    } else if (action === "complete") {
      await userRef.update({
        "analytics.completedVideos": firestore.FieldValue.arrayUnion(videoId),
      })
    } else if (action === "watchTime" && minutesWatched) {
      await userRef.update({
        "analytics.minutesWatched": firestore.FieldValue.increment(minutesWatched),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating analytics:", error)
    return NextResponse.json({ error: "Failed to update analytics" }, { status: 500 })
  }
}
