import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let app: App | null = null;

function initAdmin(): App | null {
  if (getApps().length > 0) return getApps()[0];

  // ── Strategy 1: full service account JSON as base64 (recommended) ──
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (b64) {
    try {
      const json = Buffer.from(b64, 'base64').toString('utf-8');
      const sa   = JSON.parse(json);
      console.log('[Firebase Admin] Initializing via base64 service account');
      return initializeApp({ credential: cert(sa) });
    } catch (e) {
      console.error('[Firebase Admin] Base64 init failed:', e);
    }
  }

  // ── Strategy 2: individual env vars with proper key handling ──
  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey      = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && rawKey) {
    try {
      // Handle every possible encoding Vercel might apply
      let privateKey = rawKey;

      // Remove surrounding quotes if Vercel added them
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }

      // Replace escaped newlines with real newlines
      privateKey = privateKey.replace(/\\n/g, '\n');

      // Verify it looks like a PEM key
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Key does not look like a valid PEM private key');
      }

      console.log('[Firebase Admin] Initializing via individual env vars');
      return initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } catch (e) {
      console.error('[Firebase Admin] Individual vars init failed:', e);
    }
  }

  console.error('[Firebase Admin] No valid credentials found. Set FIREBASE_SERVICE_ACCOUNT_BASE64');
  return null;
}

app = initAdmin();

export const adminDb   = app ? getFirestore(app) : null;
export const adminAuth = app ? getAuth(app)      : null;
export default app;
