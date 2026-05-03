// app/api/active-job/archive/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getAuthUser } from '@/lib/auth-helpers';
import type { ActiveJob } from '@/types/active-job';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!adminDb) {
    return NextResponse.json({ error: 'database_unavailable' }, { status: 500 });
  }

  try {
    const ref = adminDb.collection('active_jobs').doc(user.uid);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: 'no_active_job' }, { status: 404 });

    const job = doc.data() as ActiveJob;
    await adminDb
      .collection('job_history').doc(user.uid)
      .collection('jobs').doc(job.id)
      .set({
        ...job,
        archived_at: new Date().toISOString(),
        final_score: job.readiness_score
      });

    await ref.delete();
    return NextResponse.json({ archived: true });
  } catch (e) {
    console.error('[Archive POST]', e);
    return NextResponse.json({ error: 'archive_failed' }, { status: 500 });
  }
}
