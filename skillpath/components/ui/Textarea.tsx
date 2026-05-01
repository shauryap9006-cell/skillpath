import React from 'react';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full min-h-[240px] border border-white/20 rounded-xl p-6 font-mono text-sm bg-white/5 backdrop-blur-md text-white resize-y focus:outline-none focus:border-blue-500 focus:bg-white/10 placeholder:text-gray-400 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
