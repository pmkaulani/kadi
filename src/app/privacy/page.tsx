import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

const privacySections = [
  {
    n: '01',
    title: 'Overview and commitment',
    body: 'Kadi (“we”, “our”, or “the studio”) provides digital event invitations and guest coordination tools. This Privacy Policy outlines our principles for collecting, processing, and safeguarding personal data in compliance with the Kenya Data Protection Act 2019 and international privacy best practices.',
  },
  {
    n: '02',
    title: 'Information provided by hosts',
    body: 'When you create an account or craft an invitation, we collect your name, email address, password hash, event dates, venue locations, schedule milestones, and photographic assets. This data is used exclusively to render your stationery and manage guest responses.',
  },
  {
    n: '03',
    title: 'Guest details and RSVP responses',
    body: 'Hosts may enter guest names and WhatsApp/phone numbers or email addresses to prepare personalized invitation links. Guests respond with attendance confirmations, party counts, dietary requirements, and celebratory wishes. Guest data is never aggregated for external marketing or shared across host accounts.',
  },
  {
    n: '04',
    title: 'Financial contributions and M-Pesa instructions',
    body: 'Kadi displays host-configured payment instructions (such as Lipa na M-Pesa Buy Goods Tills, Paybills, or mobile numbers) directly to invited guests. Kadi does not intermediate, hold, escrow, or deduct commission from private gift transactions.',
  },
  {
    n: '05',
    title: 'Retention and host control',
    body: 'Event data is retained during the lifecycle of your celebration. Hosts can update event information, revoke guest access tokens, export RSVP records to CSV, or archive events at any time from their studio command center.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] py-16 md:py-24">
          <div className="kadi-container grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="kadi-ornament" />
                <p className="kadi-eyebrow text-[#934638]">Privacy policy</p>
              </div>
              <h1 className="kadi-display text-5xl sm:text-6xl md:text-[5.8rem]">
                Privacy &amp;<br />
                <em className="text-[#934638]">safeguards.</em>
              </h1>
            </div>
            <p className="md:col-span-4 text-sm text-[#756F64] leading-7 max-w-sm mb-2">
              How we protect your gathering details, guest contacts, and personal information across the studio.
            </p>
          </div>
        </section>

        <section className="bg-[#F6F2EA] py-12 md:py-20">
          <div className="kadi-container grid md:grid-cols-12 gap-10 md:gap-16">
            <aside className="md:col-span-3">
              <p className="kadi-eyebrow text-[#934638] mb-4">Our commitment</p>
              <p className="font-serif text-2xl leading-snug">Personal moments deserve quiet discretion.</p>
              <p className="text-xs text-[#756F64] leading-6 mt-4">
                Last updated: October 2026. Kenya Data Protection Act 2019 aligned.
              </p>
            </aside>
            <div className="md:col-span-8 md:col-start-5 border-t border-[rgba(39,38,32,.2)]">
              {privacySections.map((item) => (
                <article
                  key={item.n}
                  className="grid sm:grid-cols-[48px_minmax(0,1fr)] gap-4 sm:gap-6 py-6 md:py-8 border-b border-[rgba(39,38,32,.17)]"
                >
                  <span className="font-serif italic text-2xl text-[#B99A62]">{item.n}</span>
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl tracking-[-.03em]">{item.title}</h2>
                    <p className="text-sm text-[#756F64] leading-7 mt-3 max-w-2xl">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
