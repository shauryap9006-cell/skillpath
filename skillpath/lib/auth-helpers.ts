import { NextRequest } from "next/server";
import { adminAuth } from "./firebase-admin";

export async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split("Bearer ")[1];
  if (!token) return null;

  try {
    if (!adminAuth) {
      console.warn("[Auth Helper] Firebase Admin Auth not initialized");
      return null;
    }
    
    const decoded = await adminAuth.verifyIdToken(token);
    return { 
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'User')
    };
  } catch (error) {
    console.error("[Auth Helper] Firebase token verification failed:", error);
    return null;
  }
}
