import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

const cookieSections = [
  {
    n: '01',
    title: 'Essential session cookies only',
    body: 'Kadi uses encrypted HTTP-only session cookies strictly necessary to maintain host sign-in state, protect workspace API endpoints, and keep your event edits secure.',
  },
  {
    n: '02',
    title: 'Browser local storage for draft designs',
    body: 'We utilize your browser local storage to preserve in-progress invitation typography, color adjustments, and section ordering so your creative work is not lost if your connection drops.',
  },
  {
    n: '03',
    title: 'Zero behavioral advertising beacons',
    body: 'We do not install third-party tracking pixels, advertising retargeters, or cross-site tracking beacons. Your browsing activity on Kadi is never sold or used for behavioral advertising.',
  },
  {
    n: '04',
    title: 'Guest privacy and token isolation',
    body: 'Guests accessing invitations via unique links do not have tracking cookies placed on their devices. RSVP responses and dietary submissions are associated solely with the specific event invitation.',
  },
];

export default function CookiesPage() {
  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] py-16 md:py-24">
          <div className="kadi-container grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="kadi-ornament" />
                <p className="kadi-eyebrow text-[#934638]">Transparent storage</p>
              </div>
              <h1 className="kadi-display text-5xl sm:text-6xl md:text-[5.8rem]">
                Cookies &amp;<br />
                <em className="text-[#934638]">storage.</em>
              </h1>
            </div>
            <p className="md:col-span-4 text-sm text-[#756F64] leading-7 max-w-sm mb-2">
              How Kadi stores essential session tokens and draft state in your browser, without third-party tracking.
            </p>
          </div>
        </section>

        <section className="bg-[#F6F2EA] py-12 md:py-20">
          <div className="kadi-container grid md:grid-cols-12 gap-10 md:gap-16">
            <aside className="md:col-span-3">
              <p className="kadi-eyebrow text-[#934638] mb-4">Storage policy</p>
              <p className="font-serif text-2xl leading-snug">Respect for your device and attention.</p>
              <p className="text-xs text-[#756F64] leading-6 mt-4">
                Last updated: October 2026. Standard protocol for Kadi invitation studio.
              </p>
            </aside>
            <div className="md:col-span-8 md:col-start-5 border-t border-[rgba(39,38,32,.2)]">
              {cookieSections.map((item) => (
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
