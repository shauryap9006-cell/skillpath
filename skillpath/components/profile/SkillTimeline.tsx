// components/profile/SkillTimeline.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Zap, Minus, Plus } from 'lucide-react';
import type { TimelineEntry } from '@/types/profile';
import { useAuth } from '@/context/AuthContext';

function groupByMonth(entries: TimelineEntry[]) {
  const map = new Map<string, TimelineEntry[]>();
  entries.forEach(e => {
    const month = new Date(e.timestamp).toLocaleDateString('en-GB', {
      month: 'long', year: 'numeric',
    });
    if (!map.has(month)) map.set(month, []);
    map.get(month)!.push(e);
  });
  return map;
}

export function SkillTimeline() {
  const { getToken } = useAuth();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      fetch('/api/profile/timeline', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(d => {
          const sorted = (d.entries ?? []).sort((a: TimelineEntry, b: TimelineEntry) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setEntries(sorted);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    })();
  }, []);

  const grouped = groupByMonth(entries);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 rounded-2xl bg-surface-soft border border-hairline animate-pulse" />
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="px-8 py-12 rounded-[32px] border border-dashed border-hairline text-center bg-surface-soft/20">
        <div className="w-12 h-12 rounded-full bg-surface-soft border border-hairline flex items-center justify-center mx-auto mb-4 text-muted">
          <Clock size={20} />
        </div>
        <p className="font-display text-title-sm text-ink mb-1">Growth Log Empty</p>
        <p className="font-sans text-body-sm text-muted max-w-[240px] mx-auto">
          Start mastering skills to build your professional learning timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-hairline rounded-[32px] overflow-hidden shadow-sm">
      {/* Log Header */}
      <div className="p-8 pb-6 flex items-center justify-between border-b border-hairline/30 bg-surface-soft/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-ink flex items-center justify-center text-on-primary">
            <Clock size={18} />
          </div>
          <div>
            <h2 className="font-display text-title-md text-ink">Chronological Log</h2>
            <p className="font-sans text-body-sm text-muted">A history of your professional growth</p>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2.5 rounded-xl border border-hairline text-muted hover:text-ink hover:bg-surface-soft transition-all"
        >
          {isCollapsed ? (
            <div className="flex items-center gap-2 px-1">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Expand</span>
              <Plus size={14} />
            </div>
          ) : (
            <div className="flex items-center gap-2 px-1">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Collapse</span>
              <Minus size={14} />
            </div>
          )}
        </button>
      </div>

      {/* Peek View (Visible when collapsed) */}
      <AnimatePresence mode="wait">
        {isCollapsed && entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-8 pt-2 pb-8 flex flex-col gap-2"
          >
            {entries.slice(0, 2).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-hairline bg-surface-soft/20 group hover:bg-surface-soft/40 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                  style={{ background: entry.state === 'learned' ? entry.job_color : 'var(--color-primary)' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-body-sm font-bold text-ink truncate">
                      {entry.skill}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-muted/60 uppercase tracking-wider shrink-0">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="font-sans text-[10px] text-muted/50 font-medium truncate uppercase tracking-widest mt-0.5">
                    {entry.job_title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
          >
            <div className="p-8">
              {entries.length === 0 ? (
                <div className="py-12 text-center bg-surface-soft/20 rounded-[24px] border border-dashed border-hairline">
                  <p className="font-sans text-body-sm text-muted">No growth logged yet.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {Array.from(grouped.entries()).map(([month, monthEntries], mi) => (
                    <div key={month}>
                      <div className="flex items-center gap-4 mb-6">
                        <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-muted whitespace-nowrap">
                          {month}
                        </h4>
                        <div className="h-px w-full bg-hairline" />
                      </div>

                      <div className="relative">
                        <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-hairline via-hairline to-transparent" />

                        <div className="space-y-4 pl-10">
                          {monthEntries.map((entry, i) => (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.6 }}
                              className="relative group"
                            >
                              <div
                                className="absolute -left-[35px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-[3px] border-canvas shadow-sm z-10"
                                style={{
                                  background: entry.state === 'learned' ? entry.job_color : 'var(--color-primary)',
                                }}
                              />

                              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-hairline bg-surface-card hover:bg-surface-soft transition-all shadow-sm group-hover:shadow-md transition-all">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-sans text-body-md font-bold text-ink truncate">
                                      {entry.skill}
                                    </span>
                                    {entry.state === 'learned' ? (
                                      <CheckCircle2 size={12} className="text-brand-teal" />
                                    ) : (
                                      <Zap size={12} className="text-primary" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-sans text-[10px] text-muted/60 font-medium lowercase">in</span>
                                    <span className="font-sans text-[10px] font-bold text-ink/40 uppercase tracking-widest truncate">
                                      {entry.job_title}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end shrink-0 gap-1">
                                  <span
                                    className="font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border border-hairline bg-surface-soft"
                                    style={{
                                      color: entry.state === 'learned' ? entry.job_color : 'inherit',
                                    }}
                                  >
                                    {entry.state === 'learned' ? 'Mastered' : 'Active'}
                                  </span>
                                  <span className="font-mono text-[10px] text-muted/40 font-bold">
                                    {new Date(entry.timestamp).toLocaleDateString('en-US', {
                                      day: 'numeric', month: 'short',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
