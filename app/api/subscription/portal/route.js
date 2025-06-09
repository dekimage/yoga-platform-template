import { CustomerPortal } from "@polar-sh/nextjs";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { firestore } from "@/lib/firebase";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  getCustomerId: async (req) => {
    try {
      // Get the authenticated user's token
      const token = getTokenFromRequest(req);
      if (!token) {
        throw new Error("Authentication required");
      }

      // Verify the token and get user ID
      const decodedToken = await verifyToken(token);

      // Get user document from Firestore
      const userDoc = await firestore
        .collection("users")
        .doc(decodedToken.uid)
        .get();

      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();

      // Return the Polar customer ID
      return userData.polarCustomerId || "";
    } catch (error) {
      console.error("Error getting customer ID:", error);
      return "";
    }
  },
  server: "sandbox", // Use sandbox for testing
});
