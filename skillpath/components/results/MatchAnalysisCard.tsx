// components/MatchAnalysisCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Clock, BarChart3 } from 'lucide-react';
import type { ActiveJob } from '@/types/active-job';

interface MatchAnalysisCardProps {
  job: ActiveJob;
}

export function MatchAnalysisCard({ job }: MatchAnalysisCardProps) {
  const highPriority = job.skills.filter(s => (s.priority || 3) <= 2).length;
  const mvcSkills = job.skills.filter(s => s.in_mvc).length;
  const totalWeeks = job.skills.reduce((sum, s) => sum + (s.weeks_to_learn || 1), 0);

  // Static match score from the job metadata if available, otherwise estimate from initial count
  const initialMatch = job.skills.length > 0 ? Math.round(100 - (job.skills.length * 5)) : 85;

  return (
    <div className="rounded-xl border border-hairline bg-surface-card overflow-hidden transition-all shadow-sm">
      <div className="px-6 py-5 border-b border-hairline bg-surface-soft/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-muted" />
          <h3 className="font-display text-title-sm text-ink tracking-tight">Match Analysis</h3>
        </div>
        <span className="font-mono text-[10px] text-muted font-bold uppercase tracking-widest">
          Original Stats
        </span>
      </div>

      <div className="p-6 grid grid-cols-2 gap-6">
        {/* Match Score */}
        <div className="col-span-2 p-4 rounded-lg bg-ink text-on-primary flex items-center justify-between">
          <div>
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60">Initial Resume Match</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-display text-display-sm leading-none">{initialMatch}%</span>
              <span className="font-sans text-body-sm opacity-60">fit</span>
            </div>
          </div>
          <Target size={32} className="opacity-20" />
        </div>

        {/* High Priority */}
        <div className="p-4 rounded-lg border border-hairline bg-surface-soft/50">
          <div className="flex items-center gap-2 mb-2 text-brand-pink">
            <Zap size={14} className="fill-current" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Critical Gaps</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-title-lg text-ink">{highPriority}</span>
            <span className="font-sans text-body-xs text-muted">skills</span>
          </div>
          <p className="font-sans text-[10px] text-muted mt-2 leading-snug">
            Priority 1 & 2 gaps that block your application.
          </p>
        </div>

        {/* MVC & Weeks */}
        <div className="p-4 rounded-lg border border-hairline bg-surface-soft/50">
          <div className="flex items-center gap-2 mb-2 text-brand-teal">
            <Clock size={14} />
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Total Effort</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-title-lg text-ink">{totalWeeks}</span>
            <span className="font-sans text-body-xs text-muted">weeks</span>
          </div>
          <p className="font-sans text-[10px] text-muted mt-2 leading-snug">
            Estimated time to close all {job.skills.length} gaps.
          </p>
        </div>
      </div>
    </div>
  );
}
