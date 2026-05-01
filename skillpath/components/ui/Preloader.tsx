'use client';

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const { loaded, setLoaded } = useUI();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const STORAGE_KEY = "preloader_shown_v7";

  // The exact percentages from the source design
  const columnMovements = [0, 12.35, 25.49, 41.37, 25.49, 12.35, 0];

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Forcing preloader on every refresh for testing
    setIsVisible(true);
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    setLoaded(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "true");
    } catch (err) {
      console.warn("Failed to write preloader flag:", err);
    }
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden bg-canvas"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          {/* Centered Logo with Cinematic Fade & Scale */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <motion.p
              className="font-irish-grover text-5xl md:text-[110px] text-ink tracking-wider uppercase"
              initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)", y: 15 }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              SKILLPATH
            </motion.p>
          </div>

          {/* Single Color Columns Overlay */}
          <div className="absolute inset-0 flex w-full h-full z-20">
            {columnMovements.map((movePct, i) => {
              const delay = i * 0.05;
              const isLast = i === columnMovements.length - 1;

              return (
                <div key={i} className="flex-1 relative h-full group">
                  {/* Top Half - Using Surface Strong (Clay color from image) */}
                  <motion.div
                    className="absolute top-0 w-full h-[50.5%] bg-surface-strong border-b border-ink/5"
                    style={{ boxShadow: "inset -1.5px 0 0 rgba(0,0,0,0.02)" }}
                    animate={{
                      y: ["0%", `-${movePct}%`, `-${movePct}%`, "-105%"]
                    }}
                    transition={{
                      duration: 3.5,
                      times: [0, 0.25, 0.75, 1],
                      ease: [[0.76, 0, 0.24, 1], "linear", [0.76, 0, 0.24, 1]],
                      delay: delay,
                    }}
                  />
                  {/* Bottom Half - Using Surface Strong (Clay color from image) */}
                  <motion.div
                    className="absolute bottom-0 w-full h-[50.5%] bg-surface-strong border-t border-ink/5"
                    style={{ boxShadow: "inset -1.5px 0 0 rgba(0,0,0,0.02)" }}
                    animate={{
                      y: ["0%", `${movePct}%`, `${movePct}%`, "105%"]
                    }}
                    transition={{
                      duration: 3.5,
                      times: [0, 0.25, 0.75, 1],
                      ease: [[0.76, 0, 0.24, 1], "linear", [0.76, 0, 0.24, 1]],
                      delay: delay,
                    }}
                    onAnimationComplete={isLast ? handleComplete : undefined}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
