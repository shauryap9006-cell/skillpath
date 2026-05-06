// components/PinJobButton.tsx
'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import type { SkillGap } from '@/types/analysis';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface PinJobButtonProps {
  analysisId: string;
  jobTitle: string;
  role: string;
  seniority: string;
  companyType: string;
  skillGaps: SkillGap[];
  isPinned?: boolean;
}

export function PinJobButton({
  analysisId, jobTitle, role, seniority,
  companyType, skillGaps, isPinned = false,
}: PinJobButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>(
    isPinned ? 'done' : 'idle'
  );
  const router = useRouter();
  const { user, openAuthModal, getToken } = useAuth();

  const handlePin = async () => {
    if (status !== 'idle') return;

    if (!user) {
      openAuthModal();
      return;
    }

    setStatus('loading');

    try {
      const token = await getToken();
      const res = await fetch('/api/active-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          analysis_id: analysisId,
          job_title: jobTitle,
          role,
          seniority,
          company_type: companyType,
          skills: skillGaps.map(g => ({
            skill: g.skill,
            priority: g.priority,
            weeks_to_learn: g.weeks_to_learn,
            in_mvc: g.in_mvc ?? false,
            reason: g.reason,
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('[PinJob] Failed:', res.status, errorData);
        throw new Error(errorData.error || 'Pin failed');
      }
      setStatus('done');
      // Small delay so user sees the confirmation, then navigate
      setTimeout(() => router.push('/profile'), 800);
    } catch (err) {
      console.error("Pin error:", err);
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={handlePin}
      disabled={status !== 'idle'}
      className={[
        'group relative flex items-center gap-2.5 px-6 py-3 rounded-md font-sans font-semibold text-button transition-all duration-300 tactile-button overflow-hidden',
        status === 'idle' &&
        'border border-brand-lavender/30 bg-brand-lavender/5 hover:bg-brand-lavender/15 text-brand-lavender',
        status === 'loading' &&
        'border border-hairline bg-surface-soft text-muted cursor-wait',
        status === 'done' &&
        'border border-brand-teal/30 bg-brand-teal/10 text-brand-teal cursor-default',
      ].filter(Boolean).join(' ')}
    >
      {status === 'idle' && <><Bookmark size={15} />Track This Job</>}
      {status === 'loading' && <><Loader2 size={15} className="animate-spin" />Pinning...</>}
      {status === 'done' && <><BookmarkCheck size={15} />Pinned — Go to Profile</>}
    </button>
  );
}
