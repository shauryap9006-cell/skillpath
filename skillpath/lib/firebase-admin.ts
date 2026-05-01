import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccount) {
      const parsed: ServiceAccount = JSON.parse(serviceAccount);
      return initializeApp({
        credential: cert(parsed),
      });
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.warn("⚠️ Firebase Admin: No Project ID or Service Account found. Database features will be disabled.");
      return null;
    }

    return initializeApp({
      projectId,
    });
  } catch (err) {
    console.error("❌ Firebase Admin initialization error:", err);
    return null;
  }
}

const adminApp = getFirebaseAdmin();
export const adminDb = adminApp ? getFirestore(adminApp) : null;
export default adminApp;
