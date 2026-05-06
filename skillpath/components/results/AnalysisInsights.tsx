// components/results/AnalysisInsights.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Clock, Info, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisInsightsProps {
  data: AnalysisResult;
  /** Override the readiness score (e.g. after confidence reweighting) */
  adjustedScore?: number;
  /** Override the total weeks estimate */
  adjustedWeeks?: number;
  /** Override critical gap count */
  adjustedCriticalCount?: number;
  /** Number of skills marked as "Strong" / mastered */
  masteredCount?: number;
}

export function AnalysisInsights({
  data,
  adjustedScore,
  adjustedWeeks,
  adjustedCriticalCount,
  masteredCount = 0,
}: AnalysisInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const gaps = data.skill_gaps || [];
  const rawHighPriority = gaps.filter(s => (s.priority || 3) <= 2).length;
  const rawTotalWeeks = gaps.reduce((sum, s) => sum + (s.weeks_to_learn || 1), 0);

  const displayScore = adjustedScore ?? data.gap_score;
  const displayWeeks = adjustedWeeks ?? rawTotalWeeks;
  const displayCritical = adjustedCriticalCount ?? rawHighPriority;

  const isAdjusted = adjustedScore !== undefined && adjustedScore !== data.gap_score;

  return (
    <div className="p-8 rounded-3xl border border-hairline bg-surface-card shadow-sm relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className={`flex items-center justify-between relative z-20 ${isExpanded ? 'mb-8' : ''}`}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2 group/info relative shrink-0">
            <Info size={16} className="text-muted cursor-help" />
            <h3 className="font-display text-[11px] text-ink font-bold uppercase tracking-widest">
              Analysis Insights
            </h3>
            {/* Tooltip */}
            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-ink text-on-primary text-[10px] rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl font-sans leading-tight">
              Comprehensive breakdown of your readiness based on MVC skill frequency and salary ROI.
            </div>
          </div>

          {/* Minimized Progress Bar */}
          {!isExpanded && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex items-center gap-3 max-w-[160px]"
            >
              <div className="h-1 flex-1 rounded-full bg-surface-strong overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isAdjusted ? 'bg-brand-teal' : 'bg-ink'}`}
                  style={{ width: `${displayScore}%` }}
                />
              </div>
              <span className="font-mono text-[10px] font-bold text-ink shrink-0">{displayScore}%</span>
            </motion.div>
          )}
        </div>
        
        <button
          onClick={() => {
            console.log('AnalysisInsights Toggle:', !isExpanded);
            setIsExpanded(!isExpanded);
          }}
          className="p-2 rounded-lg hover:bg-surface-soft transition-colors text-muted hover:text-ink cursor-pointer flex items-center justify-center relative z-30"
          title={isExpanded ? "Minimize" : "Expand"}
          type="button"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="analysis-insights-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-8">
              {/* Main Score */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-muted">
                    {isAdjusted ? 'Adjusted Readiness' : 'Initial Match'}
                  </span>
                  <span className="font-mono text-title-sm text-ink font-bold">{displayScore}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-strong overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${displayScore}%` }}
                    className={`h-full rounded-full ${isAdjusted ? 'bg-brand-teal' : 'bg-ink'}`}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
                  />
                </div>
                {isAdjusted && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <TrendingUp size={11} className="text-brand-teal" />
                    <span className="font-sans text-[10px] text-brand-teal font-bold uppercase tracking-widest">
                      +{displayScore - data.gap_score}% from self-assessment
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Priority Gaps */}
                <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
                  <div className="flex items-center gap-2 mb-2 text-brand-pink">
                    <Zap size={14} className="fill-current" />
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Critical</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-title-lg text-ink">{displayCritical}</span>
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
                    <span className="font-display text-title-lg text-ink">{displayWeeks}</span>
                    <span className="font-sans text-body-xs text-muted">weeks</span>
                  </div>
                </div>
              </div>

              {/* Mastered Skills Badge */}
              {masteredCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-teal/5 border border-brand-teal/15">
                  <Target size={14} className="text-brand-teal shrink-0" />
                  <span className="font-sans text-body-sm text-brand-teal font-semibold">
                    {masteredCount} skill{masteredCount > 1 ? 's' : ''} marked as strong — removed from plan
                  </span>
                </div>
              )}

              <div className="pt-6 border-t border-hairline">
                <p className="font-sans text-body-sm text-ink leading-relaxed italic">
                  "{data.summary || "Focus on high-priority gaps first to reach the 80% application readiness threshold faster."}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
