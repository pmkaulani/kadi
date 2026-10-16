import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InlineErrorProps {
  id?: string;
  message?: string | null;
  className?: string;
}

export function InlineError({ id, message, className = '' }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-1.5 mt-1.5 text-xs text-[#B3261E] font-medium animate-in fade-in duration-150 ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
