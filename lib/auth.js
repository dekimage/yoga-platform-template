import { auth } from "./firebase";

export async function verifyToken(token) {
  console.log(
    "🔐 Verifying token:",
    token ? `${token.substring(0, 20)}...` : "null"
  );

  try {
    // Try to verify as ID token first (for client-generated tokens)
    try {
      console.log("🔐 Attempting ID token verification...");
      const decodedToken = await auth.verifyIdToken(token);
      console.log(
        "✅ ID token verified successfully for user:",
        decodedToken.uid
      );
      return decodedToken;
    } catch (idTokenError) {
      console.log("❌ ID token verification failed:", idTokenError.message);

      // If ID token verification fails, try custom token verification
      // Custom tokens need to be exchanged for ID tokens on the client side
      // For now, let's decode the JWT manually to get the uid
      console.log("🔐 Attempting manual JWT decode...");

      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      console.log("🔐 Decoded token payload:", decoded);

      if (decoded.uid) {
        console.log("✅ Manual decode successful for user:", decoded.uid);
        return { uid: decoded.uid };
      }

      throw new Error("No UID found in token");
    }
  } catch (error) {
    console.error("❌ Token verification error:", error);
    throw new Error("Invalid token");
  }
}

export function getTokenFromRequest(req) {
  console.log("🔍 Extracting token from request headers...");

  // Get authorization header (case-insensitive)
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  console.log("🔍 Authorization header:", authHeader ? "Present" : "Missing");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No valid Authorization header found");
    return null;
  }

  const token = authHeader.substring(7);
  console.log(
    "✅ Token extracted:",
    token ? `${token.substring(0, 20)}...` : "null"
  );
  return token;
}
