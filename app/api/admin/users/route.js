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

    const usersSnapshot = await firestore.collection("users").get()
    const users = []
    let activeSubscriptions = 0
    let monthlyRevenue = 0

    usersSnapshot.forEach((doc) => {
      const userData = doc.data()
      users.push({
        id: doc.id,
        ...userData,
        createdAt: userData.createdAt.toDate().toISOString(),
      })

      if (userData.activeMember) {
        activeSubscriptions++
        monthlyRevenue += 12 // $12 per month
      }
    })

    return NextResponse.json({
      users,
      total: users.length,
      activeSubscriptions,
      monthlyRevenue,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
