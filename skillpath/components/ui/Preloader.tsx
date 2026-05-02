'use client';

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";

const MOTIVATIONAL_LINES = [
  "Forging new neural connections...",
  "Sharpening your cognitive edge...",
  "Calibrating synaptic pathways...",
  "Loading brilliance, one byte at a time...",
  "Preparing your mental gymnasium...",
  "Assembling the building blocks of mastery...",
  "Dusting off the compendium of knowledge...",
  "Brewing a fresh pot of intellect...",
  "Synchronizing ambitions with actions...",
  "Unlocking the potential vault...",
  "Structuring concepts for maximal impact...",
  "Waking up the dormant brain cells...",
  "Synthesizing your next big breakthrough...",
  "Aligning theory with practice...",
  "Curating an elite curriculum for you...",
  "Polishing the stepping stones to success...",
  "Gathering the raw materials of genius...",
  "Fine-tuning your learning trajectory...",
  "Igniting the spark of curiosity...",
  "Preparing the canvas for your next masterpiece..."
];

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const pathname = usePathname();
  const { setLoaded } = useUI();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [quote, setQuote] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  // Only show preloader on the home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    setHasMounted(true);
    
    // If not on home page, set loaded immediately and don't show preloader
    if (!isHomePage) {
      setLoaded(true);
      return;
    }

    setQuote(MOTIVATIONAL_LINES[Math.floor(Math.random() * MOTIVATIONAL_LINES.length)]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setLoaded(true);
            if (onComplete) onComplete();
          }, 600); // Short delay as in source
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 1; // source increments
      });
    }, 100);

    return () => clearInterval(interval);
  }, [setLoaded, onComplete, isHomePage]);

  if (!hasMounted || !isHomePage) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="preloader-overlay"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-canvas p-8 text-ink overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 1,
              ease: [0.76, 0, 0.24, 1],
              when: "afterChildren"
            }
          }}
        >
          {/* Top-Left Logo Fixed */}
          <motion.div
            className="absolute top-12 left-12 flex items-center space-x-3 z-50"
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="w-10 h-10 rounded-2xl tactile-card flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-red-500 glow-yellow"></div>
            </div>
            <span className="font-bold text-2xl tracking-tight uppercase">Skillpath</span>
          </motion.div>

          <motion.div
            key="preloader-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.1,
              transition: { duration: 0.5, ease: "easeIn" }
            }}
            className="flex flex-col items-center w-full max-w-xl"
          >
            <div className="relative flex flex-col items-center justify-center">
              <motion.div
                className="w-64 h-64 rounded-full tactile-card mb-12 flex items-center justify-center border-4 border-surface-soft relative"
              >
                <motion.div
                  className="absolute inset-2 rounded-full border-t-4 border-r-4 border-red-500/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div
                  className="w-48 h-48 rounded-full tactile-input flex flex-col items-center justify-center relative overflow-hidden z-10"
                >
                  <span className="text-body-strong font-black text-6xl relative z-10">{Math.min(progress, 100)}%</span>
                  <span className="text-muted text-xs font-bold uppercase tracking-widest mt-2 relative z-10">loading</span>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-red-500/10 z-0"
                    initial={{ height: "0%" }}
                    animate={{ height: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </div>

            <div className="text-center space-y-4 max-w-sm mt-8">
              <h1 className="text-4xl font-black text-body-strong leading-tight">{quote}</h1>
            </div>

            <div className="mt-16 w-full max-w-md">
              <div className="w-full h-8 rounded-full tactile-input flex items-center px-1 relative overflow-hidden">
                <motion.div
                  className="h-6 rounded-full tactile-button !bg-red-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", bounce: 0 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Decorative background dot-grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20 dot-grid" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
