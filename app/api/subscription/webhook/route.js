import { Webhooks } from "@polar-sh/nextjs";
import { auth, firestore } from "@/lib/firebase";

// Helper function to find or create a user in Firebase and Firestore
const findOrCreateUser = async (data) => {
  const { customerId, customer_email, customer_name, metadata } = data;

  if (!customerId) {
    console.error("Webhook Error: No customerId in payload data.");
    return null;
  }

  const usersRef = firestore.collection("users");
  const userQuery = await usersRef
    .where("polarCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (!userQuery.empty) {
    const userDoc = userQuery.docs[0];
    console.log(
      `Webhook: Found existing user ${userDoc.id} for polarCustomerId ${customerId}`
    );
    return { uid: userDoc.id, ...userDoc.data() };
  }

  console.log(
    `Webhook: No user found for polarCustomerId ${customerId}. Creating new user for ${customer_email}.`
  );

  try {
    const userRecord = await auth.createUser({
      email: customer_email,
      displayName: customer_name,
    });

    const userData = {
      uid: userRecord.uid,
      email: customer_email,
      fullName: customer_name,
      activeMember: true, // They just paid, so they are active.
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

    await firestore.collection("users").doc(userRecord.uid).set(userData);
    console.log(`Webhook: Created new user ${userRecord.uid}`);
    return { id: userRecord.uid, ...userData };
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      console.warn(
        `Webhook: Firebase Auth user with email ${customer_email} already exists.`
      );
      const existingAuthUser = await auth.getUserByEmail(customer_email);
      const userDocRef = firestore
        .collection("users")
        .doc(existingAuthUser.uid);
      await userDocRef.set(
        {
          polarCustomerId: customerId,
          activeMember: true,
        },
        { merge: true }
      );
      console.log(
        `Webhook: Linked polarCustomerId ${customerId} to existing auth user ${existingAuthUser.uid}`
      );
      const updatedDoc = await userDocRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    }
    console.error("Webhook Error: Failed to create user.", error);
    throw error;
  }
};

// Helper function to update a user's subscription status
async function updateUserSubscription(data) {
  if (!data.customerId) {
    console.warn("Webhook: Missing customerId in subscription update.");
    return;
  }

  const userQuery = await firestore
    .collection("users")
    .where("polarCustomerId", "==", data.customerId)
    .get();

  if (userQuery.empty) {
    console.warn(
      `Webhook: Cannot update subscription. User not found for polarCustomerId: ${data.customerId}`
    );
    return;
  }

  const userDoc = userQuery.docs[0];
  const updateData = {
    activeMember: data.status === "active",
    subscriptionId: data.id,
    subscriptionStatus: data.status,
    subscriptionEndDate: data.current_period_end
      ? new Date(data.current_period_end)
      : null,
  };

  await userDoc.ref.update(updateData);
  console.log(
    `Webhook: Updated subscription for user ${userDoc.id}. Status: ${data.status}`
  );
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,

  // Customer events
  onCustomerCreated: async (payload) => {
    console.log("Customer created:", payload);
    // Customer creation is handled in order.paid event
  },

  onCustomerUpdated: async (payload) => {
    console.log("Customer updated:", payload);
    const userQuery = await firestore
      .collection("users")
      .where("polarCustomerId", "==", payload.id)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        email: payload.email,
        fullName: payload.name,
        updatedAt: new Date(),
      });
    }
  },

  onCustomerStateChanged: async (payload) => {
    console.log("Customer state changed:", payload);
    const userQuery = await firestore
      .collection("users")
      .where("polarCustomerId", "==", payload.id)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        customerState: payload.state,
        updatedAt: new Date(),
      });
    }
  },

  // Subscription events
  onSubscriptionCreated: async (payload) => {
    console.log("Webhook: Received subscription.created event.");
    await updateUserSubscription(payload.data);
  },

  onSubscriptionUpdated: async (payload) => {
    console.log("Webhook: Received subscription.updated event.");
    await updateUserSubscription(payload.data);
  },

  onSubscriptionActive: async (payload) => {
    console.log("Subscription active:", payload);
    const userQuery = await firestore
      .collection("users")
      .where("polarCustomerId", "==", payload.customerId)
      .get();

    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({
        activeMember: true,
        subscriptionStatus: "active",
      });
    }
  },

  onSubscriptionCanceled: async (payload) => {
    console.log("Webhook: Received subscription.canceled event.");
    await updateUserSubscription(payload.data);
  },

  onSubscriptionUncanceled: async (payload) => {
    console.log("Subscription uncanceled:", payload);
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
    console.log("Subscription revoked:", payload);
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
    console.log("Order created:", payload);
    // Log the order
    await firestore.collection("orders").add({
      polarOrderId: payload.id,
      polarCustomerId: payload.customerId,
      amount: payload.amount / 100, // Convert from cents
      currency: payload.currency,
      status: payload.status,
      createdAt: new Date(payload.created_at),
    });
  },

  onOrderPaid: async (payload) => {
    console.log("Webhook: Received order.paid event.");
    const data = payload.data;
    const user = await findOrCreateUser(data);

    if (user && user.uid) {
      // Use the Polar Order ID as the document ID in Firestore to prevent duplicates
      const orderRef = firestore.collection("orders").doc(data.id);
      await orderRef.set(
        {
          userId: user.uid,
          polarOrderId: data.id,
          polarCustomerId: data.customerId,
          amount: data.amount,
          currency: data.currency,
          status: "paid",
          createdAt: new Date(data.created_at),
          paidAt: new Date(),
          subscriptionId: data.subscription_id,
        },
        { merge: true }
      );
      console.log(`Webhook: Logged paid order ${data.id} for user ${user.uid}`);
    } else {
      console.error(
        "Webhook Error: Could not process order.paid because user could not be found or created."
      );
    }
  },

  onOrderRefunded: async (payload) => {
    console.log("Order refunded:", payload);

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
        refundAmount: payload.refund_amount / 100, // Convert from cents
      });
    }
  },
});
