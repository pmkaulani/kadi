import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArrowUpRight, Check } from 'lucide-react';

const tiers = [
  {
    number: '01', name: 'The First Chapter', label: 'Free', price: 'KES 0', period: 'per event',
    description: 'A thoughtful starting point for small gatherings and getting to know Kadi.',
    features: ['Up to 50 guest invitations', 'Envelope opening and RSVP tracking', 'Share through WhatsApp', 'Venue links and calendar download', 'Guest list export'],
    cta: 'Begin for free', featured: false,
  },
  {
    number: '02', name: 'The Celebration', label: 'Most chosen', price: 'KES 2,900', period: 'one-time per event',
    description: 'For the gatherings where every detail matters — weddings, milestones and family celebrations.',
    features: ['Up to 300 guest invitations', 'Full design and colour customisation', 'Photo gallery and story sections', 'Household RSVP and custom questions', 'CSV guest import', 'M-Pesa gift instructions'],
    cta: 'Create a celebration', featured: true,
  },
  {
    number: '03', name: 'The Keepsake', label: 'Full suite', price: 'KES 4,500', period: 'one-time per event',
    description: 'A considered space for large celebrations, memorials and events with a team behind them.',
    features: ['Expanded guest allowance', 'Memorial tributes and virtual candles', 'Planner or co-host permissions', 'Personalised guest names', 'Optional ambient audio', 'Event-day check-in tools'],
    cta: 'Explore the full suite', featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="kadi-page min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="bg-[#EDE5D9] pt-16 md:pt-24 pb-12 md:pb-16">
          <div className="kadi-container grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6"><span className="kadi-ornament" /><p className="kadi-eyebrow text-[#934638]">Clear from the beginning</p></div>
              <h1 className="kadi-display text-6xl sm:text-7xl md:text-[6.5rem]">A fair price<br /><em className="text-[#934638]">for your moment.</em></h1>
            </div>
            <p className="md:col-span-4 text-sm md:text-base leading-7 text-[#756F64] max-w-sm md:pb-2">Pay per event, not for another monthly subscription you forget about. Choose the invitation suite that fits your gathering.</p>
          </div>
        </section>

        <section className="bg-[#F6F2EA] py-8 md:py-14">
          <div className="kadi-container">
            {tiers.map((tier) => (
              <article key={tier.number} className={`grid md:grid-cols-12 gap-5 md:gap-8 py-9 md:py-12 border-b border-[rgba(39,38,32,.2)] ${tier.featured ? 'bg-[#EDE5D9] px-5 md:px-8 -mx-5 md:-mx-8 border-t border-[rgba(39,38,32,.2)]' : ''}`}>
                <div className="md:col-span-1 flex md:block items-center gap-4">
                  <span className="font-serif italic text-3xl text-[#934638]">{tier.number}</span>
                  <span className="md:hidden kadi-eyebrow text-[#756F64]">{tier.label}</span>
                </div>
                <div className="md:col-span-4">
                  <div className="hidden md:block kadi-eyebrow text-[#756F64] mb-3">{tier.label}</div>
                  <h2 className="font-serif text-3xl md:text-[2.6rem] leading-tight tracking-[-.04em]">{tier.name}</h2>
                  <p className="text-sm leading-6 text-[#756F64] mt-3 max-w-sm">{tier.description}</p>
                  <div className="mt-5 flex items-baseline gap-2"><span className="font-serif text-3xl md:text-4xl">{tier.price}</span><span className="text-xs text-[#756F64]">{tier.period}</span></div>
                </div>
                <div className="md:col-span-4 md:col-start-7">
                  <p className="kadi-eyebrow text-[#934638] mb-4">Included in this suite</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => <li key={feature} className="flex items-start gap-3 text-sm text-[#514C43]"><Check size={15} className="mt-0.5 text-[#747D62] shrink-0" strokeWidth={1.7} /><span>{feature}</span></li>)}
                  </ul>
                </div>
                <div className="md:col-span-2 md:flex md:justify-end md:items-start md:pt-1">
                  <Link href="/templates" className={`kadi-button ${tier.featured ? '' : 'kadi-button--quiet'} w-full md:w-auto whitespace-nowrap`}>{tier.cta} <ArrowUpRight size={15} /></Link>
                </div>
              </article>
            ))}
            <p className="text-xs text-[#756F64] leading-6 mt-8 max-w-3xl">Pricing and feature limits shown here are planning values for the current prototype, not a live checkout offer. Final entitlements, payment methods, taxes and refund terms should be confirmed before public launch.</p>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
