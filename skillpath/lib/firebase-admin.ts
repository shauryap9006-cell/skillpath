import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccount) {
      try {
        // Handle cases where Vercel might add extra quotes or escape characters
        if (serviceAccount.startsWith('"') && serviceAccount.endsWith('"')) {
          serviceAccount = serviceAccount.slice(1, -1);
        }
        // Handle escaped newlines if the JSON was pasted as a single line
        const sanitized = serviceAccount.replace(/\\n/g, '\n');
        const parsed: ServiceAccount = JSON.parse(sanitized);
        
        return initializeApp({
          credential: cert(parsed),
        });
      } catch (parseErr) {
        console.error("❌ Firebase Service Account Parse Error:", parseErr);
        // Fall through to project ID check
      }
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
export const adminAuth = adminApp ? getAuth(adminApp) : null;
export default adminApp;
