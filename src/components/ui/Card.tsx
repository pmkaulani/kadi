import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'paper';
}

export function Card({
  children,
  className = '',
  variant = 'default',
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white border border-[rgba(29,29,31,0.08)] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.045)]',
    elevated: 'bg-white border border-[rgba(29,29,31,0.08)] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
    bordered: 'bg-[#FAFAF7] border border-[rgba(29,29,31,0.12)] rounded-2xl',
    paper: 'bg-[#FBF8F1] border border-[rgba(185,154,98,0.25)] rounded-2xl shadow-sm',
  };

  return (
    <div className={`${variants[variant]} p-5 sm:p-6 transition-all duration-200 ${className}`} {...props}>
      {children}
    </div>
  );
}
