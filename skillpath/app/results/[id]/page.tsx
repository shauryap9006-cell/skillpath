'use client';

import React, { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Accordion } from '@/components/ui/Accordion';
import { saveToHistory, getHistory } from '@/lib/history';
import type { AnalysisResult, Resource } from '@/types/analysis';
import { SkillCard } from '@/components/results/SkillCard';
import { GenerateAllButton } from '@/components/results/GenerateAllButton';

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/results/${id}`);
        if (!res.ok) {
          throw new Error('Analysis not found');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const [saved, setSaved] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);

  useEffect(() => {
    if (data) {
      const history = getHistory();
      setSaved(history.some((h) => h.share_token === data.share_token));
    }
  }, [data]);

  const handleGeneratePlan = async () => {
    if (generatingPlan) return;
    setGeneratingPlan(true);
    try {
      const res = await fetch(`/api/results/${id}/plan`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate plan');
      const learningPlan = await res.json();
      setData(prev => prev ? { ...prev, learning_plan: learningPlan } : null);
    } catch (err) {
      alert('Failed to generate learning plan. Please try again.');
      console.error(err);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!data || batchGenerating) return;

    const pendingSkills = data.skill_gaps.filter(
      gap => !data.generated_resources?.[gap.skill]
    );

    if (pendingSkills.length === 0) return;

    setBatchGenerating(true);
    setBatchProgress({ current: 0, total: pendingSkills.length });

    for (let i = 0; i < pendingSkills.length; i++) {
      const gap = pendingSkills[i];
      setBatchProgress(prev => ({ ...prev, current: i + 1 }));

      try {
        const res = await fetch('/api/generate-resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analysis_id: data.share_token,
            skill: gap.skill,
            role: data.role_label || 'Software Engineer',
            seniority: 'entry',
            company_type: data.company_type,
          }),
        });

        if (res.ok) {
          const result = await res.json();
          setData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              generated_resources: {
                ...(prev.generated_resources || {}),
                [gap.skill]: result.skill_resources,
              },
            };
          });
        }
      } catch (err) {
        console.error(`Failed to generate resources for ${gap.skill}:`, err);
      }

      if (i < pendingSkills.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setBatchGenerating(false);
  };

  const handleSave = () => {
    if (!data) return;
    saveToHistory({
      share_token: data.share_token,
      gap_score: data.gap_score,
      weeks_required: data.weeks_required,
      company_type: data.company_type,
      mvc_skills: data.mvc_skills || [],
      created_at: data.created_at,
      jd_preview: data.jd_preview || '',
    });
    setSaved(true);
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-canvas text-ink pt-[64px]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="font-sans text-muted">Loading your analysis...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex flex-col min-h-screen bg-canvas text-ink pt-[64px]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-8">
            <h1 className="font-display text-title-lg mb-4">Analysis not found</h1>
            <p className="font-sans text-muted">{error || 'This link may be invalid or expired.'}</p>
          </div>
        </div>
      </main>
    );
  }

  const gapPercent = 100 - data.gap_score;

  return (
    <main className="flex flex-col min-h-screen pb-24 bg-canvas text-ink relative pt-[64px]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-24 pt-24 w-full">

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-hairline pb-16 gap-8">
          <div className="max-w-2xl">
            <span className="font-sans text-nav-link text-muted uppercase tracking-[0.06em] mb-4 block">Analysis Complete</span>
            <h1 className="font-display text-display-lg leading-[1.1] mb-6">
              You&apos;re {data.weeks_required} weeks away.
            </h1>
            <p className="font-sans text-body-lg text-muted">
              Ready by <span className="text-ink font-medium">{new Date(data.ready_by_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span> — at 1hr/day
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saved}
              className={`font-sans font-semibold text-button px-6 py-3 rounded-md border transition-all ${saved
                ? 'text-brand-teal border-brand-teal/20 bg-brand-teal/5 cursor-default'
                : 'text-ink border-hairline hover:bg-surface-soft'
                }`}
            >
              {saved ? '✓ Saved' : 'Save to Profile'}
            </button>
            <button
              onClick={handleShare}
              className="bg-primary text-on-primary font-sans font-semibold text-button px-6 py-3 rounded-md hover:bg-primary-active transition-colors"
            >
              Share link ↗
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            {/* Gap Score */}
            <div className="mb-24">
              <span className="font-sans text-nav-link text-muted uppercase tracking-[0.06em] mb-6 block">Gap Score</span>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-display text-[96px] leading-none tracking-tight">{data.gap_score}</span>
                <span className="font-sans text-display-sm text-muted">/ 100</span>
              </div>
              <ProgressBar progress={data.gap_score} className="h-4" />
              <div className="flex justify-between mt-4">
                <span className="font-sans text-body-md font-medium">{data.gap_score}% match</span>
                <span className="font-sans text-body-sm text-muted">{gapPercent}% gap to close</span>
              </div>
            </div>

            {/* MVC Profile */}
            <div className="mb-24 pt-12 border-t border-hairline">
              <span className="font-sans text-nav-link text-muted uppercase tracking-[0.06em] mb-8 block">
                The {data.mvc_skills.length} core essentials
              </span>
              <div className="flex flex-wrap gap-3 mb-8">
                {data.mvc_skills.map((skill) => (
                  <Chip key={skill} variant="filled">{skill}</Chip>
                ))}
              </div>
              <p className="font-sans text-body-md text-muted max-w-md">
                These appear in 80%+ of similar job descriptions. Mastering these creates the strongest ROI for your career.
              </p>
            </div>

            {/* Skill Gap List */}
            <div className="mb-24 pt-12 border-t border-hairline">
              <div className="flex items-center justify-between mb-12">
                <span className="font-sans text-nav-link text-muted uppercase tracking-[0.06em]">
                  Prioritized Skill Gaps
                </span>
              </div>

              <GenerateAllButton
                isVisible={
                  (data.skill_gaps.filter(g => !data.generated_resources?.[g.skill]).length > 2) &&
                  !batchGenerating
                }
                isGenerating={batchGenerating}
                currentCount={batchProgress.current}
                totalCount={batchProgress.total}
                onGenerateAll={handleGenerateAll}
              />

              <div className="flex flex-col divide-y divide-hairline">
                <AnimatePresence initial={false}>
                  {(isListExpanded ? data.skill_gaps : data.skill_gaps.slice(0, 5)).map((gap, i) => {
                    const variants: Array<'pink' | 'teal' | 'lavender' | 'peach' | 'ochre' | 'cream'> = [
                      'pink', 'teal', 'lavender', 'peach', 'ochre', 'cream'
                    ];
                    const colorVariant = variants[i % variants.length];

                    return (
                      <motion.div
                        key={gap.skill}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: i * 0.1,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="py-8 tactile-row"
                      >
                        <SkillCard
                          gap={gap}
                          index={i}
                          analysisId={data.share_token}
                          role={data.role_label || 'Software Engineer'}
                          seniority="entry"
                          companyType={data.company_type}
                          initialResources={data.generated_resources?.[gap.skill]}
                          autoGenerate={i === 0 && gap.in_mvc}
                          colorVariant={colorVariant}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {data.skill_gaps.length > 5 && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setIsListExpanded(!isListExpanded)}
                    className="font-sans text-button text-muted hover:text-ink transition-colors px-6 py-2 border border-hairline rounded-md hover:bg-surface-soft"
                  >
                    {isListExpanded ? 'View less' : `View ${data.skill_gaps.length - 5} more skills`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Learning Plan */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 p-10 rounded-xl bg-surface-soft border border-hairline">
              {!data.learning_plan?.weeks?.length ? (
                <div className="text-center py-8">
                  <h3 className="font-display text-title-lg mb-6">Build your custom path</h3>
                  <p className="font-sans text-body-md text-muted mb-10">
                    Generate a 12-week blueprint with curated resources, skip-notes, and target projects.
                  </p>
                  <button
                    onClick={handleGeneratePlan}
                    disabled={generatingPlan}
                    className="w-full bg-primary text-on-primary font-sans font-semibold text-button py-4 rounded-md hover:bg-primary-active transition-all disabled:opacity-50"
                  >
                    {generatingPlan ? 'Generating...' : 'Create Learning Plan'}
                  </button>
                </div>
              ) : (
                <div>
                  <span className="font-sans text-nav-link text-muted uppercase tracking-[0.06em] mb-10 block">Weekly Roadmap</span>
                  <div className="space-y-2">
                    {(isPlanExpanded ? data.learning_plan.weeks : data.learning_plan.weeks.slice(0, 8)).map((week: any, wi: number) => {
                      const resources = week.resources || [{
                        title: week.title || week.resource_title || week.skill,
                        url: week.url || week.resource_url || '',
                        start_at: week.start_at,
                        skip_note: week.skip_note,
                        project: week.project,
                        why: week.why || week.project_why,
                      }];

                      return (
                        <motion.div
                          key={`week-${wi}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: wi * 0.05 }}
                        >
                          <Accordion title={`Week ${week.week}: ${week.skill}`}>
                            <div className="space-y-6 pt-4">
                              {resources.map((resource: any, ri: number) => (
                                <div key={ri} className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-sans font-semibold text-body-md">{resource.title}</h5>
                                    {resource.url && (
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-sans text-body-sm">
                                        View ↗
                                      </a>
                                    )}
                                  </div>

                                  {resource.project && (
                                    <div className="p-4 bg-canvas rounded-md border border-hairline">
                                      <span className="font-sans text-nav-link text-muted uppercase text-[10px] block mb-1">Build</span>
                                      <p className="font-sans text-body-sm">{resource.project}</p>
                                    </div>
                                  )}

                                  {(resource.start_at || resource.skip_note) && (
                                    <div className="flex gap-4 font-sans text-[12px] text-muted">
                                      {resource.start_at && <span>Start: {resource.start_at}</span>}
                                      {resource.skip_note && <span>Skip: {resource.skip_note}</span>}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Accordion>
                        </motion.div>
                      );
                    })}
                  </div>

                  {data.learning_plan.weeks.length > 8 && (
                    <button
                      onClick={() => setIsPlanExpanded(!isPlanExpanded)}
                      className="w-full mt-8 font-sans text-button text-muted hover:text-ink text-center"
                    >
                      {isPlanExpanded ? 'Show less' : 'View full 12-week roadmap'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
