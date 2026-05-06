'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NeuralSocialProof } from './NeuralSocialProof';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { ArrowRight, FileText, Sparkles, Lightbulb, X } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { Button } from '@/components/ui/Button';
import { GenerativeArtScene } from '@/components/ui/anomalous-matter-hero';

export function Hero() {
  const { loaded } = useUI();
  const { user, openAuthModal } = useAuth();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  // Subtle parallax for the SVG column
  const svgX = useTransform(springX, [-1, 1], [-8, 8]);
  const svgY = useTransform(springY, [-1, 1], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], [0, 300]);
  const bgSpringY = useSpring(bgY, { stiffness: 100, damping: 30 });

  const handleAction = () => {
    if (user) setIsAnalyzing(true);
    else openAuthModal();
  };

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const path = "M 150 450 Q 300 450, 400 300 T 650 150";

  // Stagger container — children inherit delay via index
  const stagger: any = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const fadeUp: any = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any } },
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative bg-transparent text-ink py-section px-8 lg:px-24 w-full flex justify-center min-h-[95vh] items-center overflow-hidden dot-grid"
    >
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-canvas via-transparent to-canvas pointer-events-none" />
      {/* ── Main grid ────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Left column */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="lg:col-span-5 flex flex-col items-start text-left gap-8"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline bg-surface-soft dark:bg-white/10 text-[11px] font-extrabold uppercase tracking-widest text-ink/80 dark:text-ink ml-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
              Career Intelligence
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp} style={{ willChange: 'transform, opacity' }}>
            <h1 className="font-display text-display-md lg:text-[72px] font-extrabold leading-[1.05] tracking-tighter text-ink">
              Go to market<br />
              <span className="text-muted">with precision.</span>
            </h1>
          </motion.div>

          {/* Body */}
          <motion.p
            variants={fadeUp}
            className="font-sans text-body-md lg:text-[18px] text-ink/70 max-w-md font-medium leading-relaxed"
            style={{ willChange: 'transform, opacity' }}
          >
            Analyze your current resume to uncover potential gaps and map your professional growth with deep learning insights.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} style={{ willChange: 'transform, opacity' }}>
            <button
              onClick={() => user ? router.push('/analyze') : openAuthModal()}
              className="group relative flex items-center gap-3 px-8 py-4 bg-ink text-on-primary rounded-full transition-all duration-300 hover:shadow-[0_24px_48px_rgba(0,0,0,0.18)] active:scale-95 overflow-hidden"
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 font-semibold text-[17px]">Analyze Resume</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeUp}>
            <NeuralSocialProof />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ x: svgX, y: svgY }}
          className="lg:col-span-7 relative h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-visible"
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          {/* Big Animated Glow - Optimized with Radial Gradient */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={loaded ? {
              opacity: [0.15, 0.35, 0.15],
              scale: [1, 1.15, 1]
            } : {}}
            transition={{
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              delay: 1.5
            }}
            className="absolute pointer-events-none w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--color-bulb-glow) 0%, transparent 70%)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              willChange: 'transform, opacity'
            }}
          />

          <svg viewBox="0 0 800 600" className="w-full h-full max-w-[400px] md:max-w-none relative z-10" style={{ overflow: 'visible' }}>
            <defs>
              {/* Path gradient */}
              <linearGradient id="ribbonGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-brand-pink)" stopOpacity="0.6" />
                <stop offset="50%" stopColor="var(--color-muted-soft)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-muted)" stopOpacity="0.15" />
              </linearGradient>
              {/* Glow filter for path */}
              <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Sphere gradients */}
              <radialGradient id="pinkSphere" cx="38%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#FFE4ED" />
                <stop offset="60%" stopColor="#FF4D8B" />
                <stop offset="100%" stopColor="#CC2266" />
              </radialGradient>
              <radialGradient id="yellowSphere" cx="38%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#FFFBF0" />
                <stop offset="60%" stopColor="#E8B94A" />
                <stop offset="100%" stopColor="#C49030" />
              </radialGradient>
              {/* Soft shadow for spheres */}
              <filter id="sphereShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* ── Track / shadow path ── drawn slightly offset for depth */}
            <motion.path
              d="M 152 453 Q 302 453, 402 303 T 652 153"
              fill="none"
              stroke="rgba(0,0,0,0.14)"
              strokeWidth="58"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1 }
              }}
              transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />

            {/* ── Path Edge Outline ── subtle definition */}
            <motion.path
              d={path}
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity="0.04"
              strokeWidth="53"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1 }
              }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />

            {/* ── Main ribbon path ── */}
            <motion.path
              d={path}
              fill="none"
              stroke="url(#ribbonGradient)"
              strokeWidth="52"
              strokeLinecap="round"
              filter="url(#pathGlow)"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1 }
              }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              style={{ willChange: 'pathLength, opacity' }}
            />

            {/* ── Gloss highlight on path ── */}
            <motion.path
              d={path}
              fill="none"
              stroke="white"
              strokeWidth="20"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 0.55, opacity: 0.55 }
              }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{ willChange: 'pathLength, opacity' }}
            />

            {/* ── Traveling dot on path ── subtle, shows motion */}
            <motion.circle
              r="5"
              fill="white"
              fillOpacity="0.9"
              filter="url(#sphereShadow)"
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: [0, 1, 1, 0] } : {}}
              transition={{ delay: 1.5, duration: 2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
            >
              <animateMotion
                dur="2s"
                begin={mounted && loaded ? "1.5s" : "indefinite"}
                repeatCount="indefinite"
                repeatDur="6s"
                path={path}
              />
            </motion.circle>

            {/* ── Node: Start (Pink) ── */}
            <motion.g
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1 }
              }}
              transition={{ delay: 1.0, type: 'spring', stiffness: 120, damping: 14 }}
              style={{ transformOrigin: '150px 450px', willChange: 'transform, opacity' }}
            >
              {/* Outer glow ring */}
              <motion.circle
                cx="150" cy="450" r="62"
                fill="none"
                stroke="#FF4D8B"
                strokeWidth="1"
                strokeOpacity="0.3"
                animate={{ r: [58, 68, 58], strokeOpacity: [0.3, 0.05, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx="150" cy="450" r="45" fill="url(#pinkSphere)" filter="url(#sphereShadow)" />
              {/* Specular highlight */}
              <ellipse cx="138" cy="436" rx="10" ry="6" fill="white" fillOpacity="0.4" />
              <FileText className="text-white" x="135" y="435" width="30" height="30" />
            </motion.g>

            {/* ── Node: Middle (Lavender) ── */}
            <motion.g
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1 }
              }}
              transition={{ delay: 1.3, type: 'spring', stiffness: 120, damping: 14 }}
              style={{ transformOrigin: '400px 300px', willChange: 'transform, opacity' }}
            >
              <motion.circle
                cx="400" cy="300" r="62"
                fill="none"
                stroke="var(--color-brand-lavender)"
                strokeWidth="1"
                strokeOpacity="0.3"
                animate={{ r: [58, 68, 58], strokeOpacity: [0.3, 0.05, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
              <circle
                cx="400" cy="300" r="45"
                fill="var(--color-brand-lavender)"
                fillOpacity="0.85"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
                filter="url(#sphereShadow)"
              />
              <ellipse cx="388" cy="286" rx="10" ry="6" fill="white" fillOpacity="0.35" />
              <Sparkles className="text-white" x="385" y="285" width="30" height="30" />
            </motion.g>

            {/* ── Node: End (Ochre / Goal) ── */}
            <motion.g
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1 }
              }}
              transition={{ delay: 1.6, type: 'spring', stiffness: 120, damping: 12 }}
              style={{ transformOrigin: '650px 150px', willChange: 'transform, opacity' }}
            >
              {/* Layered glow — inner bright, outer diffuse */}
              <motion.circle
                cx="650" cy="150" r="110"
                fill="var(--color-bulb-glow)"
                animate={{ r: [100, 130, 100], opacity: [0.4, 0.15, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'blur(30px)' }}
              />
              <motion.circle
                cx="650" cy="150" r="70"
                fill="var(--color-bulb-glow)"
                animate={{ r: [65, 80, 65], opacity: [0.7, 0.3, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                style={{ filter: 'blur(10px)' }}
              />
              <circle cx="650" cy="150" r="45" fill="url(#yellowSphere)" filter="url(#sphereShadow)" />
              <ellipse cx="638" cy="136" rx="11" ry="6.5" fill="white" fillOpacity="0.45" />
              <Lightbulb className="text-ink/80" x="635" y="135" width="30" height="30" />
            </motion.g>
          </svg>


          {/* ── Floating labels ── positioned relative to nodes ── */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { delay: 1.2, top: '78%', left: '18.75%', x: '-50%', label: 'Current State' },
              { delay: 1.5, top: '53%', left: '52%', x: '0', label: 'Learning Pipeline' },
              { delay: 1.8, top: '22%', right: '12%', x: '0', label: 'Optimized Outcome' },
            ].map(({ delay, top, left, right, x, label }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as any }}
                style={{ top, left, right, x }}
                className="absolute text-[10px] font-black uppercase tracking-[0.15em] text-ink whitespace-nowrap"
              >
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>



      {/* ── Analysis overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(var(--canvas-rgb, 255,255,255) / 0.85)' }}
          >
            {/* Subtle inner vignette on overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.04)_100%)] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
              className="relative w-full max-w-md mx-4 bg-surface-card rounded-2xl border border-hairline text-center"
              style={{
                boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.6) inset',
              }}
            >
              {/* Inner top specular */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-t-2xl" />

              <div className="p-10">
                <button
                  onClick={() => setIsAnalyzing(false)}
                  className="absolute top-5 right-5 p-2 hover:bg-surface-soft rounded-full transition-colors text-muted hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Spinner with depth */}
                <div className="relative mx-auto w-16 h-16 mb-8">
                  <div className="absolute inset-0 rounded-full"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1) inset' }} />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-full h-full rounded-full border-[3px] border-surface-soft border-t-ink"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-1.5 rounded-full border-[2px] border-transparent border-t-muted/40"
                  />
                </div>

                <h2 className="font-display text-[26px] font-bold tracking-tight mb-3 text-ink">
                  Analyze Your Journey
                </h2>
                <p className="font-sans text-body-sm text-muted mb-8 leading-relaxed max-w-xs mx-auto">
                  Upload your resume to begin the deep learning assessment.
                </p>

                {/* Drop zone */}
                <label className="cursor-pointer group block w-full p-8 border border-dashed border-hairline rounded-xl hover:border-ink/40 hover:bg-surface-soft/50 transition-all duration-300"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04) inset' }}
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) router.push('/analyze'); }}
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <FileText className="w-10 h-10 text-muted group-hover:text-ink transition-colors mx-auto mb-3" />
                  </motion.div>
                  <span className="font-sans text-sm font-semibold text-muted group-hover:text-ink transition-colors block">
                    Drop resume here or click to browse
                  </span>
                  <span className="font-sans text-xs text-muted/60 mt-1 block">PDF or DOCX</span>
                </label>

                <button
                  onClick={() => setIsAnalyzing(false)}
                  className="mt-7 font-sans text-xs font-bold text-muted hover:text-ink transition-colors uppercase tracking-[0.15em]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
