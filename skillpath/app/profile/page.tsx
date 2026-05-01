'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Mail, LogOut, ArrowLeft, ShieldCheck, Target, History, TrendingUp, ChevronRight, Briefcase, Sparkles } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const targetRole = {
    title: "Senior Machine Learning Engineer",
    company: "Google",
    matchScore: 68,
  };

  const savedVectors = [
    { id: 1, date: "Oct 24, 2026", role: "AI Engineer", company: "Anthropic", score: 82 },
    { id: 2, date: "Sep 12, 2026", role: "Data Scientist", company: "Meta", score: 65 },
    { id: 3, date: "Aug 05, 2026", role: "Software Engineer, ML", company: "Stripe", score: 45 },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-canvas text-ink selection:bg-primary/10 overflow-hidden relative font-sans">
      <div className="max-w-2xl mx-auto px-6 py-24 relative z-10">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-muted hover:text-ink transition-colors mb-16 group font-semibold text-button uppercase tracking-widest text-[11px]"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-brand-teal uppercase tracking-[0.2em] text-[10px] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Candidate</span>
            </div>
            <h1 className="text-title-xl font-display text-ink tracking-tight">
              Hello, <span className="text-muted">{user.name.split(' ')[0]}</span>.
            </h1>
          </div>

          {/* TARGET ROLE TRACKER */}
          <div className="bg-canvas border border-hairline rounded-lg p-10 relative overflow-hidden group shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10 mb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary uppercase tracking-[0.2em] text-[10px] font-bold">
                  <Target className="w-4 h-4" />
                  <span>Current Target Vector</span>
                </div>
                <h2 className="text-title-lg text-ink font-display">{targetRole.title}</h2>
                <div className="flex items-center gap-2 text-muted font-medium text-body-md">
                  <Briefcase className="w-4 h-4" />
                  <span>{targetRole.company}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-title-xl font-display text-ink leading-none mb-2">
                  {targetRole.matchScore}<span className="text-title-md text-muted">%</span>
                </div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Match Strength</span>
              </div>
            </div>

            <ProgressBar progress={targetRole.matchScore} barClassName="bg-primary" />
            
            <div className="mt-8 flex items-center gap-2 text-[11px] text-muted font-bold uppercase tracking-widest">
              <Sparkles size={12} className="text-brand-teal fill-current" />
              <span>{100 - targetRole.matchScore}% skill gap remaining for optimized placement</span>
            </div>
          </div>

          {/* SAVED CAREER VECTORS (HISTORY) */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-muted uppercase tracking-widest text-[10px] font-bold">
              <History className="w-4 h-4" />
              <span>Career Trajectory Logs</span>
            </div>

            <div className="grid gap-4">
              {savedVectors.map((vector, idx) => (
                <motion.div
                  key={vector.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-surface-soft border border-hairline hover:border-muted/30 p-6 rounded-md flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-sm bg-canvas border border-hairline flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                      <TrendingUp className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-sans text-body-lg font-bold text-ink group-hover:text-primary transition-colors">{vector.role}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-muted font-bold uppercase tracking-widest mt-1">
                        <span>{vector.company}</span>
                        <span className="w-1 h-1 rounded-full bg-hairline" />
                        <span>{vector.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                      <span className="text-title-sm font-display text-ink">{vector.score}%</span>
                      <span className="text-[9px] uppercase tracking-widest text-muted font-bold">Match</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted group-hover:text-ink transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="bg-surface-soft border border-hairline rounded-lg p-10">
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-md bg-canvas border border-hairline flex items-center justify-center">
                    <User className="w-6 h-6 text-muted" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Identity</p>
                    <p className="text-title-sm text-ink font-display">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-md bg-canvas border border-hairline flex items-center justify-center">
                    <Mail className="w-6 h-6 text-muted" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Electronic Mail</p>
                    <p className="text-title-sm text-ink font-display">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-ink text-on-primary font-sans font-bold text-button py-6 rounded-md flex items-center justify-center gap-3 hover:bg-ink/90 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5" />
              <span>TERMINATE SESSION</span>
            </button>
          </div>

          <p className="text-center text-muted text-[10px] font-bold uppercase tracking-[0.3em]">
            Secure Access · SkillPath Enterprise v3.0
          </p>
        </motion.div>
      </div>
    </main>
  );
}
