import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { firestore } from "@/lib/firebase";

export async function GET(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decodedToken = await verifyToken(token);
    const { orderId } = params;

    // Verify order belongs to user
    const orderDoc = await firestore.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data();

    if (orderData.userId !== decodedToken.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get invoice from Polar API
    const response = await fetch(
      `https://api.polar.sh/v1/orders/${orderData.polarOrderId}/invoice`,
      {
        headers: {
          Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get invoice from Polar");
    }

    const invoiceBlob = await response.blob();

    return new NextResponse(invoiceBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${orderId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return NextResponse.json(
      { error: "Failed to download invoice" },
      { status: 500 }
    );
  }
}
