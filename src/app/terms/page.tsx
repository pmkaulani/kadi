import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

const termSections = [
  {
    n: '01',
    title: 'Agreement and scope',
    body: 'By creating a studio workspace or publishing digital invitations through Kadi, you agree to these Terms of Service. You confirm that you possess the lawful authority to upload event details, photographs, and guest contact information.',
  },
  {
    n: '02',
    title: 'Permitted use and host responsibilities',
    body: 'Hosts agree to use Kadi exclusively for authentic family, social, cultural, and corporate gatherings. You may not use the studio to distribute spam, fraudulent appeals, defamatory or harassing messages, or unlawful content. Unsolicited bulk messaging without recipient consent is strictly prohibited.',
  },
  {
    n: '03',
    title: 'Gifts and payment instructions disclaimer',
    body: 'Kadi provides visual presentation tools allowing hosts to share their personal or business M-Pesa Till numbers, Paybills, or phone numbers with invited guests. Kadi does not intermediate, hold, or guarantee financial contributions between guests and hosts.',
  },
  {
    n: '04',
    title: 'Intellectual property and stationery artwork',
    body: 'All stationery liner illustrations, digital wax seals, animations, typographic palettes, and software code remain the intellectual property of Kadi Studio. You retain ownership of your uploaded personal photographs, milestone stories, and custom written words.',
  },
  {
    n: '05',
    title: 'Service continuity and availability',
    body: 'While we aim for high uptime and smooth event-day access for your guests, we recommend keeping a local backup or exported CSV of your guest list and RSVP counts prior to major event dates.',
  },
];

export default function TermsPage() {
  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] py-16 md:py-24">
          <div className="kadi-container grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="kadi-ornament" />
                <p className="kadi-eyebrow text-[#934638]">Studio terms</p>
              </div>
              <h1 className="kadi-display text-5xl sm:text-6xl md:text-[5.8rem]">
                Terms of<br />
                <em className="text-[#934638]">service.</em>
              </h1>
            </div>
            <p className="md:col-span-4 text-sm text-[#756F64] leading-7 max-w-sm mb-2">
              The rights, responsibilities, and mutual agreements guiding your use of Kadi stationery and tools.
            </p>
          </div>
        </section>

        <section className="bg-[#F6F2EA] py-12 md:py-20">
          <div className="kadi-container grid md:grid-cols-12 gap-10 md:gap-16">
            <aside className="md:col-span-3">
              <p className="kadi-eyebrow text-[#934638] mb-4">Terms agreement</p>
              <p className="font-serif text-2xl leading-snug">Clear terms for graceful gatherings.</p>
              <p className="text-xs text-[#756F64] leading-6 mt-4">
                Last updated: October 2026. Governing law: Republic of Kenya.
              </p>
            </aside>
            <div className="md:col-span-8 md:col-start-5 border-t border-[rgba(39,38,32,.2)]">
              {termSections.map((item) => (
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
