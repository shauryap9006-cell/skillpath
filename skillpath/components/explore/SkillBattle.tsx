'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Share2, TrendingUp, DollarSign, Users, Trophy, RotateCcw } from 'lucide-react';
import { conductSkillBattle, type BattleResult } from '@/lib/skill-battle';
import { Button } from '@/components/ui/Button';

export function SkillBattle() {
  const [skillA, setSkillA] = useState('React');
  const [skillB, setSkillB] = useState('Angular');
  const [result, setResult] = useState<BattleResult | null>(null);
  const [aiVerdict, setAiVerdict] = useState<string>('');
  const [isBattling, setIsBattling] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleBattle = async () => {
    if (!skillA || !skillB) return;
    setIsBattling(true);
    setAiVerdict('');
    
    // Simulate a high-fidelity "battle" calculation delay
    const battleResult = conductSkillBattle(skillA, skillB);
    
    setTimeout(async () => {
      setResult(battleResult);
      setIsBattling(false);
      setHasVoted(true);
      
      // Now fetch AI verdict
      setIsAiLoading(true);
      try {
        const response = await fetch('/api/battle/ai', {
          method: 'POST',
          body: JSON.stringify({
            optionA: battleResult.optionA,
            optionB: battleResult.optionB,
            winner: battleResult.winner,
            totalVotes: battleResult.totalVotes,
            trend: Math.round((battleResult.winner === 'A' ? battleResult.optionA.trend : battleResult.optionB.trend) * 100),
            premium: battleResult.winner === 'A' ? battleResult.optionA.premium : battleResult.optionB.premium
          }),
        });
        const data = await response.json();
        setAiVerdict(data.aiVerdict);
      } catch (e) {
        console.error(e);
      } finally {
        setIsAiLoading(false);
      }
    }, 1200);
  };

  const handleReset = () => {
    setHasVoted(false);
    setResult(null);
    setSkillA('');
    setSkillB('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-[10px] text-brand-pink font-bold tracking-widest uppercase mb-4">
          <Swords size={12} />
          Community Skill Battle
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">
          The Community Verdict.
        </h2>
        <p className="text-muted max-w-xl mx-auto">
          Ask a career question. See how 320k+ data points vote. Get the one-sentence truth.
        </p>
      </div>

      <div className="relative bg-[#EBE9DC] dark:bg-surface-card border border-hairline rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-teal opacity-50" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-teal/5 rounded-full blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-pink/5 rounded-full blur-[100px]" />

        <AnimatePresence mode="wait">
          {!hasVoted ? (
            <motion.div
              key="battle-setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <div className="flex-1 w-full space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block ml-2">Option A</label>
                  <input
                    type="text"
                    value={skillA}
                    onChange={(e) => setSkillA(e.target.value)}
                    placeholder="e.g. React"
                    className="w-full h-16 md:h-20 px-8 bg-canvas/50 border border-hairline rounded-2xl md:rounded-3xl font-display text-xl md:text-2xl text-ink placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all text-center md:text-left"
                  />
                </div>

                <div className="shrink-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-ink text-on-primary font-display text-lg md:text-xl flex items-center justify-center shadow-xl border-4 border-surface-card">
                    VS
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block ml-2">Option B</label>
                  <input
                    type="text"
                    value={skillB}
                    onChange={(e) => setSkillB(e.target.value)}
                    placeholder="e.g. Angular"
                    className="w-full h-16 md:h-20 px-8 bg-canvas/50 border border-hairline rounded-2xl md:rounded-3xl font-display text-xl md:text-2xl text-ink placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all text-center md:text-left"
                  />
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center">
                <button
                  disabled={!skillA || !skillB || isBattling}
                  onClick={handleBattle}
                  className="group relative h-16 px-12 bg-ink text-on-primary rounded-2xl font-display font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 overflow-hidden shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isBattling ? 'Calculating Votes...' : 'Start Skill Battle'}
                    {!isBattling && <Swords size={18} className="group-hover:rotate-12 transition-transform" />}
                  </span>
                  {isBattling && (
                    <motion.div
                      className="absolute inset-0 bg-brand-pink/20"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </button>
                <p className="mt-4 text-[10px] text-muted font-bold uppercase tracking-widest">
                  Analyzing 320k+ Market Samples...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="battle-result"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              {result && (
                <div className="space-y-12">
                  {/* Results visualization */}
                  <div className="flex flex-col md:flex-row items-stretch gap-4">
                    <div className="flex-1">
                      <div className={`h-full p-8 rounded-3xl border transition-all ${result.winner === 'A' ? 'bg-brand-pink/5 border-brand-pink/20 ring-1 ring-brand-pink/10' : 'bg-surface-soft border-hairline opacity-60'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-display text-2xl text-ink">{result.optionA.name}</span>
                          {result.winner === 'A' && <Trophy size={20} className="text-brand-pink" />}
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted">
                            <span>Market Adoption</span>
                            <span className="text-ink">{result.optionA.votes.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 w-full bg-ink/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-brand-pink"
                              initial={{ width: 0 }}
                              animate={{ width: `${(result.optionA.votes / result.totalVotes) * 100}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className={`h-full p-8 rounded-3xl border transition-all ${result.winner === 'B' ? 'bg-brand-teal/5 border-brand-teal/20 ring-1 ring-brand-teal/10' : 'bg-surface-soft border-hairline opacity-60'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-display text-2xl text-ink">{result.optionB.name}</span>
                          {result.winner === 'B' && <Trophy size={20} className="text-brand-teal" />}
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted">
                            <span>Market Adoption</span>
                            <span className="text-ink">{result.optionB.votes.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 w-full bg-ink/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-brand-teal"
                              initial={{ width: 0 }}
                              animate={{ width: `${(result.optionB.votes / result.totalVotes) * 100}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verdict Card */}
                  <div className="bg-ink text-on-primary p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Swords size={120} />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-primary/60">Community Truth</p>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl mb-8 leading-tight">
                        “{result.verdict}”
                      </h3>

                      {/* AI Spicy Verdict Section */}
                      <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="px-2 py-0.5 rounded bg-brand-teal/20 border border-brand-teal/30 text-[8px] font-bold uppercase tracking-widest text-brand-teal">Architect's Insight</div>
                        </div>
                        <div className="min-h-[3rem] flex items-center justify-center">
                          {isAiLoading ? (
                            <div className="flex gap-1">
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-on-primary/40" />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-on-primary/40" />
                              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-on-primary/40" />
                            </div>
                          ) : (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="font-sans text-lg italic text-on-primary/90"
                            >
                              {aiVerdict || "The AI is pondering the market implications..."}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10 grid grid-cols-3 gap-4 relative z-10">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-brand-teal mb-1">
                          <Users size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Votes</span>
                        </div>
                        <span className="font-mono text-lg">{result.totalVotes.toLocaleString()}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-brand-pink mb-1">
                          <TrendingUp size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Trend</span>
                        </div>
                        <span className="font-mono text-lg">+{Math.round((result.winner === 'A' ? result.optionA.trend : result.optionB.trend) * 100)}%</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-brand-lavender mb-1">
                          <DollarSign size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Premium</span>
                        </div>
                        <span className="font-mono text-lg">${((result.winner === 'A' ? result.optionA.premium : result.optionB.premium) / 1000).toFixed(1)}k</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                      <button className="h-12 px-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                        <Share2 size={14} />
                        Share Verdict
                      </button>
                      <button 
                        onClick={handleReset}
                        className="h-12 px-6 text-on-primary/60 hover:text-on-primary text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                      >
                        <RotateCcw size={14} />
                        New Battle
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-surface-soft border border-hairline rounded-[32px] text-center">
          <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-brand-teal/20">
            <Users size={18} className="text-brand-teal" />
          </div>
          <h4 className="font-display text-lg mb-2">Social Proof</h4>
          <p className="text-body-xs text-muted">Vetted by the collective experience of 320,000+ engineers worldwide.</p>
        </div>
        <div className="p-8 bg-surface-soft border border-hairline rounded-[32px] text-center">
          <div className="w-10 h-10 bg-brand-pink/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-brand-pink/20">
            <TrendingUp size={18} className="text-brand-pink" />
          </div>
          <h4 className="font-display text-lg mb-2">Momentum Engine</h4>
          <p className="text-body-xs text-muted">Analysis of 2024 growth rates ensures you are learning what’s next, not what’s last.</p>
        </div>
        <div className="p-8 bg-surface-soft border border-hairline rounded-[32px] text-center">
          <div className="w-10 h-10 bg-brand-lavender/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-brand-lavender/20">
            <DollarSign size={18} className="text-brand-lavender" />
          </div>
          <h4 className="font-display text-lg mb-2">ROI Verified</h4>
          <p className="text-body-xs text-muted">Every verdict calculates the real-world salary premium for each path.</p>
        </div>
      </div>
    </div>
  );
}
