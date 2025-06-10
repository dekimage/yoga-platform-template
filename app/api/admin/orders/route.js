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
    const totalSnapshot = await firestore.collection("orders").get();
    const total = totalSnapshot.size;

    // Get paginated orders
    const ordersQuery = firestore
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset(offset);

    const ordersSnapshot = await ordersQuery.get();
    const orders = [];

    ordersSnapshot.forEach((doc) => {
      const orderData = doc.data();
      orders.push({
        id: doc.id,
        ...orderData,
        // Convert Firestore timestamps
        createdAt:
          orderData.createdAt?.toDate?.()?.toISOString() || orderData.createdAt,
        paidAt: orderData.paidAt?.toDate?.()?.toISOString() || orderData.paidAt,
        webhookProcessedAt:
          orderData.webhookProcessedAt?.toDate?.()?.toISOString() ||
          orderData.webhookProcessedAt,
      });
    });

    return NextResponse.json({
      orders,
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
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
