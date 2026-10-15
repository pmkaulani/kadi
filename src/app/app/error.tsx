'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Workspace route error:', error);
  }, [error]);

  return (
    <div className="p-6 sm:p-12 max-w-xl mx-auto my-auto text-center">
      <div className="w-12 h-12 rounded-full bg-[#934638]/10 text-[#934638] flex items-center justify-center mx-auto mb-5">
        <AlertTriangle size={24} strokeWidth={1.75} />
      </div>

      <p className="kadi-eyebrow text-[#934638] mb-2">Workspace Error</p>
      <h1 className="font-serif text-3xl sm:text-4xl text-[#272620] mb-3">
        Could not load workspace view.
      </h1>
      <p className="text-xs sm:text-sm text-[#756F64] leading-relaxed mb-6">
        An error prevented this section of your studio from loading. Your draft designs and guest records remain safe in storage.
      </p>

      {error.digest && (
        <p className="text-[11px] text-[#8D867A] font-mono mb-6 bg-black/5 py-1 px-3 rounded inline-block">
          Error Reference: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="kadi-button w-full sm:w-auto"
        >
          <RotateCcw size={14} />
          <span>Reload section</span>
        </button>
        <Link
          href="/app/events"
          className="kadi-button kadi-button--quiet w-full sm:w-auto"
        >
          <ArrowLeft size={14} />
          <span>Back to dashboard</span>
        </Link>
      </div>
    </div>
  );
}
