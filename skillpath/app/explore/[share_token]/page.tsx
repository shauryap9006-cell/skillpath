import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/CtaSection';
import SkillMap from '@/components/explore/SkillMap';
import ExploreStats from '@/components/explore/ExploreStats';
import ExploreCTA from '@/components/explore/ExploreCTA';
import { motion } from 'framer-motion';

// Note: Framer motion needs a client component wrapper or "use client"
// I'll put the layout logic here and import client components for visuals.

async function getExploration(token: string) {
  if (!adminDb) return null;
  const doc = await adminDb.collection('explorations').doc(token).get();
  if (!doc.exists) return null;
  return doc.data();
}

export default async function ExploreResultsPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params;
  const data = await getExploration(share_token);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-canvas text-ink selection:bg-brand-pink/20 font-sans">
      
      <div className="max-w-[1280px] mx-auto px-8 lg:px-24 pt-48 pb-16">
        {/* Header Section */}
        <header className="mb-20">
          <span className="font-bold text-[11px] text-muted tracking-widest uppercase mb-6 block">Skill Map Explorer</span>
          <h1 className="font-display text-display-lg md:text-[80px] text-ink mb-8 leading-[1.05] tracking-tight">
            {data.role}
          </h1>
          <div className="flex flex-wrap items-center gap-6 font-sans font-bold text-[12px] tracking-widest uppercase">
            <span className="text-muted">{data.seniority} level</span>
            <span className="w-1.5 h-1.5 bg-hairline rounded-full" />
            <span className="text-brand-teal">{data.company_type} context</span>
          </div>
        </header>

        {/* MVC High-level Highlight */}
        <section className="mb-32">
          <div className="bg-surface-card border border-hairline rounded-[32px] p-10 md:p-16 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <span className="font-bold text-[10px] text-brand-teal uppercase tracking-[0.2em] mb-8 block">The Interview Gatekeepers</span>
              <h2 className="font-display text-display-md text-ink mb-10 max-w-2xl leading-tight">
                These {data.mvc_skills.length} skills appear in 80%+ of JDs for this role. Master these to get interviews.
              </h2>
              
              <div className="flex flex-wrap gap-4">
                {data.mvc_skills.map((skill: string, i: number) => (
                  <span 
                    key={skill}
                    className="font-sans font-semibold text-body-md text-ink border border-hairline px-8 py-4 rounded-xl bg-canvas hover:bg-surface-soft transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <ExploreStats data={data as any} />

        {/* Full Skill Map */}
        <section className="pt-32 pb-16 border-t border-hairline">
          <header className="mb-20 max-w-2xl">
            <h2 className="font-display text-display-md text-ink mb-6">Full Skill Architecture</h2>
            <p className="font-sans text-[20px] text-muted leading-relaxed">
              Every technical competency and analytical requirement identified from thousands of market-active job descriptions.
            </p>
          </header>
          
          <SkillMap categories={data.skill_map.categories} />
        </section>

        {/* Conversion CTA */}
        <ExploreCTA />
      </div>

      <Footer />
    </main>
  );
}
