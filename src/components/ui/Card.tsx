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
    default: 'bg-white rounded-2xl border border-slate-200/80 shadow-sm',
    elevated: 'bg-white rounded-2xl shadow-xl shadow-brand-charcoal/5 border border-slate-100',
    bordered: 'bg-white rounded-2xl border-2 border-slate-200',
    paper: 'bg-paper-grain rounded-2xl border border-amber-900/10 shadow-lg shadow-brand-charcoal/5',
  };

  return (
    <div className={`${variants[variant]} p-6 transition-all duration-200 ${className}`} {...props}>
      {children}
    </div>
  );
}
