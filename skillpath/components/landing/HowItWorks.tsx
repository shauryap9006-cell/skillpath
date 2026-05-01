'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, Compass } from 'lucide-react';
import dynamic from 'next/dynamic';

const ClayIllustration = dynamic(() => import('../ui/clay-illustration').then(mod => mod.ClayIllustration), { ssr: false });

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Analyze",
      desc: "Our engine ingests your target role and your current experience, parsing them into high-dimensional skill vectors.",
      colorClass: "text-brand-pink",
      clayColor: "#ffffff", // Pure white for pop
      icon: <FileText className="w-6 h-6 text-brand-pink" />
    },
    {
      num: "02",
      title: "Score",
      desc: "We calculate the delta between where you are and where you need to be, ranking missing skills by market priority.",
      colorClass: "text-brand-teal",
      clayColor: "#ffb084", // Peach on Teal
      icon: <Cpu className="w-6 h-6 text-brand-teal" />
    },
    {
      num: "03",
      title: "Execute",
      desc: "Receive a deterministic, week-by-week roadmap to bridge the gap. No guesswork, just execution.",
      colorClass: "text-brand-lavender",
      clayColor: "#ff4d8b", // Pink on Lavender
      icon: <Compass className="w-6 h-6 text-brand-lavender" />
    }
  ];

  return (
    <section id="how-it-works" className="bg-canvas py-section px-8 lg:px-24 flex justify-center">
      <div className="max-w-[1280px] w-full">
        <div className="flex flex-col items-center text-center mb-24">
          <span className="font-sans text-caption-uppercase text-ink mb-4 uppercase tracking-widest font-semibold">The Methodology</span>
          <h2 className="font-display text-display-lg lg:text-display-xl text-ink max-w-4xl">
            A deterministic path to your dream role.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl p-xl flex flex-col min-h-[500px] relative overflow-hidden tactile-card"
            >
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md">
                  {step.icon}
                </div>
                <span className={`font-display text-display-sm opacity-20 ${step.colorClass}`}>
                  {step.num}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="font-display text-title-md mb-md text-ink">
                  {step.title}
                </h3>
                <p className="font-sans text-body-md leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>

              {/* 3D Clay Illustration */}
              <div className="absolute bottom-0 right-0 w-full h-[280px] translate-y-10">
                <ClayIllustration color={step.clayColor} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
