import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-[rgba(29,29,31,0.08)] shadow-sm max-w-lg mx-auto ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#F3EAE2] text-[#794A32] flex items-center justify-center mb-4 shadow-sm">
          <Icon size={26} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-serif text-lg font-bold text-[#1D1D1F] tracking-tight">{title}</h3>
      <p className="text-sm text-[#6E6E73] mt-1.5 mb-6 max-w-sm leading-relaxed">{description}</p>
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {secondaryAction && (
            secondaryAction.href ? (
              <a
                href={secondaryAction.href}
                className="min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#1D1D1F] bg-[#F2F1EC] hover:bg-[#E5E4DE] rounded-xl transition-colors"
              >
                {secondaryAction.label}
              </a>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )
          )}
          {primaryAction && (
            primaryAction.href ? (
              <a
                href={primaryAction.href}
                className="min-h-[44px] inline-flex items-center justify-center px-5 py-2 text-xs font-semibold text-white bg-[#794A32] hover:bg-[#663C28] rounded-xl shadow-sm transition-colors"
              >
                {primaryAction.label}
              </a>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
