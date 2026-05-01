'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function CtaSection() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const handleAction = () => {
    if (user) {
      router.push('/analyze');
    } else {
      openAuthModal();
    }
  };

  return (
    <section className="bg-canvas py-section px-8 lg:px-24 flex justify-center">
      <div className="max-w-[1280px] w-full bg-surface-strong rounded-xl p-[80px] text-center flex flex-col items-center border border-hairline shadow-sm">
        <h2 className="font-display text-display-md text-ink mb-6">
          Stop guessing. Start growing.
        </h2>
        <p className="font-sans text-body-md text-ink/80 mb-lg max-w-lg">
          Whether it's a 10-person startup or a Fortune 500 giant, we'll map your route.
        </p>
        <button 
          onClick={handleAction}
          className="bg-primary text-on-primary font-sans font-semibold text-button px-xl py-[12px] h-[44px] rounded-md hover:bg-primary-active transition-colors mb-lg shadow-md active:scale-95"
        >
          Get My Free Roadmap
        </button>
        <p className="font-sans text-caption text-ink/50 uppercase tracking-widest font-medium">
          Joined by 5,000+ engineers this month • Free forever
        </p>
      </div>
    </section>
  );
}
 
export function Footer() {
  return (
    <footer className="bg-surface-soft py-[80px] px-8 lg:px-24 flex justify-center border-t border-hairline">
      <div className="max-w-[1280px] w-full grid grid-cols-1 md:grid-cols-4 gap-xl">
        <div className="col-span-2">
          <span className="font-display text-title-md text-ink block mb-md">SkillPath</span>
          <p className="font-sans text-body-sm text-muted max-w-xs">
            The data-orchestration platform for your career growth. Built for the modern engineer.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-caption-uppercase text-ink mb-md">Resources</h4>
          <ul className="space-y-sm">
            <li><a href="#" className="font-sans text-body-sm text-muted hover:text-ink transition-colors">Documentation</a></li>
            <li><a href="#" className="font-sans text-body-sm text-muted hover:text-ink transition-colors">Success Stories</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-caption-uppercase text-ink mb-md">Connect</h4>
          <ul className="space-y-sm">
            <li><a href="#" className="font-sans text-body-sm text-muted hover:text-ink transition-colors">Twitter</a></li>
            <li><a href="#" className="font-sans text-body-sm text-muted hover:text-ink transition-colors">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] w-full mt-xl pt-lg border-t border-hairline/50 flex justify-between items-center">
        <span className="font-sans text-caption text-muted soft">© 2026 SkillPath Inc.</span>
      </div>
    </footer>
  );
}
