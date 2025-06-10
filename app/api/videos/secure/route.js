import { NextResponse } from "next/server";
import { generateSignedUrl } from "@/lib/bunny";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { firestore } from "@/lib/firebase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    console.log("🎥 Secure video request for videoId:", videoId);
    console.log(
      "🔍 All request headers:",
      Object.fromEntries(request.headers.entries())
    );

    if (!videoId) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 });
    }

    // Verify user authentication
    const token = getTokenFromRequest(request);
    console.log("🔑 Token found:", !!token);

    if (!token) {
      console.log(
        "❌ No token found - headers:",
        Object.fromEntries(request.headers.entries())
      );
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await verifyToken(token);
      console.log("✅ Token verified for user:", decodedToken.uid);
    } catch (error) {
      console.error("❌ Token verification failed:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user from Firebase
    const userDoc = await firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      console.error("❌ User not found in Firebase:", decodedToken.uid);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    console.log("👤 User data:", {
      uid: decodedToken.uid,
      activeMember: userData.activeMember,
      email: userData.email,
    });

    // Check if user has active membership
    if (!userData.activeMember) {
      console.log("❌ User does not have active membership");
      return NextResponse.json(
        {
          error: "Active membership required",
          details: "Please subscribe to access premium content",
        },
        { status: 403 }
      );
    }

    // Generate signed URL
    try {
      const signedUrl = generateSignedUrl(videoId);
      console.log("✅ Generated signed URL for video:", videoId);

      return NextResponse.json({ signedUrl });
    } catch (error) {
      console.error("❌ Error generating signed URL:", error);
      return NextResponse.json(
        {
          error: "Failed to generate video URL",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Unexpected error in secure video API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
