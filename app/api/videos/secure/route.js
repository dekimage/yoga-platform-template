import { NextResponse } from "next/server"
import { generateSignedUrl } from "@/lib/bunny"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { firestore } from "@/lib/firebase"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("videoId")

    if (!videoId) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 })
    }

    // Verify user authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decodedToken = await verifyToken(token)
    const userDoc = await firestore.collection("users").doc(decodedToken.uid).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()

    // Check if user has active membership
    if (!userData.activeMember) {
      return NextResponse.json({ error: "Active membership required" }, { status: 403 })
    }

    // Generate signed URL
    const signedUrl = generateSignedUrl(videoId)

    return NextResponse.json({ signedUrl })
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return NextResponse.json({ error: "Failed to generate video URL" }, { status: 500 })
  }
}
