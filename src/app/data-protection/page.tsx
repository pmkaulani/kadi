import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

const sections = [
  { n: '01', title: 'Use data for a clear purpose', body: 'Guest contact details should be used only for the event-related purposes explained to the host and guest. Contact lists must not become a general marketing database.' },
  { n: '02', title: 'Limit what is collected', body: 'Collect only the information needed to create the invitation, coordinate attendance and support the requested event features. Optional information must remain optional.' },
  { n: '03', title: 'Treat children’s data with care', body: 'Events involving children require a deliberate review of what identifying information is necessary, the applicable parental or guardian permission, and who can see it. Private event links must not be treated as a replacement for legal safeguards.' },
  { n: '04', title: 'Respect access and deletion requests', body: 'Hosts and guests need appropriate processes to request access, correction, export or deletion, subject to applicable legal obligations and record-retention exceptions.' },
  { n: '05', title: 'Secure links and accounts', body: 'Private invitations should use high-entropy access tokens, safe storage and revocation. Tokens must not be exposed to analytics or other guests; access must be enforced by the server.' },
  { n: '06', title: 'Review providers and transfers', body: 'Hosting, email, analytics and messaging providers should be documented and reviewed for their processing role, security controls, data location and applicable transfer safeguards.' },
];

export default function DataProtectionPage() {
  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] py-16 md:py-24">
          <div className="kadi-container grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6"><span className="kadi-ornament" /><p className="kadi-eyebrow text-[#934638]">Privacy by design</p></div>
              <h1 className="kadi-display text-5xl sm:text-6xl md:text-[5.8rem]">Care for the<br /><em className="text-[#934638]">details.</em></h1>
            </div>
            <p className="md:col-span-4 text-sm text-[#756F64] leading-7 max-w-sm mb-2">A practical outline of the data-protection approach Kadi is being designed around in Kenya.</p>
          </div>
        </section>
        <section className="bg-[#F6F2EA] py-12 md:py-20">
          <div className="kadi-container grid md:grid-cols-12 gap-10 md:gap-16">
            <aside className="md:col-span-3">
              <p className="kadi-eyebrow text-[#934638] mb-4">Our approach</p>
              <p className="font-serif text-2xl leading-snug">People trust an invitation with more than their attendance.</p>
              <p className="text-xs text-[#756F64] leading-6 mt-4">This page describes intended product principles. Final public privacy notices and compliance processes require a review against the actual operating model before launch.</p>
            </aside>
            <div className="md:col-span-8 md:col-start-5 border-t border-[rgba(39,38,32,.2)]">
              {sections.map((item) => <article key={item.n} className="grid sm:grid-cols-[48px_minmax(0,1fr)] gap-4 sm:gap-6 py-6 md:py-8 border-b border-[rgba(39,38,32,.17)]"><span className="font-serif italic text-2xl text-[#B99A62]">{item.n}</span><div><h2 className="font-serif text-2xl md:text-3xl tracking-[-.03em]">{item.title}</h2><p className="text-sm text-[#756F64] leading-7 mt-3 max-w-2xl">{item.body}</p></div></article>)}
              <div className="mt-8 py-6 border-y border-[rgba(39,38,32,.17)]"><p className="kadi-eyebrow text-[#934638] mb-2">Before launch</p><p className="text-sm text-[#756F64] leading-7">The platform owner must confirm controller/processor roles, registration obligations, retention periods, incident escalation, consent handling and any cross-border transfer arrangements with qualified advice where required.</p></div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
