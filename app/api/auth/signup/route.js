import { NextResponse } from "next/server";
import { auth, firestore } from "@/lib/firebase";

export async function POST(request) {
  try {
    const { email, password, fullName, marketingConsent } =
      await request.json();

    console.log("🔄 Creating user account for:", email);
    console.log("📝 Request data:", {
      email,
      fullName,
      marketingConsent,
      passwordLength: password?.length,
    });

    // Validate required fields
    if (!email || !password || !fullName) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      console.error("❌ Password too short");
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    console.log("🔥 Creating Firebase user...");

    // Create Firebase user with email and password
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
    });

    console.log("✅ Firebase user created:", userRecord.uid);
    console.log("📧 User email:", userRecord.email);

    // Create user document in Firestore
    const userData = {
      email,
      fullName,
      activeMember: false, // Default to false, they can upgrade later
      createdAt: new Date(),
      updatedAt: new Date(),
      analytics: {
        minutesWatched: 0,
        monthsPaid: 0,
        lastSession: new Date(),
        completedVideos: [],
      },
      preferences: {
        notifications: true,
      },
      marketingConsent: marketingConsent || false,
    };

    console.log("💾 Creating Firestore document...");
    await firestore.collection("users").doc(userRecord.uid).set(userData);
    console.log("✅ User document created in Firestore");

    return NextResponse.json({
      success: true,
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        fullName,
        activeMember: false,
      },
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);

    // Handle specific Firebase errors
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    if (error.code === "auth/invalid-email") {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
