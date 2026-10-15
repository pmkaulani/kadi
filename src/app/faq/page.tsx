'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

const FAQS = [
  { q: 'Do guests need an account or an app?', a: 'The planned guest experience opens in a mobile browser from a shared invitation link. Guests should not need to create a Kadi account just to read the invitation or respond.' },
  { q: 'Can I invite a couple or a whole household?', a: 'Yes. The platform is designed to support an invited household and its individual attendees. Hosts can set a permitted party size, while each attendee can provide their own attendance and relevant meal details.' },
  { q: 'How does WhatsApp sharing work?', a: 'The first release is designed around a share action that opens the host’s own WhatsApp app with a prepared message and invitation link. Automated business messaging is a separate feature and will require the appropriate account, recipient permission and approved templates.' },
  { q: 'Can guests send gifts through M-Pesa?', a: 'The initial design allows hosts to display their own M-Pesa Paybill, Till or phone-number instructions. Automated collection or payouts are not assumed to be active and require separate provider and regulatory checks.' },
  { q: 'What if a guest has a slow connection or prefers no animation?', a: 'The invitation is intended to keep the important event details accessible even when animation is skipped or reduced. The implementation must support reduced-motion preferences and a clear way to go straight to the details.' },
  { q: 'Can I update event details after sharing the invitation?', a: 'Published invitation links are intended to show the current event details. Changes should be saved and reflected on the live invitation without requiring hosts to send a new image.' },
  { q: 'How will guest data be protected?', a: 'Kadi is being designed around data minimisation, access controls, limited-purpose processing, retention rules and appropriate consent records. Privacy copy and operational compliance must be reviewed before a public launch.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] py-16 md:py-24">
          <div className="kadi-container grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6"><span className="kadi-ornament" /><p className="kadi-eyebrow text-[#934638]">A few useful answers</p></div>
              <h1 className="kadi-display text-6xl sm:text-7xl md:text-[6.5rem]">Good to <em className="text-[#934638]">know.</em></h1>
            </div>
            <p className="md:col-span-4 text-sm text-[#756F64] leading-7 max-w-sm mb-2">How Kadi invitations work, how guests respond, and what to expect from the platform.</p>
          </div>
        </section>

        <section className="bg-[#F6F2EA] py-12 md:py-20">
          <div className="kadi-container grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-3">
              <p className="kadi-eyebrow text-[#934638] mb-4">Common questions</p>
              <p className="font-serif text-2xl leading-snug">A little clarity before the occasion.</p>
            </div>
            <div className="md:col-span-8 md:col-start-5 border-t border-[rgba(39,38,32,.2)]">
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                return <article key={faq.q} className="border-b border-[rgba(39,38,32,.17)]">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen} className="w-full py-5 md:py-6 flex items-start gap-5 text-left group">
                    <span className="font-serif italic text-[#B99A62] text-sm pt-1">{String(index + 1).padStart(2, '0')}</span>
                    <span className="flex-1 font-serif text-xl sm:text-2xl leading-snug tracking-[-.02em] group-hover:text-[#934638] transition-colors">{faq.q}</span>
                    <ChevronDown size={19} strokeWidth={1.5} className={`shrink-0 mt-1 text-[#934638] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <div className="pl-9 sm:pl-10 pr-4 pb-6 text-sm text-[#756F64] leading-7 max-w-2xl">{faq.a}</div>}
                </article>;
              })}
              <div className="py-8 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><p className="font-serif text-2xl">Still wondering about something?</p><p className="text-sm text-[#756F64] mt-2">Send us a note and tell us what you need.</p></div>
                <Link href="/contact" className="kadi-link inline-flex items-center gap-2 text-sm self-start">Get in touch <ArrowUpRight size={15} /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
