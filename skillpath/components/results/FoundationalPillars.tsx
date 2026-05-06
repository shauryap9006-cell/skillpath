// components/results/FoundationalPillars.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ArrowRight } from 'lucide-react';

interface FoundationalPillarsProps {
  pillars: string[];
  roleCategory?: string;
}

export function FoundationalPillars({ pillars, roleCategory = 'other' }: FoundationalPillarsProps) {
  const getFallbacks = (category: string): string[] => {
    const map: Record<string, string[]> = {
      'software-engineer': ['Version Control (Git)', 'Data Structures', 'Algorithmic Logic'],
      'frontend-developer': ['ES6+ JavaScript', 'CSS Box Model', 'DOM Manipulation'],
      'backend-developer': ['RESTful API Design', 'Relational Databases', 'Server Environments'],
      'data-scientist': ['Probability & Stats', 'Python Data Science', 'Linear Algebra'],
      'ml-engineer': ['Calculus for ML', 'Vector Calculus', 'Neural Networks'],
      'product-manager': ['Market Analysis', 'Agile Frameworks', 'Data Literacy'],
      'devops-engineer': ['Linux CLI', 'Networking Basics', 'Virtualization'],
      'design': ['Visual Hierarchy', 'Color Theory', 'Layout Composition'],
    };
    return map[category] || ['Technical Logic', 'Systems Thinking', 'Network Basics'];
  };

  const finalPillarsRaw = (pillars && pillars.length > 0) ? pillars : getFallbacks(roleCategory);
  const finalPillars = Array.isArray(finalPillarsRaw) ? finalPillarsRaw : getFallbacks(roleCategory);

  if (!finalPillars || finalPillars.length === 0) return null;

  return (
    <div className="mb-16 p-8 rounded-3xl border border-brand-pink/20 bg-brand-pink/5 relative overflow-hidden group">
      {/* Aesthetic Accents */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-pink/10 rounded-full blur-3xl group-hover:bg-brand-pink/15 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-brand-pink text-on-primary">
            <LayoutGrid size={18} />
          </div>
          <div>
            <h3 className="font-display text-title-sm text-ink font-bold">Foundational Prerequisites</h3>
            <p className="font-sans text-body-xs text-muted uppercase tracking-widest font-bold mt-0.5">Master these basics first</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {finalPillars.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="flex items-center justify-between p-4 rounded-xl bg-surface-card border border-hairline shadow-sm hover:border-brand-pink/30 hover:shadow-md transition-all group/pillar"
            >
              <div className="flex flex-col">
                <span className="font-sans text-[10px] text-muted font-bold uppercase tracking-tighter">Pillar 0{idx + 1}</span>
                <span className="font-sans text-body-md font-bold text-ink">{skill}</span>
              </div>
              <ArrowRight size={14} className="text-muted group-hover/pillar:text-brand-pink transition-colors" />
            </motion.div>
          ))}
        </div>

        <p className="mt-6 font-sans text-body-sm text-muted italic">
          These core concepts form the bedrock of your target role. Mastering them ensures you won't struggle with the more advanced tools in your roadmap.
        </p>
      </div>
    </div>
  );
}
