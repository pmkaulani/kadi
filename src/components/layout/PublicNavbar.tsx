'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group py-2">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-slate">
          <Link
            href="/templates"
            className="hover:text-brand-purple transition-colors flex items-center gap-1.5"
          >
            <span>Templates</span>
            <span className="text-[10px] bg-brand-purple-light text-brand-purple font-semibold px-2 py-0.5 rounded-full">
              New
            </span>
          </Link>
          <Link href="/how-it-works" className="hover:text-brand-purple transition-colors">
            How It Works
          </Link>
          <Link href="/pricing" className="hover:text-brand-purple transition-colors">
            Pricing
          </Link>
          <Link href="/faq" className="hover:text-brand-purple transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/templates">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Create Invitation
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-brand-slate hover:text-brand-charcoal rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 text-base font-medium text-brand-charcoal">
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Browse Templates</span>
              <Sparkles className="w-4 h-4 text-brand-gold" />
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              FAQ
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="secondary" size="md" className="w-full">
                Host Sign In
              </Button>
            </Link>
            <Link href="/templates" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" size="md" className="w-full">
                Create My Invitation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
