'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import { useTheme } from 'next-themes';
import NeuralBackground from '@/components/ui/flow-field-background';

export function LandingInputSection() {
  const [jd, setJd] = useState('');
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const particleColor = isDark ? '#6366f1' : '#ff4d8b';
  const trailColor = isDark ? '0, 0, 0' : '255, 250, 240';



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
    <section id="analyze" className="relative bg-canvas py-section px-8 flex justify-center border-t border-hairline overflow-hidden">
      {/* Background Shader */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <NeuralBackground 
          color={particleColor}
          trailColor={trailColor}
          trailOpacity={0.1}
          particleCount={1500}
          speed={0.4}

        />
      </div>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10"
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
            <div className="bg-canvas rounded-lg overflow-hidden flex flex-col min-h-[400px] border border-ink/10 focus-within:border-ink/20 focus-within:ring-1 focus-within:ring-ink/5 transition-all tactile-input">
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
