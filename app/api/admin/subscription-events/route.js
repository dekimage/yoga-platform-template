import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";

function verifyAdminToken(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = (page - 1) * limit;

    // Get total count
    const totalSnapshot = await firestore
      .collection("subscription_events")
      .get();
    const total = totalSnapshot.size;

    // Get paginated events
    const eventsQuery = firestore
      .collection("subscription_events")
      .orderBy("processedAt", "desc")
      .limit(limit)
      .offset(offset);

    const eventsSnapshot = await eventsQuery.get();
    const events = [];

    eventsSnapshot.forEach((doc) => {
      const eventData = doc.data();
      events.push({
        id: doc.id,
        ...eventData,
        // Convert Firestore timestamps
        processedAt:
          eventData.processedAt?.toDate?.()?.toISOString() ||
          eventData.processedAt,
        // Don't include eventData as it's too big
        eventData: undefined,
      });
    });

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription events:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription events" },
      { status: 500 }
    );
  }
}
