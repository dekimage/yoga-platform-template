import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";

function verifyAdminToken(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
  // Simple token verification (you could make this more secure)
  try {
    const decoded = Buffer.from(token, "base64").toString();
    return decoded.includes(process.env.ADMIN_USERNAME);
  } catch {
    return false;
  }
}

export async function GET(request) {
  try {
    if (!verifyAdminToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersSnapshot = await firestore.collection("users").get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        ...userData,
        createdAt:
          userData.createdAt?.toDate?.()?.toISOString() || userData.createdAt,
        updatedAt:
          userData.updatedAt?.toDate?.()?.toISOString() || userData.updatedAt,
        subscriptionEndsAt:
          userData.subscriptionEndsAt?.toDate?.()?.toISOString() ||
          userData.subscriptionEndsAt,
        canceledAt:
          userData.canceledAt?.toDate?.()?.toISOString() || userData.canceledAt,
        webhookProcessedAt:
          userData.webhookProcessedAt?.toDate?.()?.toISOString() ||
          userData.webhookProcessedAt,
        "analytics.lastSession":
          userData.analytics?.lastSession?.toDate?.()?.toISOString() ||
          userData.analytics?.lastSession,
      });
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
