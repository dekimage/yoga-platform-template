import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase"

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Generate password reset link
    const link = await auth.generatePasswordResetLink(email)

    // In a real app, you would send this link via email
    console.log("Password reset link:", link)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
  }
}
