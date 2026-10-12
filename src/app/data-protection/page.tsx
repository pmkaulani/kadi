import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, UserX, FileText } from 'lucide-react';

export default function DataProtectionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="purple" size="sm">
            Regulatory Compliance
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-charcoal mt-3">
            Kenya Data Protection Act, 2019
          </h1>
          <p className="text-sm text-brand-slate mt-3 leading-relaxed">
            Our operational commitment to data privacy, statutory compliance, and Office of the Data Protection Commissioner (ODPC) guidelines.
          </p>
        </div>

        <div className="space-y-10 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
          <section className="p-6 rounded-2xl bg-brand-mist border border-slate-200">
            <h2 className="text-lg font-serif font-bold mb-2 flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Controller & Processor Boundaries</span>
            </h2>
            <p className="text-brand-slate leading-relaxed">
              Under the Kenya Data Protection Act (KDPA) 2019, the <strong>Host</strong> who creates an event and uploads guest contact information acts as the Data Controller. Kadi acts as the Data Processor, providing the technical platform solely to generate and deliver the invitation and record RSVP responses.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-base font-serif font-bold">1. Lawful Basis and Purpose Limitation</h3>
            <p className="text-brand-slate leading-relaxed">
              Guest phone numbers and email addresses uploaded to Kadi are processed strictly for the singular purpose of invitation delivery and RSVP coordination for that specific event. We do not aggregate guest contact books, sell data to third parties, or use uploaded numbers for marketing broadcasts.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-base font-serif font-bold">2. Protection of Children&apos;s Data</h3>
            <p className="text-brand-slate leading-relaxed">
              In accordance with Section 33 of the KDPA 2019, processing of personal data relating to children requires parental or legal guardian consent. For baby showers, first birthdays, or baptisms, Kadi minimizes child-identifying information, prohibits public indexing, and provides private guest tokens accessible only to intended family members.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-base font-serif font-bold">3. Data Subject Rights (Access, Correction, Erasure)</h3>
            <p className="text-brand-slate leading-relaxed">
              Guests and hosts may exercise their statutory rights at any time:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-slate">
              <li><strong>Right of Access:</strong> Hosts may download their complete guest and RSVP database as a clean CSV or JSON export at any time.</li>
              <li><strong>Right to Rectification:</strong> Guests can reopen their private invitation link to update meal choices, attendance count, or note to the host.</li>
              <li><strong>Right to Erasure:</strong> Hosts can delete events, guest records, and media assets. Deletion securely purges tokens and contact information across the platform within 30 days.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-base font-serif font-bold">4. Cryptographic Token Protection</h3>
            <p className="text-brand-slate leading-relaxed">
              Guest invitation links employ high-entropy cryptographic random tokens (256-bit entropy). Tokens are never exposed to public search crawlers, web analytics platforms, or other guests.
            </p>
          </section>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-brand-slate">
            For specific privacy inquiries or Data Protection Officer contact, write to{' '}
            <strong className="text-brand-charcoal">dpo@kadi.co.ke</strong>.
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
