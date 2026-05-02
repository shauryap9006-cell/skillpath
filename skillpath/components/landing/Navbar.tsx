'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-nav-link text-muted dark:text-ink/60 hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-md">
          <div className="hidden sm:flex items-center gap-md">
            <ThemeToggle />
            {mounted && (!user ? (
              <>
                <button
                  onClick={openAuthModal}
                  className="font-sans text-nav-link text-ink hover:text-brand-pink transition-colors px-2"
                >
                  Sign in
                </button>
                <button
                  onClick={openAuthModal}
                  className="bg-brand-pink text-white font-sans font-semibold text-button px-[16px] py-[8px] h-[36px] rounded-md hover:opacity-90 transition-all flex items-center shadow-sm active:scale-95 tactile-button"
                >
                  Try free
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/profile')}
                className="bg-brand-pink text-white font-sans font-semibold text-button px-[16px] py-[8px] h-[36px] rounded-md hover:opacity-90 transition-all flex items-center shadow-sm active:scale-95 tactile-button"
              >
                Profile
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-ink flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <MenuToggleIcon open={isMobileMenuOpen} className="w-8 h-8" duration={400} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[64px] left-0 right-0 bg-canvas border-b border-hairline shadow-xl p-8 flex flex-col gap-6 md:hidden z-50"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans text-[18px] font-semibold text-ink hover:text-brand-pink transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6 border-t border-hairline flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted uppercase tracking-widest">Theme</span>
                <ThemeToggle />
              </div>
              {mounted && (!user ? (
                <button
                  onClick={() => {
                    openAuthModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-brand-pink text-white font-sans font-semibold py-4 rounded-xl shadow-lg active:scale-95 transition-transform tactile-button"
                >
                  Get Started
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-brand-pink text-white font-sans font-semibold py-4 rounded-xl shadow-lg tactile-button"
                >
                  My Profile
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
