'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { RotateCcw, Home, AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client exceptions
    console.error('Kadi application error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#272620] flex flex-col justify-between p-6 sm:p-12 selection:bg-[#934638] selection:text-white">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Kadi home">
          <Logo size="md" />
        </Link>
        <Link
          href="/"
          className="text-xs font-medium text-[#756F64] hover:text-[#934638] inline-flex items-center gap-1.5 transition-colors"
        >
          <Home size={14} />
          <span>Home</span>
        </Link>
      </header>

      <main className="max-w-xl mx-auto my-auto py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#934638]/10 text-[#934638] flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={24} strokeWidth={1.75} />
        </div>

        <p className="kadi-eyebrow text-[#934638] mb-3">Notice · Unexpected Error</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#272620] leading-tight tracking-[-0.035em] mb-4">
          Something went adrift.
        </h1>
        <p className="text-sm sm:text-base text-[#756F64] leading-relaxed mb-8 max-w-md mx-auto">
          An unexpected interruption occurred while preparing this view. You can reload this step safely or return to the main hall.
        </p>

        {error.digest && (
          <p className="text-[11px] text-[#8D867A] font-mono mb-6 bg-black/5 py-1 px-3 rounded inline-block">
            Reference code: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="kadi-button w-full sm:w-auto"
          >
            <RotateCcw size={15} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="kadi-button kadi-button--quiet w-full sm:w-auto"
          >
            <Home size={15} />
            <span>Back to Safety</span>
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-[#8D867A] pt-8 border-t border-[rgba(39,38,32,0.12)]">
        <p>© {new Date().getFullYear()} Kadi Studio · Handcrafted digital stationery</p>
      </footer>
    </div>
  );
}
