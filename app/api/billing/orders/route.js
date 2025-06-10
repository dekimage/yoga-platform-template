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

    // Get user's orders from Firestore
    const ordersQuery = await firestore
      .collection("orders")
      .where("userId", "==", decodedToken.uid)
      .orderBy("paidAt", "desc")
      .limit(50)
      .get();

    const orders = ordersQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
