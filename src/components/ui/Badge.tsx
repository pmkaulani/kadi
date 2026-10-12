import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'purple' | 'gold' | 'rose' | 'sage';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-brand-slate border border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    error: 'bg-rose-50 text-rose-800 border border-rose-200',
    purple: 'bg-brand-purple-light text-brand-purple border border-brand-purple/20',
    gold: 'bg-brand-gold-light text-amber-900 border border-brand-gold/30',
    rose: 'bg-event-rose-light text-event-rose border border-event-rose/20',
    sage: 'bg-event-sage-light text-event-sage border border-event-sage/20',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
