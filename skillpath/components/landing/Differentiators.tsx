'use client';
 
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
 
export function Differentiators() {
  const containerRef = useRef<HTMLDivElement>(null);
 
  const features = [
    { num: "01", title: "MVC Profile", desc: "4 skills. Not 40. We find the ones that actually get you callbacks." },
    { num: "02", title: "Ready-by Date", desc: "Not \"beginner to advanced.\" A specific date. July 3. Start today." },
    { num: "03", title: "Free. All of it.", desc: "No subscriptions. No paywalls. Every resource we link is free." }
  ];
 
  return (
    <section id="features" className="py-24 px-8 lg:pl-16 text-ink" ref={containerRef}>
      <div className="w-full">
        <div className="flex flex-col">
          {features.map((feat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.2 }}
              className="diff-row flex flex-col md:flex-row border-t border-hairline py-12 first:border-t-2 first:border-ink"
            >
              <div className="md:w-1/3 mb-4 md:mb-0">
                <span className="font-sans text-sm text-muted">{feat.num}</span>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-display text-4xl mb-4 text-ink">{feat.title}</h3>
                <p className="font-sans text-base text-muted max-w-md">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-hairline"></div>
        </div>
      </div>
    </section>
  );
}
