import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-charcoal mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-brand-slate mb-8">Last Updated: October 2026</p>

        <div className="space-y-8 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold mb-2">1. Agreement to Terms</h2>
            <p className="text-brand-slate">
              By using Kadi, you agree to these Terms. You confirm that you have the right to upload any guest details and media associated with your event.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold mb-2">2. Permitted Use & Host Responsibilities</h2>
            <p className="text-brand-slate">
              Hosts must not use the platform for fraudulent events, unsolicited marketing spam, defamatory tributes, or illegal content. Hosts must secure appropriate consent before uploading guest contact information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold mb-2">3. Financial Contributions Disclaimer</h2>
            <p className="text-brand-slate">
              Kadi provides tools for displaying host-provided payment instructions (such as M-Pesa Till or Paybill numbers). Kadi does not intermediate, hold, escrow, or guarantee transactions between guests and hosts.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
