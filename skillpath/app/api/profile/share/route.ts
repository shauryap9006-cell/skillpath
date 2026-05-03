// app/api/profile/share/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getAuthUser } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !adminDb) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const shareId = Buffer.from(user.uid).toString('base64url').slice(0, 16);
    await adminDb.collection('share_cards').doc(shareId).set({
      uid: user.uid,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const url = `${baseUrl}/share/${shareId}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error('[Share POST]', e);
    return NextResponse.json({ error: 'share_failed' }, { status: 500 });
  }
}
