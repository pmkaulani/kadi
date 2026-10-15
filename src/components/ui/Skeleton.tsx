import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-[#E8E6DF] dark:bg-neutral-800';

  const variantClasses = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full shrink-0',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl h-48 w-full border border-[rgba(29,29,31,0.06)]',
  };

  const inlineStyles: React.CSSProperties = {
    width: width,
    height: height,
    ...style,
  };

  return (
    <div
      aria-hidden="true"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={inlineStyles}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3" aria-label="Loading content" aria-busy="true">
      <div className="flex gap-4 pb-2 border-b border-[rgba(29,29,31,0.08)]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`th-${i}`} variant="text" className="h-3.5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`tr-${r}`} className="flex gap-4 py-2 border-b border-[rgba(29,29,31,0.04)] items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={`td-${r}-${c}`} variant="text" className={`h-4 ${c === 0 ? 'flex-[1.5]' : 'flex-1'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
