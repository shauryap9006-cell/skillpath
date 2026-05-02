'use client';

import { useTheme } from 'next-themes';
import NeuralBackground from '@/components/ui/flow-field-background';
import { Footer } from '@/components/landing/CtaSection';
import JobTitleInput from '@/components/explore/JobTitleInput';

export default function ExplorePage() {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const particleColor = isDark ? '#6366f1' : '#ff4d8b';
  const trailColor = isDark ? '0, 0, 0' : '255, 250, 240';


  return (
    <main className="min-h-screen bg-canvas text-ink selection:bg-primary/10 relative overflow-hidden font-sans">
      {/* Background Shader */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <NeuralBackground 
          color={particleColor}
          trailColor={trailColor}
          trailOpacity={0.15}
          particleCount={1500}
          speed={0.7}

        />
      </div>
      
      <div className="relative z-10 pt-32 pb-24 md:pt-48 md:pb-48 flex items-center justify-center min-h-[80vh]">
        <JobTitleInput />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}

