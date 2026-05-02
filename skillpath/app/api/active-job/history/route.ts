// app/api/active-job/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getAuthUser } from '@/lib/auth-helpers';
import type { ArchivedJob } from '@/types/active-job';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!adminDb) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 500 });
  }

  try {
    const snap = await adminDb
      .collection('job_history').doc(user.uid)
      .collection('jobs')
      .orderBy('archived_at', 'desc')
      .limit(10)
      .get();

    const history = snap.docs.map(d => d.data() as ArchivedJob);
    return NextResponse.json({ history });
  } catch (e) {
    console.error('[History GET]', e);
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
  }
}
