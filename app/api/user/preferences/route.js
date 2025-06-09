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
    const updateData = await request.json()

    await firestore.collection("users").doc(decodedToken.uid).update(updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
