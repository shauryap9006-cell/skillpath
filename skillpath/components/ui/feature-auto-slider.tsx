import React from 'react';
import { Brain, Target, Map, Building, Clock } from 'lucide-react';

export const FeatureAutoSlider = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "Instant Profile Analysis",
      description: "Upload your resume and get a gap score against real-world job descriptions."
    },
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "The 80/20 Curriculum",
      description: "Learn only the high-impact skills that appear in 80% of top-tier company JDs."
    },
    {
      icon: <Map className="w-6 h-6 text-primary" />,
      title: "Custom Learning Roadmap",
      description: "Generate a week-by-week plan with curated resources and skipped content."
    },
    {
      icon: <Building className="w-6 h-6 text-primary" />,
      title: "Company Calibration",
      description: "Tailor your prep for Startups, Scale-ups, or Enterprise environments."
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Time-to-Ready Countdown",
      description: "Stop guessing. Get a precise date for when you'll be interview-ready."
    },
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "Multi-Role Intelligence",
      description: "Support for 30+ career paths, from DevOps to AI Research and Finance."
    }
  ];

  const duplicatedFeatures = [...features, ...features];

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .infinite-scroll {
          animation: scroll-right 40s linear infinite;
        }
      `}</style>
      
      <section id="features" className="bg-canvas py-section overflow-hidden">
        <div className="container mx-auto px-8 lg:px-16 mb-16 text-center">
          <span className="font-sans text-caption-uppercase text-muted mb-4 block uppercase">Core Features</span>
          <h2 className="font-display text-display-md lg:text-display-lg text-ink">Everything you need to land the job.</h2>
        </div>

        <div className="relative w-full flex items-center scroll-container overflow-hidden">
          <div className="infinite-scroll flex gap-lg px-lg">
            {duplicatedFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] p-lg rounded-lg border border-hairline bg-surface-card hover:bg-surface-soft transition-all flex flex-col tactile-card"
              >
                <div className="mb-lg w-12 h-12 rounded-md bg-surface-card flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-display text-title-md text-ink mb-2">{feature.title}</h3>
                <p className="font-sans text-body-sm text-body leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
