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
    <div className="flex items-center gap-6">
      <div className="flex -space-x-3">
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
            className={`h-10 w-10 rounded-full border-2 border-canvas ${avatar.color} shadow-lg cursor-pointer relative group`}
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
          className="h-10 w-10 rounded-full border-2 border-dashed border-hairline bg-surface-soft flex items-center justify-center text-[10px] font-bold text-muted"
        >
          +2k
        </motion.div>
      </div>
      
      <div className="flex flex-col">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="font-sans text-sm font-bold text-ink"
        >
          2,482 professionals
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="font-sans text-[11px] text-muted font-medium"
        >
          mapping their growth today.
        </motion.p>
      </div>
    </div>
  );
}
