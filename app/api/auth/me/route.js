import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { firestore } from "@/lib/firebase";

export async function GET(request) {
  try {
    console.log("👤 /me API called");

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decodedToken = await verifyToken(token);
    console.log("✅ Token verified for user:", decodedToken.uid);

    // Get user document
    const userDoc = await firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let userData = userDoc.data();
    console.log("📄 Current user data:", JSON.stringify(userData, null, 2));

    // 🎯 CHECK FOR EXPIRED SUBSCRIPTION ON EACH /me CALL
    const needsUpdate = await checkAndUpdateExpiredSubscription(
      userDoc,
      userData
    );

    // If we updated the user, get fresh data
    if (needsUpdate) {
      const updatedDoc = await firestore
        .collection("users")
        .doc(decodedToken.uid)
        .get();
      userData = updatedDoc.data();
      console.log(
        "📄 Updated user data after expiry check:",
        JSON.stringify(userData, null, 2)
      );
    }

    // Return user data
    return NextResponse.json({
      uid: decodedToken.uid,
      email: userData.email,
      fullName: userData.fullName,
      activeMember: userData.activeMember,
      subscriptionStatus: userData.subscriptionStatus,
      subscriptionEndsAt: userData.subscriptionEndsAt,
      canceledAt: userData.canceledAt,
      willRenew: userData.willRenew,
      analytics: userData.analytics,
    });
  } catch (error) {
    console.error("❌ Error in /me API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 🎯 SMART EXPIRY CHECK FUNCTION
async function checkAndUpdateExpiredSubscription(userDoc, userData) {
  // Only check if user is currently active and has a cancellation
  if (
    !userData.activeMember ||
    userData.subscriptionStatus !== "canceled" ||
    !userData.subscriptionEndsAt
  ) {
    return false; // No update needed
  }

  const now = new Date();
  const endsAt = userData.subscriptionEndsAt.toDate
    ? userData.subscriptionEndsAt.toDate()
    : new Date(userData.subscriptionEndsAt);

  // Check if subscription has expired
  if (now > endsAt) {
    console.log(
      `⏰ Subscription expired for user ${
        userDoc.id
      } (ended: ${endsAt.toISOString()})`
    );

    // Update user to remove access
    const updateData = {
      activeMember: false,
      subscriptionStatus: "expired",
      expiredAt: now,
      updatedAt: now,
    };

    await userDoc.ref.update(updateData);

    // Log the expiration event
    await firestore.collection("subscription_events").add({
      userId: userDoc.id,
      eventType: "access_expired_on_login",
      expiredAt: now,
      originalEndDate: endsAt,
      processedAt: now,
    });

    console.log(
      `❌ Access removed for user ${userDoc.id} - subscription expired on login`
    );
    return true; // Updated
  }

  console.log(
    `✅ User ${userDoc.id} still has access until ${endsAt.toISOString()}`
  );
  return false; // No update needed
}
