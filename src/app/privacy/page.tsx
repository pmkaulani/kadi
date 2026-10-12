import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-charcoal mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-brand-slate mb-8">Last Updated: October 2026</p>

        <div className="space-y-8 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold mb-2">1. Overview</h2>
            <p className="text-brand-slate">
              Kadi (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) provides digital event invitation and RSVP management software. This Privacy Policy outlines our standards for collecting, processing, and safeguarding personal data in compliance with the Kenya Data Protection Act 2019.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold mb-2">2. Information We Collect</h2>
            <p className="text-brand-slate mb-2">
              <strong>Host Information:</strong> Account email, name, event details (date, venue, host names, timeline), and uploaded media.
            </p>
            <p className="text-brand-slate">
              <strong>Guest Information:</strong> Names and phone/email addresses provided by hosts or entered during RSVP, attendance responses, dietary requirements, and optional tribute notes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold mb-2">3. How We Use Information</h2>
            <p className="text-brand-slate">
              We process personal data solely to render digital invitations, deliver RSVP confirmations to hosts, and enable direct event-day communication. We do not sell personal data, monetize guest lists, or serve behavioral advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold mb-2">4. Data Retention</h2>
            <p className="text-brand-slate">
              Event data is maintained for the lifecycle of the event and may be archived or permanently purged by the host from the settings dashboard at any time.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
