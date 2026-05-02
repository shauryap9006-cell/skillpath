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
          className="bg-brand-pink text-white font-sans font-semibold text-button px-xl py-[12px] h-[44px] rounded-md hover:opacity-90 transition-all mb-lg shadow-md active:scale-95 tactile-button"
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
    <footer className="bg-surface-soft py-10 px-8 lg:px-24 flex flex-col items-center border-t border-hairline">
      <div className="max-w-[1280px] w-full grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        <div className="md:col-span-6">
          <span className="font-display text-[20px] text-ink block mb-2">SkillPath</span>
          <p className="font-sans text-[13px] text-muted max-w-xs leading-relaxed">
            The data-orchestration platform for your career growth. Built for the modern engineer.
          </p>
        </div>
        
        <div className="md:col-span-3">
          <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-ink mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><a href="#" className="font-sans text-[13px] text-muted hover:text-ink transition-colors">Documentation</a></li>
            <li><a href="#" className="font-sans text-[13px] text-muted hover:text-ink transition-colors">Success Stories</a></li>
          </ul>
        </div>
        
        <div className="md:col-span-3">
          <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-ink mb-4">Connect</h4>
          <ul className="space-y-2">
            <li><a href="https://github.com/shauryap9006-cell" target="_blank" rel="noopener noreferrer" className="font-sans text-[13px] text-muted hover:text-ink transition-colors">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/shaurya-singh-971005357/" target="_blank" rel="noopener noreferrer" className="font-sans text-[13px] text-muted hover:text-ink transition-colors">LinkedIn</a></li>
            <li><a href="https://www.instagram.com/shaurya__pratap_07/" target="_blank" rel="noopener noreferrer" className="font-sans text-[13px] text-muted hover:text-ink transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1280px] w-full pt-6 border-t border-hairline/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-sans text-[11px] text-muted/50">© 2026 SkillPath Inc.</span>
        <div className="flex gap-6 text-[11px] text-muted/50 font-sans">
          <a href="#" className="hover:text-ink transition-colors">Privacy</a>
          <a href="#" className="hover:text-ink transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
