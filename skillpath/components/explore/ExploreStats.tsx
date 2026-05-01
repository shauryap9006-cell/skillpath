'use client';

import { motion } from 'framer-motion';

interface ExploreData {
  total_weeks: number;
  skill_map: {
    categories: Record<string, any[]>;
    most_demanded_skill: string;
    fastest_growing_skill: string;
  };
}

export default function ExploreStats({ data }: { data: ExploreData }) {
  const totalSkills = Object.values(data.skill_map.categories).reduce((acc, cat) => acc + cat.length, 0);

  const stats = [
    { label: 'Time from zero', value: `${data.total_weeks} weeks`, detail: 'at 1hr / day' },
    { label: 'Skills to master', value: totalSkills.toString(), detail: 'curated for this role' },
    { label: 'Most in demand', value: data.skill_map.most_demanded_skill, detail: 'found in 90%+ JDs' },
    { label: 'Fastest growing', value: data.skill_map.fastest_growing_skill, detail: 'increasing market value' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-hairline my-24">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className="flex flex-col"
        >
          <span className="font-sans font-bold text-[10px] text-muted uppercase tracking-[0.2em] mb-3">{stat.label}</span>
          <span className="font-display text-display-sm text-ink mb-2">{stat.value}</span>
          <span className="font-sans font-semibold text-[11px] text-brand-teal uppercase tracking-wider">{stat.detail}</span>
        </motion.div>
      ))}
    </div>
  );
}
