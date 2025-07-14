import { auth } from "./firebase";

export async function verifyToken(token) {
  try {
    // Try to verify as ID token first (for client-generated tokens)
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return decodedToken;
    } catch (idTokenError) {
      // If ID token verification fails, try to decode as custom token
      try {
        // Split the JWT token into parts
        const parts = token.split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid JWT format");
        }

        // Decode the payload (second part)
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());

        // For custom tokens, the uid is in the payload
        if (payload.uid) {
          return { uid: payload.uid };
        }

        // For some tokens, the user ID might be in the 'sub' field
        if (payload.sub) {
          return { uid: payload.sub };
        }

        throw new Error("No UID found in token payload");
      } catch (decodeError) {
        throw new Error("Invalid token format");
      }
    }
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export function getTokenFromRequest(req) {
  // Get authorization header (case-insensitive)
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  return token;
}
