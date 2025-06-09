import { Webhooks } from "@polar-sh/nextjs";
import { auth, firestore } from "@/lib/firebase";

// Helper function to find or create a user in Firebase and Firestore
const findOrCreateUser = async (data) => {
  console.log(
    "🔍 findOrCreateUser called with data:",
    JSON.stringify(data, null, 2)
  );

  const { customerId, customer_email, customer_name, metadata } = data;

  if (!customerId) {
    console.error("❌ Webhook Error: No customerId in payload data.");
    return null;
  }

  console.log(`🔍 Searching for user with polarCustomerId: ${customerId}`);

  const usersRef = firestore.collection("users");
  const userQuery = await usersRef
    .where("polarCustomerId", "==", customerId)
    .limit(1)
    .get();

  console.log(
    `📊 User query result: ${userQuery.empty ? "EMPTY" : "FOUND"}, size: ${
      userQuery.size
    }`
  );

  if (!userQuery.empty) {
    const userDoc = userQuery.docs[0];
    console.log(
      `✅ Found existing user ${userDoc.id} for polarCustomerId ${customerId}`
    );
    console.log(`📄 User data:`, userDoc.data());
    return { uid: userDoc.id, ...userDoc.data() };
  }

  console.log(
    `🆕 No user found for polarCustomerId ${customerId}. Creating new user for ${customer_email}.`
  );

  try {
    const userRecord = await auth.createUser({
      email: customer_email,
      displayName: customer_name,
    });

    console.log(`🔥 Created Firebase Auth user: ${userRecord.uid}`);

    const userData = {
      uid: userRecord.uid,
      email: customer_email,
      fullName: customer_name,
      activeMember: true,
      createdAt: new Date(),
      polarCustomerId: customerId,
      marketingConsent: metadata?.marketingConsent === "true" || false,
      analytics: {
        minutesWatched: 0,
        monthsPaid: 1,
        lastSession: new Date(),
        completedVideos: [],
      },
      preferences: {
        notifications: true,
      },
    };

    console.log(`💾 Saving user data to Firestore:`, userData);

    await firestore.collection("users").doc(userRecord.uid).set(userData);
    console.log(
      `✅ Successfully created new user ${userRecord.uid} in Firestore`
    );
    return { id: userRecord.uid, ...userData };
  } catch (error) {
    console.error(`❌ Error creating user:`, error);

    if (error.code === "auth/email-already-exists") {
      console.warn(
        `⚠️ Firebase Auth user with email ${customer_email} already exists.`
      );
      const existingAuthUser = await auth.getUserByEmail(customer_email);
      console.log(`🔍 Found existing auth user: ${existingAuthUser.uid}`);

      const userDocRef = firestore
        .collection("users")
        .doc(existingAuthUser.uid);

      console.log(
        `💾 Updating existing user with polarCustomerId: ${customerId}`
      );

      await userDocRef.set(
        {
          polarCustomerId: customerId,
          activeMember: true,
        },
        { merge: true }
      );

      console.log(
        `✅ Linked polarCustomerId ${customerId} to existing auth user ${existingAuthUser.uid}`
      );

      const updatedDoc = await userDocRef.get();
      console.log(`📄 Updated user data:`, updatedDoc.data());

      return { id: updatedDoc.id, ...updatedDoc.data() };
    }
    console.error("❌ Webhook Error: Failed to create user.", error);
    throw error;
  }
};

// Helper function to update a user's subscription status
async function updateUserSubscription(data) {
  console.log(
    "🔄 updateUserSubscription called with data:",
    JSON.stringify(data, null, 2)
  );

  if (!data.customerId) {
    console.warn("⚠️ Webhook: Missing customerId in subscription update.");
    return;
  }

  console.log(`🔍 Searching for user with polarCustomerId: ${data.customerId}`);

  const userQuery = await firestore
    .collection("users")
    .where("polarCustomerId", "==", data.customerId)
    .get();

  console.log(
    `📊 User query result: ${userQuery.empty ? "EMPTY" : "FOUND"}, size: ${
      userQuery.size
    }`
  );

  if (userQuery.empty) {
    console.warn(
      `⚠️ Webhook: Cannot update subscription. User not found for polarCustomerId: ${data.customerId}`
    );
    return;
  }

  const userDoc = userQuery.docs[0];
  console.log(`✅ Found user ${userDoc.id} for subscription update`);

  const updateData = {
    activeMember: data.status === "active",
    subscriptionId: data.id,
    subscriptionStatus: data.status,
    subscriptionEndDate: data.current_period_end
      ? new Date(data.current_period_end)
      : null,
  };

  console.log(`💾 Updating user with data:`, updateData);

  await userDoc.ref.update(updateData);
  console.log(
    `✅ Updated subscription for user ${userDoc.id}. Status: ${data.status}`
  );
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,

  // Customer events
  onCustomerCreated: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Customer created:",
      JSON.stringify(payload, null, 2)
    );
  },

  onCustomerUpdated: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Customer updated:",
      JSON.stringify(payload, null, 2)
    );

    const userQuery = await firestore
      .collection("users")
      .where("polarCustomerId", "==", payload.id)
      .get();

    console.log(
      `📊 Customer update query result: ${
        userQuery.empty ? "EMPTY" : "FOUND"
      }, size: ${userQuery.size}`
    );

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      console.log(`💾 Updating customer info for user ${userDoc.id}`);

      await userDoc.ref.update({
        email: payload.email,
        fullName: payload.name,
        updatedAt: new Date(),
      });

      console.log(`✅ Updated customer info for user ${userDoc.id}`);
    }
  },

  onCustomerStateChanged: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Customer state changed:",
      JSON.stringify(payload, null, 2)
    );

    const userQuery = await firestore
      .collection("users")
      .where("polarCustomerId", "==", payload.id)
      .get();

    console.log(
      `📊 Customer state change query result: ${
        userQuery.empty ? "EMPTY" : "FOUND"
      }, size: ${userQuery.size}`
    );

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      console.log(`💾 Updating customer state for user ${userDoc.id}`);

      await userDoc.ref.update({
        customerState: payload.state,
        updatedAt: new Date(),
      });

      console.log(`✅ Updated customer state for user ${userDoc.id}`);
    }
  },

  // Subscription events
  onSubscriptionCreated: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Subscription created:",
      JSON.stringify(payload, null, 2)
    );
    await updateUserSubscription(payload.data);
  },

  onSubscriptionUpdated: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Subscription updated:",
      JSON.stringify(payload, null, 2)
    );
    await updateUserSubscription(payload.data);
  },

  onSubscriptionActive: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Subscription active:",
      JSON.stringify(payload, null, 2)
    );

    const userQuery = await firestore
      .collection("users")
      .where("polarCustomerId", "==", payload.customerId)
      .get();

    console.log(
      `📊 Subscription active query result: ${
        userQuery.empty ? "EMPTY" : "FOUND"
      }, size: ${userQuery.size}`
    );

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      console.log(`💾 Setting user ${userDoc.id} as active member`);

      await userDoc.ref.update({
        activeMember: true,
        subscriptionStatus: "active",
      });

      console.log(`✅ Set user ${userDoc.id} as active member`);
    }
  },

  onSubscriptionCanceled: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Subscription canceled:",
      JSON.stringify(payload, null, 2)
    );
    await updateUserSubscription(payload.data);
  },

  onSubscriptionUncanceled: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Subscription uncanceled:",
      JSON.stringify(payload, null, 2)
    );

    const userQuery = await firestore
      .collection("users")
      .where("polarCustomerId", "==", payload.customerId)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        subscriptionStatus: "active",
        cancellationDate: null,
      });
    }
  },

  onSubscriptionRevoked: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Subscription revoked:",
      JSON.stringify(payload, null, 2)
    );

    const userQuery = await firestore
      .collection("users")
      .where("polarCustomerId", "==", payload.customerId)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        activeMember: false,
        subscriptionStatus: "revoked",
        subscriptionEndDate: new Date(),
      });
    }
  },

  // Order events
  onOrderCreated: async (payload) => {
    console.log("🎯 WEBHOOK: Order created:", JSON.stringify(payload, null, 2));

    console.log(`💾 Creating order document in Firestore`);

    await firestore.collection("orders").add({
      polarOrderId: payload.id,
      polarCustomerId: payload.customerId,
      amount: payload.amount / 100,
      currency: payload.currency,
      status: payload.status,
      createdAt: new Date(payload.created_at),
    });

    console.log(`✅ Created order document for order ${payload.id}`);
  },

  onOrderPaid: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Order paid - MOST IMPORTANT EVENT:",
      JSON.stringify(payload, null, 2)
    );
    const data = payload.data;

    console.log(
      `🔍 Searching for existing user with email: ${data.customer_email}`
    );

    // Check if user already exists by email
    const userQuery = await firestore
      .collection("users")
      .where("email", "==", data.customer_email)
      .get();

    console.log(
      `📊 Email search result: ${userQuery.empty ? "EMPTY" : "FOUND"}, size: ${
        userQuery.size
      }`
    );

    let user;

    if (!userQuery.empty) {
      // User exists, update their subscription status
      const userDoc = userQuery.docs[0];
      console.log(
        `✅ Found existing user ${userDoc.id} with email ${data.customer_email}`
      );
      console.log(`📄 Current user data:`, userDoc.data());

      const updateData = {
        activeMember: true,
        polarCustomerId: data.customerId,
        subscriptionId: data.subscription_id,
        subscriptionStatus: "active",
        updatedAt: new Date(),
        analytics: {
          ...userDoc.data().analytics,
          monthsPaid: (userDoc.data().analytics?.monthsPaid || 0) + 1,
        },
      };

      console.log(`💾 Updating existing user with:`, updateData);

      await userDoc.ref.update(updateData);

      console.log(
        `✅ Successfully updated existing user ${userDoc.id} to active member`
      );

      // Get updated data
      const updatedDoc = await userDoc.ref.get();
      user = { uid: userDoc.id, ...updatedDoc.data() };

      console.log(`📄 Updated user data:`, user);
    } else {
      console.log(
        `🆕 No user found with email ${data.customer_email}, creating new user`
      );
      // Create new user (existing logic)
      user = await findOrCreateUser(data);
    }

    if (user && user.uid) {
      console.log(`💾 Creating order record for user ${user.uid}`);

      // Create order record
      const orderRef = firestore.collection("orders").doc(data.id);
      const orderData = {
        userId: user.uid,
        polarOrderId: data.id,
        polarCustomerId: data.customerId,
        amount: data.amount,
        currency: data.currency,
        status: "paid",
        createdAt: new Date(data.created_at),
        paidAt: new Date(),
        subscriptionId: data.subscription_id,
      };

      console.log(`💾 Order data:`, orderData);

      await orderRef.set(orderData, { merge: true });

      console.log(
        `✅ Successfully logged paid order ${data.id} for user ${user.uid}`
      );
    } else {
      console.error(
        `❌ CRITICAL ERROR: Could not process order.paid because user could not be found or created.`
      );
    }
  },

  onOrderRefunded: async (payload) => {
    console.log(
      "🎯 WEBHOOK: Order refunded:",
      JSON.stringify(payload, null, 2)
    );

    // Update order status
    const orderQuery = await firestore
      .collection("orders")
      .where("polarOrderId", "==", payload.id)
      .get();

    if (!orderQuery.empty) {
      const orderDoc = orderQuery.docs[0];
      await orderDoc.ref.update({
        status: "refunded",
        refundedAt: new Date(),
        refundAmount: payload.refund_amount / 100,
      });
    }
  },
});
