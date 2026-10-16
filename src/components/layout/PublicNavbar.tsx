'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export function PublicNavbar({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = [
    { href: '/templates', label: 'The invitations' },
    { href: '/discover', label: 'Discover' },
    { href: '/how-it-works', label: 'How it opens' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const headerClassName = variant === 'hero'
    ? 'kadi-public-navbar kadi-public-navbar--hero relative z-50'
    : 'kadi-public-navbar relative z-50 bg-[#F6F2EA] border-b border-[rgba(39,38,32,.15)]';

  const isHero = variant === 'hero';

  return (
    <header className={headerClassName}>
      <div className="kadi-container h-[82px] flex items-center justify-between">
        <Link href="/" className="shrink-0" aria-label="Kadi home">
          <Logo size="md" variant={isHero ? 'monochrome' : 'full'} />
        </Link>

        <nav className={`hidden lg:flex items-center gap-9 text-[13px] ${isHero ? 'text-[#e5e3dc]' : 'text-[#5E594F]'}`}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#b99a62] transition-colors">
              {item.label}
            </Link>
          ))}
          <Link href="/faq" className="hover:text-[#b99a62] transition-colors">Questions</Link>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className={`text-[13px] ${isHero ? 'text-[#fffdf8]' : 'text-[#272620]'} hover:text-[#b99a62] transition-colors`}>Sign in</Link>
          <Link href="/templates" className="kadi-button">
            Create an invitation <ArrowUpRight size={15} strokeWidth={1.7} />
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 ${isHero ? 'text-[#fffdf8]' : 'text-[#272620]'}`}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={23} strokeWidth={1.5} /> : <Menu size={23} strokeWidth={1.5} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 ${isHero ? 'bg-[#171916] text-[#f6f2eb]' : 'bg-[#F6F2EA] text-[#272620]'} border-b border-[rgba(39,38,32,.15)] px-5 py-6 shadow-lg z-50`}>
          <nav className="flex flex-col">
            {links.concat([{ href: '/faq', label: 'Questions' }]).map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 text-[15px] ${index ? 'border-t border-[rgba(39,38,32,.12)]' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5 mt-5 pt-5 border-t border-[rgba(39,38,32,.12)]">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm">Sign in</Link>
            <Link href="/templates" onClick={() => setMobileMenuOpen(false)} className="kadi-button">Create an invitation <ArrowUpRight size={15} /></Link>
          </div>
        </div>
      )}
    </header>
  );
}
