// components/results/AnalysisInsights.tsx
'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Clock, Info } from 'lucide-react';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisInsightsProps {
  data: AnalysisResult;
}

export function AnalysisInsights({ data }: AnalysisInsightsProps) {
  const gaps = data.skill_gaps || [];
  const highPriority = gaps.filter(s => (s.priority || 3) <= 2).length;
  const totalWeeks  = gaps.reduce((sum, s) => sum + (s.weeks_to_learn || 1), 0);
  
  return (
    <div className="p-8 rounded-3xl border border-hairline bg-surface-card shadow-sm relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center gap-2 mb-8">
        <Info size={16} className="text-muted" />
        <h3 className="font-display text-title-sm text-ink tracking-tight uppercase tracking-widest">
          Analysis Insights
        </h3>
      </div>

      <div className="space-y-8">
        {/* Main Score */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-muted">Initial Match</span>
            <span className="font-mono text-title-sm text-ink font-bold">{data.gap_score}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-strong overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.gap_score}%` }}
              className="h-full bg-ink rounded-full"
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Priority Gaps */}
          <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
            <div className="flex items-center gap-2 mb-2 text-brand-pink">
              <Zap size={14} className="fill-current" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Critical</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-title-lg text-ink">{highPriority}</span>
              <span className="font-sans text-body-xs text-muted">skills</span>
            </div>
          </div>

          {/* Total Weeks */}
          <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
            <div className="flex items-center gap-2 mb-2 text-brand-teal">
              <Clock size={14} />
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Effort</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-title-lg text-ink">{totalWeeks}</span>
              <span className="font-sans text-body-xs text-muted">weeks</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-hairline">
          <p className="font-sans text-body-sm text-muted leading-relaxed italic">
            "Focus on high-priority gaps first to reach the 80% application readiness threshold faster."
          </p>
        </div>
      </div>
    </div>
  );
}
