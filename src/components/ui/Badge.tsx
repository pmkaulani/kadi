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
    default: 'bg-[#F2F1EC] text-[#6E6E73] border border-[rgba(29,29,31,0.08)]',
    success: 'bg-[#EBF4EF] text-[#286A4B] border border-[#286A4B]/20',
    warning: 'bg-[#FBF4EA] text-[#8A5A17] border border-[#8A5A17]/20',
    error: 'bg-[#FDF0EF] text-[#B3261E] border border-[#B3261E]/20',
    purple: 'bg-[#F3EAE2] text-[#794A32] border border-[#794A32]/20',
    gold: 'bg-[#F4EDDF] text-[#785F2E] border border-[#B99A62]/30',
    rose: 'bg-[#F4E7E3] text-[#A94F51] border border-[#A94F51]/20',
    sage: 'bg-[#E9EBDD] text-[#555C46] border border-[#747D62]/25',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-[11px] px-3 py-1 rounded-full font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 uppercase tracking-[0.08em] ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
