import { auth, firestore } from "@/lib/firebase";

export async function POST(request) {
  console.log("🎯 WEBHOOK RECEIVED AT:", new Date().toISOString());
  console.log("📦 Headers:", Object.fromEntries(request.headers.entries()));

  try {
    // Get the raw body
    const body = await request.text();
    console.log("📦 Raw body:", body);

    // Parse JSON
    const data = JSON.parse(body);
    console.log("📦 Parsed webhook data:", JSON.stringify(data, null, 2));
    console.log("🏷️ Event type:", data.type);

    // Handle order.paid specifically
    if (data.type === "order.paid") {
      console.log("💰 ORDER PAID EVENT DETECTED!");

      const orderData = data.data;
      const customerEmail = orderData?.customer?.email;
      const customerName = orderData?.customer?.name;
      const customerId = orderData?.customer?.id;

      console.log("🔍 Extracted data:");
      console.log("   - Email:", customerEmail);
      console.log("   - Name:", customerName);
      console.log("   - Customer ID:", customerId);

      if (!customerEmail) {
        console.error("❌ No customer email found in order.paid");
        return new Response("No email", { status: 400 });
      }

      // Find user by email
      console.log(`🔍 Searching for user with email: ${customerEmail}`);
      const userQuery = await firestore
        .collection("users")
        .where("email", "==", customerEmail)
        .limit(1)
        .get();

      console.log(
        `📊 User search result: empty=${userQuery.empty}, size=${userQuery.size}`
      );

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const currentUserData = userDoc.data();

        console.log(`✅ Found user ${userDoc.id}`);
        console.log(
          `📄 Current user data:`,
          JSON.stringify(currentUserData, null, 2)
        );

        // Update user to active member
        const updateData = {
          activeMember: true,
          polarCustomerId: customerId,
          subscriptionId: orderData.subscription_id,
          updatedAt: new Date(),
          webhookProcessedAt: new Date(),
          lastOrderId: orderData.id,
        };

        // Update analytics if exists
        if (currentUserData.analytics) {
          updateData.analytics = {
            ...currentUserData.analytics,
            monthsPaid: (currentUserData.analytics.monthsPaid || 0) + 1,
            lastSession: new Date(),
          };
        }

        console.log(
          `💾 Updating user with:`,
          JSON.stringify(updateData, null, 2)
        );

        await userDoc.ref.update(updateData);

        console.log(
          `✅ Successfully updated user ${userDoc.id} to active member`
        );

        // Verify the update worked
        const verifyDoc = await userDoc.ref.get();
        const verifyData = verifyDoc.data();
        console.log(
          `🔍 VERIFICATION - User after update:`,
          JSON.stringify(verifyData, null, 2)
        );

        // Create order record
        const orderRecord = {
          userId: userDoc.id,
          polarOrderId: orderData.id,
          polarCustomerId: customerId,
          status: orderData.status,
          amount: orderData.amount,
          currency: orderData.currency,
          subscriptionId: orderData.subscription_id,
          createdAt: new Date(orderData.created_at),
          paidAt: new Date(),
          webhookProcessedAt: new Date(),
        };

        console.log(
          `💾 Creating order record:`,
          JSON.stringify(orderRecord, null, 2)
        );

        await firestore
          .collection("orders")
          .doc(orderData.id)
          .set(orderRecord, { merge: true });

        console.log(`✅ Created order record ${orderData.id}`);
      } else {
        console.error(`❌ No user found with email: ${customerEmail}`);
        console.log(`🔍 Available users in database:`);

        // Debug: List all users to see what emails exist
        const allUsers = await firestore.collection("users").limit(5).get();
        allUsers.docs.forEach((doc) => {
          console.log(`   - User ${doc.id}: ${doc.data().email}`);
        });
      }
    } else {
      console.log(`ℹ️ Ignoring event type: ${data.type}`);
    }

    console.log("✅ Webhook processing completed");
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("❌ CRITICAL ERROR in webhook:", error);
    console.error("❌ Error stack:", error.stack);
    return new Response("Error", { status: 500 });
  }
}
