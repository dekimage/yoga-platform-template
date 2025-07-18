import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { firestore } from "@/lib/firebase";

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decodedToken = await verifyToken(token);

    // Get user document
    const userDoc = await firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    if (!userData.polarCustomerId) {
      return NextResponse.json(
        { error: "No customer ID found" },
        { status: 400 }
      );
    }

    // Build the direct portal URL using the format from your working email link
    const portalUrl = `https://sandbox.polar.sh/yoga-platform-sandbox/portal/overview?id=${userData.polarCustomerId}`;

    // Return the portal URL as JSON
    return NextResponse.json({
      success: true,
      portal_url: portalUrl,
      message: "Redirecting to customer portal",
    });
  } catch (error) {
    console.error("Error accessing portal:", error);
    return NextResponse.json(
      { error: error.message || "Failed to access portal" },
      { status: 500 }
    );
  }
}
