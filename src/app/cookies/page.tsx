import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-charcoal mb-4">
          Cookie & Local Storage Policy
        </h1>
        <p className="text-xs text-brand-slate mb-8">Last Updated: October 2026</p>

        <div className="space-y-6 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
          <p className="text-brand-slate">
            Kadi utilizes essential session cookies and local storage tokens strictly necessary to maintain host authentication, remember theme preferences, and store draft design state in the browser.
          </p>
          <p className="text-brand-slate">
            We do NOT install third-party tracking cookies or cross-site advertising beacons.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
