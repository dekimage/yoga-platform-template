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
    const adminUserDoc = await firestore.collection("users").doc(decodedToken.uid).get()

    if (!adminUserDoc.exists || !adminUserDoc.data().isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { userId, activate } = await request.json()

    await firestore.collection("users").doc(userId).update({
      activeMember: activate,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error toggling user activation:", error)
    return NextResponse.json({ error: "Failed to toggle user activation" }, { status: 500 })
  }
}
