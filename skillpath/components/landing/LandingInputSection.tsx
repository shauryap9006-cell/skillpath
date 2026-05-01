'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function LandingInputSection() {
  const [jd, setJd] = useState('');
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const handleStart = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (jd.trim()) {
      sessionStorage.setItem('pending_jd', jd);
      router.push('/analyze');
    }
  };

  return (
    <section id="analyze" className="bg-canvas py-section px-8 flex justify-center border-t border-hairline">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
      >
        <div className="lg:col-span-5 pt-8">
            <h2 className="font-display text-[56px] text-ink mb-6 tracking-tight leading-[1.05] drop-shadow-sm">
                Ready to bridge the gap?
            </h2>
            <p className="font-sans text-[20px] text-muted leading-relaxed max-w-md">
                Paste the job description you're targeting. We'll identify the exact skills you're missing and build your roadmap.
            </p>
        </div>
        
        <div className="lg:col-span-7 p-md rounded-xl bg-surface-strong border border-hairline shadow-sm tactile-card">
            <div className="bg-canvas rounded-lg overflow-hidden flex flex-col min-h-[400px] border border-ink/10 transition-all focus-within:border-ink/30 tactile-input">
                <textarea 
                  placeholder="Paste Job Description here..."
                  className="flex-1 p-lg font-sans text-body-md text-ink placeholder:text-muted bg-transparent focus:outline-none resize-none"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
                <div className="p-lg border-t border-hairline flex justify-end bg-surface-soft/50">
                  <button 
                    onClick={handleStart}
                    disabled={!jd.trim()}
                    className="bg-primary text-on-primary font-sans font-semibold text-button px-xl py-[12px] h-[44px] rounded-md hover:bg-primary-active transition-all active:scale-[0.98] disabled:bg-muted/10 disabled:text-muted disabled:cursor-not-allowed uppercase tracking-widest text-[11px] tactile-button"
                  >
                    Generate Roadmap →
                  </button>
                </div>
            </div>
        </div>
      </motion.div>
    </section>
  );
}
