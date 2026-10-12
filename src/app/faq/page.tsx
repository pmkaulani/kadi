'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'Do guests need to download an app or create a Kadi account?',
    a: 'No. Guests simply open the secure web link you share with them on any smartphone or computer browser. The animation runs instantly, and they can RSVP in seconds without signing up.',
  },
  {
    q: 'Can I invite a family or couple together under one link?',
    a: 'Yes. Kadi uses a household and attendee model. You can invite "The Wanjiku Family" or "Dr. Peter & Guest", specify the maximum allowed headcount (e.g. 2, 4, or 5), and guests RSVP for their party with individual dietary requirements.',
  },
  {
    q: 'How does WhatsApp sharing work?',
    a: 'You can tap "Share to WhatsApp" from your host dashboard, which automatically opens WhatsApp on your phone with a friendly personalized message and your invitation link ready to send to your contacts.',
  },
  {
    q: 'Can guests send M-Pesa gifts directly to me?',
    a: 'Yes. In your design editor, you can provide your own M-Pesa Paybill, Till Number (Buy Goods), or phone number with clear reference instructions. Kadi displays convenient copy-to-clipboard buttons so guests send gifts directly to your own account with zero intermediary deductions.',
  },
  {
    q: 'What if an elderly guest has a slow internet connection or prefers no animation?',
    a: 'Kadi features an immediate "Skip to Details" button on the envelope, and automatically honors device settings for reduced motion (`prefers-reduced-motion`). Essential date, time, venue, and RSVP details are immediately accessible regardless of network speed.',
  },
  {
    q: 'Can I edit the event details after sending out the invitations?',
    a: 'Yes. Any time you update the date, time, venue, or schedule in your dashboard, the changes are instantly reflected on your live invitation link. Your guests will always see the current published information.',
  },
  {
    q: 'How does Kadi protect guest data under the Kenya Data Protection Act?',
    a: 'We adhere strictly to KDPA 2019. Guest contact numbers are used strictly for delivering the host’s invitation. We do not sell data, use contacts for marketing, or expose guest lists to other guests.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="purple" size="sm">
            Questions & Answers
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-charcoal mt-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-brand-slate mt-3 leading-relaxed">
            Everything you need to know about creating, sharing, and managing invitations on Kadi.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 bg-brand-mist/50 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-brand-charcoal hover:text-brand-purple transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-brand-slate transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-purple' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-brand-slate leading-relaxed border-t border-slate-200/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-brand-mist border border-slate-200 text-center">
          <h2 className="text-xl font-serif font-bold text-brand-charcoal">Have more questions?</h2>
          <p className="text-xs text-brand-slate mt-2 max-w-md mx-auto">
            Our support team in Nairobi is ready to help with your event planning and template customizations.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/contact">
              <Button size="sm" variant="primary">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
