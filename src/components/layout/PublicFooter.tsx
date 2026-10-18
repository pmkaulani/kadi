import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ArrowUpRight } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#16272F] text-[#F8FAFC] pt-16 pb-8 border-t border-white/[0.08]">
      <div className="kadi-container max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-14">
          <div className="md:col-span-5">
            <Logo size="lg" variant="monochrome" className="text-[#F8FAFC]" />
            <p className="font-serif text-2xl md:text-3xl leading-tight tracking-[-.035em] max-w-sm mt-7 text-white">
              A good invitation makes people feel expected.
            </p>
            <p className="text-sm text-slate-300 mt-4 max-w-sm leading-7">
              Thoughtful digital stationery invitations for the moments that bring us together — made for Kenya, shared anywhere in the world.
            </p>
          </div>
          <div className="md:col-span-2 md:col-start-7">
            <p className="kadi-eyebrow text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-5">Explore</p>
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <Link href="/templates" className="hover:text-white transition-colors">Invitation designs</Link>
              <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQs</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="kadi-eyebrow text-[#D4AF37] font-semibold tracking-widest uppercase text-xs mb-5">A little help</p>
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <Link href="/about" className="hover:text-white transition-colors">About Kadi</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
              <Link href="/data-protection" className="hover:text-white transition-colors">Data protection</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Kadi. Made with care in Nairobi, Kenya.</span>
          <Link href="/templates" className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors">
            Make something personal <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
