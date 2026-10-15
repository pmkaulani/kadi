import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ArrowUpRight } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#272620] text-[#F6F2EA] pt-16 pb-7">
      <div className="kadi-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-14">
          <div className="md:col-span-5">
            <Logo size="lg" variant="monochrome" className="text-[#F6F2EA]" />
            <p className="font-serif text-2xl md:text-3xl leading-tight tracking-[-.035em] max-w-sm mt-7">
              A good invitation makes people feel expected.
            </p>
            <p className="text-sm text-[#C8C1B5] mt-4 max-w-sm leading-7">
              Thoughtful digital invitations for the moments that bring us together — made for Kenya, shared anywhere.
            </p>
          </div>
          <div className="md:col-span-2 md:col-start-7">
            <p className="kadi-eyebrow text-[#B99A62] mb-5">Explore</p>
            <div className="flex flex-col gap-3 text-sm text-[#DDD5C8]">
              <Link href="/templates" className="hover:text-white">Invitation designs</Link>
              <Link href="/how-it-works" className="hover:text-white">How it works</Link>
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
              <Link href="/faq" className="hover:text-white">FAQs</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="kadi-eyebrow text-[#B99A62] mb-5">A little help</p>
            <div className="flex flex-col gap-3 text-sm text-[#DDD5C8]">
              <Link href="/about" className="hover:text-white">About Kadi</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/data-protection" className="hover:text-white">Data protection</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 pt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[11px] text-[#BEB6A9]">
          <span>© {new Date().getFullYear()} Kadi Studio. Made with care in Kenya.</span>
          <Link href="/templates" className="inline-flex items-center gap-1.5 hover:text-white">Make something personal <ArrowUpRight size={13} /></Link>
        </div>
      </div>
    </footer>
  );
}
