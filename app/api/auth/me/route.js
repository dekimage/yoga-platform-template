import { NextResponse } from "next/server"
import { firestore } from "@/lib/firebase"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decodedToken = await verifyToken(token)
    const userDoc = await firestore.collection("users").doc(decodedToken.uid).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()
    return NextResponse.json({
      id: decodedToken.uid,
      ...userData,
    })
  } catch (error) {
    console.error("Error getting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
