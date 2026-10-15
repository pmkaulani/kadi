import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ArrowLeft, Compass, Home } from 'lucide-react';

export default function GlobalNotFound() {
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
        <p className="kadi-eyebrow text-[#934638] mb-4">404 · Page Not Found</p>
        <h1 className="font-serif text-5xl sm:text-6xl text-[#272620] leading-tight tracking-[-0.035em] mb-4">
          This stationery has moved.
        </h1>
        <p className="text-sm sm:text-base text-[#756F64] leading-relaxed mb-8 max-w-md mx-auto">
          The page or invitation link you requested may have been archived, updated with a new address, or never folded.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/templates" className="kadi-button w-full sm:w-auto">
            <Compass size={15} />
            <span>Explore Invitations</span>
          </Link>
          <Link
            href="/"
            className="kadi-button kadi-button--quiet w-full sm:w-auto"
          >
            <ArrowLeft size={15} />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-[#8D867A] pt-8 border-t border-[rgba(39,38,32,0.12)]">
        <p>© {new Date().getFullYear()} Kadi Studio · Thoughtful digital invitations</p>
      </footer>
    </div>
  );
}
