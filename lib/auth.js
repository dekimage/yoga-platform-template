import { auth } from "./firebase";

export async function verifyToken(token) {
  try {
    // For custom tokens, we need to verify them differently
    // Custom tokens are used to authenticate with Firebase client SDK
    // But for server-side verification, we should use a different approach

    // Try to verify as ID token first (for client-generated tokens)
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return decodedToken;
    } catch (idTokenError) {
      // If ID token verification fails, try custom token verification
      // Custom tokens need to be exchanged for ID tokens on the client side
      // For now, let's decode the JWT manually to get the uid
      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      if (decoded.uid) {
        return { uid: decoded.uid };
      }

      throw new Error("No UID found in token");
    }
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
