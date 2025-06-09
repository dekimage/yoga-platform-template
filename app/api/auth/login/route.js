import { NextResponse } from "next/server"
import { auth, firestore } from "@/lib/firebase"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // In a real app, you would verify the password here
    // For this demo, we'll just check if user exists
    const userQuery = await firestore.collection("users").where("email", "==", email).get()

    if (userQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userDoc = userQuery.docs[0]
    const userData = userDoc.data()

    // Create a custom token for the user
    const customToken = await auth.createCustomToken(userDoc.id)

    const response = NextResponse.json({
      id: userDoc.id,
      ...userData,
    })

    // Set auth cookie
    response.cookies.set("auth-token", customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
