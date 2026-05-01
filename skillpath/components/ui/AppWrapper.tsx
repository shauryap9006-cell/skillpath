'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/context/UIContext';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { loaded } = useUI();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
