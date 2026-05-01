import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateAllButtonProps {
  onGenerateAll: () => void;
  isGenerating: boolean;
  currentCount: number;
  totalCount: number;
  isVisible: boolean;
}

export const GenerateAllButton: React.FC<GenerateAllButtonProps> = ({
  onGenerateAll,
  isGenerating,
  currentCount,
  totalCount,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-center mb-12">
      <button
        onClick={onGenerateAll}
        disabled={isGenerating}
        className={`
          group relative flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 
          hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300
          disabled:opacity-70 disabled:cursor-wait
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="text-blue-400 animate-spin" />
            <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">
              Generating {currentCount} of {totalCount}...
            </span>
          </>
        ) : (
          <>
            <Sparkles size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
            <span className="font-mono text-xs text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">
              Generate all remaining resources →
            </span>
          </>
        )}
      </button>
    </div>
  );
};
