// app/api/profile/timeline/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getAuthUser } from '@/lib/auth-helpers';
import type { TimelineEntry } from '@/types/profile';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !adminDb) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const snap = await adminDb
      .collection('skill_timeline')
      .doc(user.uid)
      .collection('entries')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const entries = snap.docs.map(d => d.data() as TimelineEntry);
    return NextResponse.json({ entries });
  } catch (e) {
    console.error('[Timeline GET]', e);
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !adminDb) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: Omit<TimelineEntry, 'id'>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  try {
    const id  = `entry_${Date.now()}`;
    const entry: TimelineEntry = { ...body, id };
    await adminDb
      .collection('skill_timeline')
      .doc(user.uid)
      .collection('entries')
      .doc(id)
      .set(entry);
    return NextResponse.json({ entry });
  } catch (e) {
    console.error('[Timeline POST]', e);
    return NextResponse.json({ error: 'write_failed' }, { status: 500 });
  }
}
