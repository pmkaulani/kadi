import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export interface RetryPanelProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  retryLabel?: string;
  backLabel?: string;
  isRetrying?: boolean;
  className?: string;
}

export function RetryPanel({
  title = 'Unable to Load Data',
  message = "We couldn't retrieve the latest information right now. Your saved records are completely secure.",
  onRetry,
  onBack,
  retryLabel = 'Try Again',
  backLabel = 'Go Back',
  isRetrying = false,
  className = '',
}: RetryPanelProps) {
  return (
    <div
      role="region"
      aria-label="Error recovery panel"
      className={`p-6 sm:p-8 rounded-2xl bg-[#FCFAF6] border border-[#B99A62]/30 shadow-sm text-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-600/20 text-[#934638] flex items-center justify-center mb-3.5">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <h3 className="font-serif text-lg font-medium text-[#272620] tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-[#756F64] leading-relaxed max-w-sm mx-auto mb-6">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            {backLabel}
          </Button>
        )}
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />}
          >
            {isRetrying ? 'Retrying...' : retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
