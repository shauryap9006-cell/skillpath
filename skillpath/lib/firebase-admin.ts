import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function getFirebaseAdmin(): App | null {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  try {
    let sa;
    
    // Support either normal JSON or Base64
    if (serviceAccountKey) {
      let sanitized = serviceAccountKey.trim();
      // Handle both single and double quotes from .env files
      if ((sanitized.startsWith('"') && sanitized.endsWith('"')) || 
          (sanitized.startsWith("'") && sanitized.endsWith("'"))) {
        sanitized = sanitized.slice(1, -1);
      }
      sa = JSON.parse(sanitized);
    } else if (b64) {
      const json = Buffer.from(b64, 'base64').toString('utf-8');
      sa = JSON.parse(json);
    } else {
      // Fallback for local development
      return initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    // Fix the private key newlines
    if (sa.private_key) {
      sa.private_key = sa.private_key.replace(/\\n/g, '\n');
    }

    return initializeApp({
      credential: cert(sa),
      projectId: sa.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (err) {
    console.error("Firebase Admin init error:", err);
    return null;
  }
}

const app = getFirebaseAdmin();

export const adminDb   = app ? getFirestore(app) : null;
export const adminAuth = app ? getAuth(app)      : null;
export default app;
