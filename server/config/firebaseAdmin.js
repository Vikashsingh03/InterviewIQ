import { initializeApp, cert, getApps } from "firebase-admin/app";

let initialized = false;

const initFirebaseAdmin = () => {
  if (initialized || getApps().length > 0) {
    initialized = true;
    return true;
  }

  const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!base64Key) {
    console.warn(
      "[auth] FIREBASE_SERVICE_ACCOUNT_BASE64 is not set — Google sign-in will fail until it's added to server/.env.",
    );
    return false;
  }

  try {
    const serviceAccountJson = Buffer.from(base64Key, "base64").toString(
      "utf-8",
    );
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({
      credential: cert(serviceAccount),
    });
    initialized = true;
    return true;
  } catch (error) {
    console.error("[auth] Failed to initialize Firebase Admin:", error.message);
    return false;
  }
};

export default initFirebaseAdmin;