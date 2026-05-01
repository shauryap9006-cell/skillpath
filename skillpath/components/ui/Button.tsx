import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', children, ...props }, ref) => {
    const baseClass = "px-7 py-3 font-mono text-[14px] font-medium tracking-[0.04em] uppercase transition-all disabled:opacity-35 disabled:cursor-not-allowed";
    const primaryClass = "bg-primary text-on-primary border border-hairline hover:opacity-80";
    const ghostClass = "bg-transparent text-black border border-hairline hover:bg-surface";

    const combinedClass = `${baseClass} ${variant === 'primary' ? primaryClass : ghostClass} ${className}`;

    return (
      <button ref={ref} className={combinedClass} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
