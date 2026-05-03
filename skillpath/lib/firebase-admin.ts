import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is missing from environment variables.");
      }
      // In development, we can fallback to project ID if ADC is available locally
      return initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    // Sanitize and Parse
    let sanitized = serviceAccountKey.trim();
    
    // Auto-detect Base64 encoding
    if (!sanitized.startsWith('{') && !sanitized.startsWith('"')) {
      try {
        console.log("[Firebase Admin] Base64 encoding detected, decoding...");
        sanitized = Buffer.from(sanitized, 'base64').toString('utf8');
      } catch (e) {
        console.error("[Firebase Admin] Failed to decode Base64 key");
      }
    }

    if (sanitized.startsWith('"') && sanitized.endsWith('"')) {
      sanitized = sanitized.slice(1, -1);
    }
    
    // Parse the JSON
    const parsed = JSON.parse(sanitized);

    // ONLY replace newlines in the private_key field after parsing
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }

    return initializeApp({
      credential: cert(parsed),
      projectId: parsed.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (err) {
    console.error("CRITICAL: Firebase Admin failed to initialize:", err instanceof Error ? err.message : err);
    // Don't return null silently in production, as it causes race conditions later
    if (process.env.NODE_ENV === "production") {
      throw err;
    }
    return null;
  }
}

const adminApp = getFirebaseAdmin();
export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminAuth = adminApp ? getAuth(adminApp) : null;
export default adminApp;
