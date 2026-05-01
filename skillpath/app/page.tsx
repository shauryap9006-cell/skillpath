'use client';

import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { LandingInputSection } from '@/components/landing/LandingInputSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CtaSection, Footer } from '@/components/landing/CtaSection';
import { FeatureAutoSlider } from '@/components/ui/feature-auto-slider';
import dynamic from 'next/dynamic';

const CalibrationTable = dynamic(() => import('@/components/landing/CalibrationTable').then(mod => ({ default: mod.CalibrationTable })), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-canvas pt-[64px]">
      <Hero />
      <LandingInputSection />
      <HowItWorks />
      <FeatureAutoSlider />
      <CalibrationTable />
      <CtaSection />
      <Footer />
    </main>
  );
}
