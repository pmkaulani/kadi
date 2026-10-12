import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Send,
  Eye,
  CheckCircle,
  Share2,
  Users,
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Choose a Curated Suite',
      description:
        'Browse suites tailored for weddings, milestone birthdays, baby showers, graduations, or dignified memorials. Each design features a coordinated envelope, liner pattern, wax seal, and typography palette.',
      icon: <Layers className="w-6 h-6 text-brand-purple" />,
    },
    {
      number: '02',
      title: 'Personalize Details & Real Photographs',
      description:
        'Input your hosts, schedule, directions, dress code, and gift registry. Upload your real photographs with automatic focal-point cropping. Customize your questions for meal preferences and guest counts.',
      icon: <Sparkles className="w-6 h-6 text-brand-gold" />,
    },
    {
      number: '03',
      title: 'Import or Add Guest Households',
      description:
        'Add guests individually or upload a CSV spreadsheet. Group by family, assign plus-one limits, and generate unique, secure invitation tokens for each household.',
      icon: <Users className="w-6 h-6 text-emerald-600" />,
    },
    {
      number: '04',
      title: 'Share Privately via WhatsApp & Web',
      description:
        'Copy your invitation link or use our native WhatsApp share button to send invitations directly from your phone. Guests tap the link and immediately experience the opening animation.',
      icon: <Share2 className="w-6 h-6 text-brand-purple" />,
    },
    {
      number: '05',
      title: 'Track RSVPs in Real-Time',
      description:
        'Watch RSVPs stream into your host dashboard. View total attendee headcounts versus households, export responses to CSV for your caterer, and keep all event logistics under control.',
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="purple" size="sm">
            Simple 5-Step Process
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-charcoal mt-3">
            How Kadi Works
          </h1>
          <p className="text-sm sm:text-base text-brand-slate mt-4 leading-relaxed">
            From picking a design to tracking your final guest headcount, here is how you create an unforgettable digital invitation experience.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-8 relative before:absolute before:left-8 before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-200 hidden sm:block">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-8 relative group">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 shadow-md flex items-center justify-center font-serif text-lg font-bold text-brand-purple z-10 group-hover:border-brand-purple transition-colors">
                {step.number}
              </div>
              <div className="flex-1 bg-brand-mist p-6 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-3 mb-2">
                  {step.icon}
                  <h3 className="text-lg font-serif font-bold text-brand-charcoal">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="space-y-6 sm:hidden">
          {steps.map((step) => (
            <div key={step.number} className="bg-brand-mist p-6 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold font-serif text-brand-purple">
                  {step.number}.
                </span>
                <h3 className="text-base font-serif font-bold text-brand-charcoal">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-brand-slate leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-brand-charcoal text-white text-center">
          <h2 className="text-2xl font-serif font-bold">Ready to design your invitation?</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Choose any template and test the opening animation in full live preview before publishing.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/templates">
              <Button size="lg" variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse All Templates
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
