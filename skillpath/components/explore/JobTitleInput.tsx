'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function JobTitleInput() {
  const [jobTitle, setJobTitle] = useState('');
  const [isExploring, setIsExploring] = useState(false);
  const router = useRouter();

  const handleExplore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || isExploring) return;

    setIsExploring(true);
    try {
      const res = await fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_title: jobTitle }),
      });

      const data = await res.json();
      if (res.ok && data.share_token) {
        router.push(`/explore/${data.share_token}`);
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
        setIsExploring(false);
      }
    } catch (err) {
      console.error('Explore error:', err);
      alert('Failed to connect to the server.');
      setIsExploring(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-teal/10 border border-brand-teal/20 text-[11px] text-brand-teal font-bold tracking-widest uppercase mb-6">
          <Sparkles size={12} className="fill-current" />
          AI Exploration Engine
        </span>
        <h1 className="font-display text-display-lg text-ink mb-6 text-center">
          What's your <br />
          <span className="text-primary italic font-serif">dream job?</span>
        </h1>
        <p className="font-sans text-[20px] text-muted max-w-xl mx-auto leading-relaxed">
          Enter a role, and we'll map out the exact skills, projects, and path to get you there.
        </p>
      </motion.div>

      <form onSubmit={handleExplore} className="relative max-w-3xl mx-auto">
        <div className="bg-surface-strong p-3 rounded-xl border border-hairline shadow-sm flex flex-col md:flex-row gap-3 mb-10 tactile-card">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Data Analyst, Lead Product Manager..."
            className="flex-1 bg-canvas py-6 px-8 text-lg md:text-xl font-sans text-ink border border-ink/15 rounded-lg focus:border-ink/40 focus:outline-none transition-all placeholder:text-ink/40 tactile-input"
            disabled={isExploring}
            autoFocus
          />
          <button
            type="submit"
            disabled={!jobTitle.trim() || isExploring}
            className={`flex items-center justify-center gap-3 px-10 py-6 md:py-0 bg-primary dark:bg-brand-pink text-on-primary dark:text-white rounded-lg font-sans font-semibold text-button transition-all hover:bg-primary-active dark:hover:opacity-90 active:scale-[0.98] tactile-button ${isExploring ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isExploring ? 'MAPPING...' : 'START EXPLORATION'}
            <ArrowRight size={18} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="flex items-center gap-6 text-[10px] text-muted font-bold uppercase tracking-[0.2em]">
            <span>NO RESUME REQUIRED</span>
            <span className="w-1 h-1 rounded-full bg-hairline" />
            <span>AI POWERED ANALYSIS</span>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
