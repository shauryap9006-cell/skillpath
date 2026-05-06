// components/ActiveJobCard.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, ChevronDown, Sparkles, Trophy, X } from 'lucide-react';
import { ReadinessRing } from '../results/ReadinessRing';
import { SkillTrackRow } from '../results/SkillTrackRow';
import { computeReadiness } from '@/lib/readiness';
import type { ActiveJob, SkillState, TrackedSkill } from '@/types/active-job';
import Link from 'next/link';
import { incrementDailyTick } from './DailyGoalWidget';
import { useAuth } from '@/context/AuthContext';


interface ActiveJobCardProps {
  job: ActiveJob;
  onJobUpdate: (job: ActiveJob) => void;
  onUnpin: () => void;
}

export function ActiveJobCard({ job, onJobUpdate, onUnpin }: ActiveJobCardProps) {
  const { getToken } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [nextSkill, setNextSkill] = useState<TrackedSkill | null>(null);
  const [showResources, setShowResources] = useState(false);

  const handleStateChange = useCallback(async (skill: string, state: SkillState) => {
    const token = await getToken();
    if (!token) {
      console.error('[SkillTrack] No auth token found');
      return;
    }

    // 1. Optimistic Update (Instant feedback)
    const optimisticSkills = job.skills.map(s => {
      if (s.skill !== skill) return s;
      return { ...s, state, learned_at: state === 'learned' ? new Date().toISOString() : s.learned_at };
    });
    const optimisticScore = computeReadiness(optimisticSkills);
    onJobUpdate({ ...job, skills: optimisticSkills, readiness_score: optimisticScore });

    try {
      const res = await fetch('/api/active-job', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skill, state }),
      });

      if (!res.ok) {
        const rawBody = await res.text().catch(() => 'Could not read response body');
        console.error('[SkillTrack] SERVER ERROR BODY:', rawBody);
        let errData: any = {};
        try { errData = JSON.parse(rawBody); } catch (e) { }
        console.error('[SkillTrack] Update failed:', res.status, errData);
        onJobUpdate(job); // Rollback
        return;
      }

      const data = await res.json();
      console.log('[SkillTrack] Server returned:', {
        score: data.readiness_score,
        skills: data.skills?.map((s: TrackedSkill) => `${s.skill}:${s.state}`),
      });

      // Confirm with server data
      onJobUpdate({
        ...job,
        skills: data.skills,
        readiness_score: data.readiness_score
      });

      if (state === 'learned' && data.next_skill) {
        setNextSkill(data.next_skill);
        setShowResources(true);
      }

      // 4. Update Profile Systems (Streak, Timeline, Daily Goal)
      incrementDailyTick();
      Promise.all([
        fetch('/api/profile/streak', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/profile/timeline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            skill,
            state,
            job_title: job.job_title,
            job_color: job.color,
            timestamp: new Date().toISOString(),
          }),
        }),
      ]).catch(e => console.warn('[Profile Sync Error]', e));
    } catch (err) {
      console.error('[SkillTrack] Network error:', err);
      onJobUpdate(job); // Rollback
    }
  }, [job, onJobUpdate]);

  const handleUnpin = async () => {
    const token = await getToken();
    await fetch('/api/active-job/archive', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    onUnpin();
  };

  const learned = job.skills.filter(s => s.state === 'learned').length;
  const total = job.skills.length;
  const isComplete = job.readiness_score >= 80;

  return (
    <div
      className="rounded-xl border border-hairline bg-surface-card overflow-hidden transition-all"
      style={{ boxShadow: `0 0 0 1px ${job.color}22, 0 4px 24px ${job.color}18` }}
    >
      <div className="h-1 w-full" style={{ background: job.color }} />

      <div className="px-6 pt-5 pb-4 flex items-start gap-5">
        <ReadinessRing score={job.readiness_score} color={job.color} size={88} />

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <Bookmark size={12} style={{ color: job.color }} className="shrink-0" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-muted">
              Active Target
            </span>
          </div>
          <h3 className="font-display text-title-md text-ink tracking-tight leading-tight truncate">
            {job.job_title}
          </h3>
          <p className="font-sans text-body-sm text-muted mt-0.5">
            {job.seniority} · {job.company_type}
          </p>

          {/* Progress Bar with key-triggered re-render */}
          <div className="flex items-center gap-3 mt-3">
            <div className="h-1.5 flex-1 rounded-full bg-surface-strong overflow-hidden">
              <motion.div
                key={job.readiness_score}
                className="h-full rounded-full"
                style={{ background: job.color }}
                initial={{ width: `${Math.max(0, job.readiness_score - 15)}%` }}
                animate={{ width: `${job.readiness_score}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
              />
            </div>
            <span className="font-mono text-[11px] text-muted font-bold shrink-0">
              {learned}/{total} skills
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 shrink-0">
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-2 rounded-md hover:bg-surface-soft transition-colors text-muted hover:text-ink"
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown size={15} />
            </motion.div>
          </button>
          <button
            onClick={handleUnpin}
            className="p-2 rounded-md hover:bg-brand-pink/10 transition-colors text-muted hover:text-brand-pink"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-6 mb-4 px-4 py-3 rounded-lg bg-brand-teal/10 border border-brand-teal/20 flex items-center gap-3"
          >
            <Trophy size={16} className="text-brand-teal shrink-0" />
            <p className="font-sans text-body-sm text-brand-teal font-semibold">
              You're ready to apply — readiness is above 80%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-muted">
                  Skill Gaps
                </span>
              </div>

              {job.skills
                .slice()
                .sort((a, b) => {
                  if (a.state === 'learned' && b.state !== 'learned') return 1;
                  if (b.state === 'learned' && a.state !== 'learned') return -1;
                  return (a.priority || 3) - (b.priority || 3);
                })
                .map(skill => (
                  <SkillTrackRow
                    key={skill.skill}
                    skill={skill}
                    accentColor={job.color}
                    onStateChange={handleStateChange}
                  />
                ))
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResources && nextSkill && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-hairline mx-6 mb-6 pt-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-primary" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary">
                  Up Next
                </span>
              </div>
              <button onClick={() => setShowResources(false)} className="text-muted hover:text-ink">
                <X size={13} />
              </button>
            </div>
            <p className="font-sans text-body-sm text-muted mb-3">
              Start learning <strong className="text-ink">{nextSkill.skill}</strong> — your next highest priority gap.
            </p>
            <Link
              href={`/results/${job.analysis_id}?skill=${encodeURIComponent(nextSkill.skill)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-on-primary font-sans font-semibold text-button hover:bg-primary-active transition-colors"
            >
              <Sparkles size={13} />
              Generate Resources
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
