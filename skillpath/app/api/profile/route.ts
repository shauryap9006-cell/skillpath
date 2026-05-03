// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { getAuthUser } from '@/lib/auth-helpers';
import { nameToColor } from '@/lib/profile-utils';
import type { UserProfile } from '@/types/profile';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !adminDb) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const nameHint = searchParams.get('name') || user.name || 'Skill Explorer';
  const emailHint = searchParams.get('email') || user.email || '';

  try {
    const ref = adminDb.collection('profiles').doc(user.uid);
    const snap = await ref.get();

    if (snap.exists) {
      const data = snap.data() as UserProfile;
      // If the stored email is missing or looks like a UID, update it with the hint
      if (emailHint && (!data.email || !data.email.includes('@'))) {
        await ref.update({ email: emailHint });
        data.email = emailHint;
      }
      return NextResponse.json({ profile: data });
    }

    // First visit — bootstrap profile
    let name = nameHint;
    let email = emailHint;

    if (adminAuth && !email) {
      try {
        const authUser = await adminAuth.getUser(user.uid);
        name = authUser.displayName || authUser.email?.split('@')[0] || name;
        email = authUser.email ?? email;
      } catch (e) {
        console.warn('[Profile GET] Could not find user in Firebase Auth, using fallback info.');
      }
    }

    const profile: UserProfile = {
      uid: user.uid,
      display_name: name,
      email: email,
      avatar_color: nameToColor(name),
      streak_count: 0,
      streak_last_date: '',
      total_skills_learned: 0,
      created_at: new Date().toISOString(),
    };

    await ref.set(profile);
    return NextResponse.json({ profile });
  } catch (e) {
    console.error('[Profile GET]', e);
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || !adminDb) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { display_name?: string; target_role?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  try {
    const update: Partial<UserProfile> = {};
    if (body.display_name?.trim()) {
      update.display_name = body.display_name.trim().slice(0, 60);
      update.avatar_color = nameToColor(update.display_name);
    }
    if (body.target_role !== undefined) {
      update.target_role = body.target_role.trim().slice(0, 80);
    }

    await adminDb.collection('profiles').doc(user.uid).update(update);
    return NextResponse.json({ updated: true });
  } catch (e) {
    console.error('[Profile PATCH]', e);
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }
}
