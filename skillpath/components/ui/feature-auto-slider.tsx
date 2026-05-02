import React, { memo, useMemo } from "react";
import { Brain, Target, Map, Building, Clock } from "lucide-react";
import { motion } from "framer-motion";


type Feature = {
  icon: React.ReactElement;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: <Brain className="w-6 h-6 text-primary" />,
    title: "Instant Profile Analysis",
    description:
      "Upload your resume and get a gap score against real‑world job descriptions.",
  },
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: "The 80/20 Curriculum",
    description:
      "Learn only the high‑impact skills that appear in 80% of top‑tier company JDs.",
  },
  {
    icon: <Map className="w-6 h-6 text-primary" />,
    title: "Custom Learning Roadmap",
    description:
      "Generate a week‑by‑week plan with curated resources and skipped content.",
  },
  {
    icon: <Building className="w-6 h-6 text-primary" />,
    title: "Company Calibration",
    description:
      "Tailor your prep for Startups, Scale‑ups, or Enterprise environments.",
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: "Time‑to‑Ready Countdown",
    description:
      "Stop guessing. Get a precise date for when you’ll be interview‑ready.",
  },
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: "Multi‑Role Intelligence",
    description:
      "Support for 30+ career paths, from DevOps to AI Research and Finance.",
  },
];

const FeatureCard = memo(({ feature }: { feature: Feature }) => {
  // Force the icon size we want without altering the original component
  const icon = React.cloneElement(feature.icon as React.ReactElement<{ className?: string }>, {
    className: "w-7 h-7 text-primary",
  });

  return (
    <motion.div
      whileHover={{ y: -8 }}                     // only a transform → GPU fast
      transition={{ type: "tween", ease: "easeOut", duration: 0.12 }}
      className={`
        flex-shrink-0 w-[320px] p-xl rounded-[32px] border border-hairline
        bg-surface-card hover:bg-surface-soft transition-colors
        flex flex-col tactile-card cursor-pointer group
        shadow-sm hover:shadow-xl transition-shadow
        will-change-transform contain
      `}
    >
      {/* Icon container – unchanged from the original layout */}
      <div className="mb-lg w-14 h-14 rounded-2xl bg-canvas flex items-center justify-center shadow-inner">
        {icon}
      </div>

      <h3 className="font-display text-title-md text-ink mb-3">
        {feature.title}
      </h3>

      <p className="font-sans text-body-sm text-muted leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

export const FeatureAutoSlider = ({ className }: { className?: string }) => {
  // Duplicate the list so the scrolling feels truly endless
  const items = useMemo(() => [...FEATURES, ...FEATURES], []);

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .infinite-scroll {
          animation: scroll-right 40s linear infinite;
          will-change: transform;
        }
      `}</style>

      <section id="features" className={`bg-canvas py-section overflow-hidden ${className || ''}`}>
        {/* Header */}
        <div className="container mx-auto px-8 lg:px-16 mb-16 text-center">
          <span className="font-sans text-caption-uppercase text-muted mb-4 block uppercase">
            Core Features
          </span>
          <h2 className="font-display text-display-md lg:text-display-lg text-ink">
            Everything you need to land the job.
          </h2>
        </div>
        <div className="relative w-full flex items-center scroll-container overflow-hidden">
          <div className="infinite-scroll flex gap-lg px-lg py-12">
            {items.map((feature, i) => (
              <FeatureCard key={i} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
