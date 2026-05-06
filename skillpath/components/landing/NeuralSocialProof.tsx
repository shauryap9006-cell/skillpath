'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function NeuralSocialProof() {
  const avatars = [
    { color: 'bg-brand-pink', delay: 0 },
    { color: 'bg-brand-teal', delay: 0.2 },
    { color: 'bg-brand-ochre', delay: 0.1 },
    { color: 'bg-brand-lavender', delay: 0.3 },
  ];

  return (
    <div className="flex items-center gap-5 mt-2">
      <div className="flex -space-x-2.5">
        {avatars.map((avatar, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20, 
              delay: avatar.delay + 1.8 
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.1,
              zIndex: 10,
              transition: { type: 'spring', stiffness: 400, damping: 10 }
            }}
            className={`h-11 w-11 rounded-full border-[2.5px] border-[#EBE9DC] dark:border-[#0A0A0A] ${avatar.color} shadow-lg cursor-pointer relative group transition-transform`}
          >
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-ink text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
               Neural node {i + 1}
             </div>
          </motion.div>
        ))}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.3, type: 'spring' }}
          className="h-11 w-11 rounded-full border-2 border-dashed border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-[10px] font-black text-ink/40"
        >
          +2K
        </motion.div>
      </div>
      
      <div className="flex flex-col -gap-1">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="font-display text-[15px] font-black text-ink leading-tight"
        >
          2,482 professionals
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="font-sans text-[11px] text-muted font-bold uppercase tracking-wider opacity-60"
        >
          mapping their growth today
        </motion.p>
      </div>
    </div>
  );
}
