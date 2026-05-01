import React from 'react';
import { Building2, Rocket } from 'lucide-react';

export function CalibrationTable() {
  const comparison = [
    {
      skill: "Product Direction",
      startup: "High ambiguity; you define the 'What'",
      enterprise: "Clear roadmap; you execute the 'How'",
    },
    {
      skill: "Tech Stack",
      startup: "Bleeding edge; high velocity",
      enterprise: "Stable; legacy-conscious; high scale",
    },
    {
      skill: "Role Scope",
      startup: "Generalist; 'Wear many hats'",
      enterprise: "Specialist; Deep domain expertise",
    },
    {
      skill: "Decision Speed",
      startup: "Minutes; direct to Founder",
      enterprise: "Weeks; multi-level stakeholders",
    }
  ];

  return (
    <section className="bg-canvas py-section px-8 lg:px-24 flex justify-center">
      <div className="max-w-[1280px] w-full">
        <div className="text-center mb-16">
          <span className="font-sans text-caption-uppercase text-muted mb-4 block uppercase">Company Calibration</span>
          <h2 className="font-display text-display-sm lg:text-display-md text-ink mb-4">One role. Two worlds.</h2>
          <p className="font-sans text-body-md text-body max-w-xl mx-auto">See how we calibrate your "Software Engineer" profile differently based on where you're applying.</p>
        </div>

        <div className="rounded-xl border border-ink/15 bg-canvas overflow-hidden shadow-sm tactile-table">
          <div className="grid grid-cols-3 bg-surface-strong border-b border-ink/15 font-sans text-caption-uppercase text-ink/60 font-semibold tracking-wider">
            <div className="p-lg border-r border-ink/15">Focus Area</div>
            <div className="p-lg border-r border-ink/15 flex items-center gap-2 text-ink">
              <Rocket className="w-4 h-4" /> Early Startup
            </div>
            <div className="p-lg flex items-center gap-2 text-ink">
              <Building2 className="w-4 h-4" /> Fortune 500
            </div>
          </div>

          {comparison.map((item, i) => (
            <div key={i} className="grid grid-cols-3 border-b border-ink/10 last:border-0 hover:bg-surface-soft transition-colors">
              <div className="p-lg border-r border-ink/10 font-display text-title-sm text-ink">
                {item.skill}
              </div>
              <div className="p-lg border-r border-ink/10 font-sans text-body-md text-ink/80 leading-relaxed">
                {item.startup}
              </div>
              <div className="p-lg font-sans text-body-md text-ink/80 leading-relaxed">
                {item.enterprise}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
