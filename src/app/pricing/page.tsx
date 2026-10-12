import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Info, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Starter Suite',
      badge: 'Free Preview',
      price: 'KES 0',
      period: 'per event',
      description: 'Perfect for small family gatherings, intimate birthdays, and casual showers.',
      features: [
        'Up to 50 guest invitations',
        'Standard 3D animated envelope opening',
        'Real-time RSVP tracking',
        'Native WhatsApp sharing link',
        'Google Maps & .ics calendar downloads',
        'CSV guest list export',
      ],
      cta: 'Start with Free Tier',
      variant: 'secondary' as const,
    },
    {
      name: 'Celebration Suite',
      badge: 'Most Popular',
      price: 'KES 2,900',
      period: 'per event (one-time)',
      description: 'Ideal for weddings, milestone jubilees, and large family celebrations.',
      features: [
        'Up to 300 guest invitations',
        'All curated liners, wax seals, and palettes',
        'Custom photo gallery (up to 15 photos)',
        'Dietary preferences & custom song requests',
        'Direct M-Pesa gift instructions integration',
        'Bulk CSV guest import & phone normalization',
        'Priority email & WhatsApp support',
      ],
      cta: 'Create Celebration Suite',
      variant: 'primary' as const,
      popular: true,
    },
    {
      name: 'Grand Gala & Memorial',
      badge: 'Full Suite',
      price: 'KES 4,500',
      period: 'per event (one-time)',
      description: 'For expansive weddings, state memorials, or corporate summits.',
      features: [
        'Unlimited guest invitations',
        'Dignified memorial mode (virtual candles & tribute book)',
        'Dedicated planner / co-host access permissions',
        'Personalized guest envelopes with individual names',
        'Background ambient audio/music support',
        'Event-day door check-in scanner mode',
        'Lifetime invitation archive preservation',
      ],
      cta: 'Create Grand Event',
      variant: 'gold' as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="purple" size="sm">
            Transparent Pricing
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-charcoal mt-3">
            Simple, pay-per-event pricing
          </h1>
          <p className="text-sm sm:text-base text-brand-slate mt-4 leading-relaxed">
            No recurring monthly subscriptions for one-time events. Pay once per event or use our free tier for smaller gatherings.
          </p>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-center justify-center gap-2 max-w-xl mx-auto">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Developer Preview:</strong> All template features and live demos are available for exploration with zero payment barriers.
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                tier.popular
                  ? 'bg-brand-mist border-2 border-brand-purple shadow-xl shadow-brand-purple/10 relative'
                  : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-purple text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                    Recommended
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-xl font-bold text-brand-charcoal">
                    {tier.name}
                  </h3>
                  <Badge variant={tier.popular ? 'purple' : 'default'} size="sm">
                    {tier.badge}
                  </Badge>
                </div>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {tier.description}
                </p>

                <div className="my-6">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-brand-charcoal">
                    {tier.price}
                  </span>
                  <span className="text-xs text-brand-slate ml-2">{tier.period}</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block">
                    What&apos;s included:
                  </span>
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-brand-charcoal">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Link href="/templates">
                  <Button
                    size="md"
                    variant={tier.variant}
                    className="w-full text-xs font-semibold py-3"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
