'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/#features' },
    { label: 'Explore', href: '/explore' },
    { label: 'Analyze', href: '/analyze' },
    { label: 'History', href: '/history' },
  ];

  if (pathname === '/auth') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 h-[64px] bg-canvas/80 backdrop-blur-md border-b border-hairline shadow-sm z-[100] flex justify-center px-8 lg:px-24">
      <div className="max-w-[1280px] w-full flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <div className="w-4 h-4 bg-brand-pink rounded-sm rotate-45" />
          </div>
          <span className="font-display text-title-md text-ink tracking-tight">SkillPath</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="font-sans text-nav-link text-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-md">
          <ThemeToggle />
          {!user ? (
            <>
              <button 
                onClick={openAuthModal}
                className="font-sans text-nav-link text-ink hover:text-muted transition-colors px-2"
              >
                Sign in
              </button>
              <button 
                onClick={openAuthModal}
                className="bg-primary text-on-primary font-sans font-semibold text-button px-[16px] py-[8px] h-[36px] rounded-md hover:bg-primary-active transition-colors flex items-center"
              >
                Try free
              </button>
            </>
          ) : (
            <button 
              onClick={() => router.push('/profile')}
              className="bg-primary text-on-primary font-sans font-semibold text-button px-[16px] py-[8px] h-[36px] rounded-md hover:bg-primary-active transition-colors flex items-center"
            >
              Profile
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
