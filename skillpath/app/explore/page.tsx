import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/CtaSection';
import JobTitleInput from '@/components/explore/JobTitleInput';

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-canvas text-ink selection:bg-primary/10 relative overflow-hidden font-sans">
      
      <div className="relative z-10 pt-32 pb-24 md:pt-48 md:pb-48 flex items-center justify-center min-h-[80vh]">
        <JobTitleInput />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
