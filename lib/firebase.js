import admin from "firebase-admin";

if (!admin.apps.length) {
  // More robust private key handling
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Handle base64 encoded private key (alternative approach)
  if (privateKey && !privateKey.includes("BEGIN PRIVATE KEY")) {
    try {
      privateKey = Buffer.from(privateKey, "base64").toString("utf8");
    } catch (e) {
      console.error("Failed to decode base64 private key:", e);
    }
  }

  // Replace escaped newlines
  privateKey = privateKey ? privateKey.replace(/\\n/g, "\n") : undefined;

  if (
    !privateKey ||
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL
  ) {
    console.error("Missing required Firebase environment variables");
    throw new Error("Firebase configuration incomplete");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const auth = admin.auth();
export const firestore = admin.firestore();
export default admin;
