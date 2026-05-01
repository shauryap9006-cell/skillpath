'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/landing/Navbar';
import { DropZone } from '@/components/ui/DropZone';
import { saveToHistory } from '@/lib/history';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Upload, ChevronRight, Target } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "Deep analyzing your profile...",
  "Cross-referencing JD requirements...",
  "Identifying competitive advantages...",
  "Pinpointing critical skill gaps...",
  "Crafting your custom mastery plan...",
  "Optimizing for maximum interview impact...",
  "Almost there. Polishing your roadmap...",
];

export default function AnalyzePage() {
  const router = useRouter();
  const [mode, setMode] = useState<'job' | 'dream'>('job');
  const [jd, setJd] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const pendingJd = sessionStorage.getItem('pending_jd');
    if (pendingJd) {
      setJd(pendingJd);
      sessionStorage.removeItem('pending_jd');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      }, 4000);
    } else {
      setQuoteIndex(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async () => {
    if (!jd) {
      setError(mode === 'job' ? 'Please paste a job description.' : 'Please describe your career dream.');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      let finalResumeText = resumeText;
      if (file && !resumeText) {
        finalResumeText = await extractTextFromFile(file);
      }

      if (!finalResumeText.trim()) {
        setError('Could not extract text from your resume. Please try pasting it as text instead.');
        setIsAnalyzing(false);
        return;
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jd_text: jd,
          resume_text: finalResumeText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      saveToHistory({
        share_token: data.share_token,
        gap_score: data.gap_score,
        weeks_required: data.weeks_required,
        company_type: data.company_type,
        mvc_skills: data.mvc_skills || [],
        created_at: data.created_at,
        jd_preview: jd.slice(0, 80),
      });

      router.push(`/results/${data.share_token}`);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const isFormValid = jd.trim().length > 0 && (file !== null || resumeText.trim().length > 0);
  const bars = Array.from({ length: 12 }, (_, i) => i);

  return (
    <main className="flex flex-col min-h-screen bg-canvas text-ink relative font-sans">
      
      <div className="flex flex-col items-center pt-48 pb-32 px-8">
        <motion.div
          className="w-full max-w-[800px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-teal/10 border border-brand-teal/20 text-[11px] text-brand-teal font-bold tracking-widest uppercase mb-6">
              <Sparkles size={12} className="fill-current" />
              Vector Analysis Phase 01
            </span>
            <h1 className="font-display text-display-lg text-ink mb-6 text-center">
              Paste the job.<br />Drop the resume.
            </h1>
            <p className="font-sans text-[20px] text-muted max-w-xl mx-auto leading-relaxed">
              Our analysis engine calculates the exact delta between your profile and your target role.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Target Job Section */}
            <div className="bg-surface-card rounded-xl p-8 border border-hairline shadow-sm relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setMode('job')}
                    className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${mode === 'job' ? 'text-primary' : 'text-muted'}`}
                  >
                    <FileText size={16} />
                    <span>Target Job</span>
                  </button>
                  <button
                    onClick={() => setMode('dream')}
                    className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${mode === 'dream' ? 'text-primary' : 'text-muted'}`}
                  >
                    <Target size={16} />
                    <span>Career Dream</span>
                  </button>
                </div>
              </div>
              <div className="bg-canvas border border-hairline rounded-md overflow-hidden transition-all focus-within:border-primary flex-1 flex flex-col">
                <textarea 
                  placeholder={mode === 'job' ? "Paste the full job description here..." : "e.g. My dream is to be a Senior AI Engineer at Google..."}
                  className="w-full flex-1 min-h-[300px] p-6 font-sans text-body-md text-ink placeholder:text-muted/40 bg-transparent focus:outline-none resize-none"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                  {mode === 'job' ? "Analyzes specific posting" : "Builds career roadmap"}
                </p>
                {mode === 'job' && (
                  <button
                    onClick={() => setJd("Job Title: \nCompany Type: \nCore Skills: \nResponsibilities: ")}
                    className="text-[10px] text-muted hover:text-ink font-bold uppercase tracking-widest transition-colors"
                  >
                    + Paste Template
                  </button>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-surface-card rounded-xl p-8 border border-hairline shadow-sm relative flex flex-col h-full">
               <div className="flex items-center gap-2 text-[11px] text-ink font-bold uppercase tracking-[0.15em] mb-6">
                  <Upload size={16} />
                  <span>Career History</span>
                </div>
              
              <div className="border-2 border-dashed border-hairline rounded-md p-8 text-center bg-canvas hover:bg-canvas/50 transition-colors cursor-pointer group mb-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-surface-card border border-hairline flex items-center justify-center group-hover:border-primary transition-colors">
                    <Upload size={20} className="text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="font-sans text-body-md text-ink font-medium">
                    Drop PDF here or <span className="underline decoration-hairline underline-offset-4">click to upload</span>
                  </p>
                </div>
              </div>

              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-hairline"></div>
                </div>
                <div className="relative px-4 bg-surface-card text-[10px] text-muted font-bold uppercase tracking-[0.2em]">
                  OR PASTE TEXT
                </div>
              </div>

              <div className="bg-canvas border border-hairline rounded-md overflow-hidden transition-all focus-within:border-primary flex-1 flex flex-col">
                <textarea 
                  placeholder="Paste your resume text here..."
                  className="w-full flex-1 min-h-[120px] p-6 font-sans text-body-md text-ink placeholder:text-muted/40 bg-transparent focus:outline-none resize-none"
                  value={resumeText}
                  onChange={(e) => { setResumeText(e.target.value); setFile(null); }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-md bg-brand-pink/5 border border-brand-pink/20 text-brand-pink text-[11px] font-bold uppercase tracking-widest"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8 flex flex-col items-center">
              <button
                disabled={!isFormValid || isAnalyzing}
                onClick={handleAnalyze}
                className="w-full max-w-[400px] bg-ink text-on-primary font-sans font-bold text-button px-12 py-6 rounded-md hover:bg-ink/90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-wait shadow-sm relative overflow-hidden h-[68px]"
              >
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center absolute inset-0 bg-ink"
                    >
                      <div className="flex gap-1.5 items-end h-4 mb-2">
                        {bars.map((bar) => (
                          <motion.div
                            key={bar}
                            className="w-1 bg-brand-teal rounded-t-full"
                            animate={{
                              height: ['30%', '100%', '30%'],
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: bar * 0.1
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-on-primary/60">
                        {MOTIVATIONAL_QUOTES[quoteIndex]}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="analyze"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-3"
                    >
                      GENERATE ANALYSIS
                      <ChevronRight size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              
              {isAnalyzing && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-[10px] text-muted font-bold uppercase tracking-[0.3em]"
                >
                  Analysis protocol in progress · ETA 10s
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
