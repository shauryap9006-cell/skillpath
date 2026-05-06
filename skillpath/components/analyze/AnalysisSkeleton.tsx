import React from 'react';
import { motion } from 'framer-motion';

export function AnalysisSkeleton() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-8 lg:px-24 pt-24 animate-pulse relative z-10">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-hairline pb-16 gap-8">
        <div className="max-w-2xl space-y-6">
          <div className="h-4 w-32 bg-ink/10 rounded-full" />
          <div className="h-16 w-full max-w-md bg-ink/5 rounded-2xl" />
          <div className="h-6 w-64 bg-ink/5 rounded-full" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-ink/5 rounded-md border border-hairline" />
          <div className="h-12 w-32 bg-ink/5 rounded-md border border-hairline" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-24">
          {/* Readiness Score Skeleton */}
          <div className="flex items-center gap-12">
            <div className="w-32 h-32 rounded-full border-8 border-ink/5" />
            <div className="flex-1 space-y-4">
              <div className="h-4 w-24 bg-ink/10 rounded-full" />
              <div className="h-24 w-48 bg-ink/5 rounded-2xl" />
              <div className="h-4 w-full bg-ink/5 rounded-full" />
            </div>
          </div>

          {/* MVC Profile Skeleton */}
          <div className="space-y-6">
             <div className="h-4 w-48 bg-ink/10 rounded-full" />
             <div className="flex gap-2">
                {[1,2,3,4].map(i => <div key={i} className="h-8 w-20 bg-ink/5 rounded-full border border-hairline" />)}
             </div>
          </div>

          {/* Skill List Skeleton */}
          <div className="space-y-8">
            <div className="h-4 w-48 bg-ink/10 rounded-full" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-3xl border border-hairline bg-surface-soft/50 space-y-4 shadow-sm">
                <div className="flex justify-between">
                  <div className="h-6 w-32 bg-ink/10 rounded-full" />
                  <div className="h-6 w-16 bg-ink/5 rounded-full" />
                </div>
                <div className="h-4 w-full bg-ink/5 rounded-full" />
                <div className="h-4 w-2/3 bg-ink/5 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-5 space-y-8">
          <div className="h-[200px] w-full rounded-3xl bg-surface-card border border-hairline shadow-sm" />
          <div className="h-[400px] w-full rounded-3xl bg-surface-card border border-hairline shadow-sm" />
        </div>
      </div>
    </div>
  );
}
