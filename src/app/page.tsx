'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Smartphone,
  Share2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Gift,
  Heart,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const [selectedDemoTemplate, setSelectedDemoTemplate] = useState(TEMPLATES[0]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-brand-mist via-white to-white">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-purple/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple-light border border-brand-purple/20 text-brand-purple text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mobile-First Digital Invitations for Kenya</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-brand-charcoal tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Invitations that feel like an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-event-rose">
              occasion.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-brand-slate max-w-2xl mx-auto mt-6 leading-relaxed">
            A sealed 3D envelope opens, the card physically emerges, and real event details reveal into an interactive website with live RSVP and direct M-Pesa gifts.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/templates">
              <Button
                size="lg"
                variant="primary"
                className="text-base px-8 py-4 shadow-xl shadow-brand-purple/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create an Invitation
              </Button>
            </Link>
            <a href="#live-demo">
              <Button size="lg" variant="secondary" className="text-base px-6 py-4">
                Test the Envelope Demo
              </Button>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-brand-slate">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No guest app download required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant WhatsApp share links
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> KDPA 2019 privacy-compliant
            </span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PLAYABLE ENVELOPE DEMO */}
      <section id="live-demo" className="py-16 bg-brand-charcoal text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="gold" size="sm" className="mb-2">
              Signature Motion Experience
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Try the Opening Reveal Right Now
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Tap the seal below. Experience the 3D flap rotation, decorative liner, and layered card emergence.
            </p>

            {/* Template Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {TEMPLATES.slice(0, 4).map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedDemoTemplate(tmpl)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                    selectedDemoTemplate.id === tmpl.id
                      ? 'bg-brand-purple text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {tmpl.name} ({tmpl.category})
                </button>
              ))}
            </div>
          </div>

          {/* Embedded Live Envelope Renderer */}
          <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-black/40">
            <EnvelopeRenderer
              template={selectedDemoTemplate}
              guestName="Dr. Peter & Family"
              isDemo={true}
            />
          </div>
        </div>
      </section>

      {/* CORE VALUE PILLARS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="purple" size="sm">
              Why Kadi
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-charcoal mt-3">
              Everything your guests need in one unforgettable link
            </h2>
            <p className="text-sm sm:text-base text-brand-slate mt-3">
              Traditional paper cards get misplaced. Static PDFs are unreadable on phones. Kadi combines emotional physical craftsmanship with the utility of the live web.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-brand-mist border border-slate-200/80 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple-light text-brand-purple flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-charcoal mb-2">
                Physical 3D Envelope Reveal
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                The sealed envelope opens with 3D perspective, reveals your custom patterned liner, and the card physically rises into the spotlight with soft layered shadows.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-brand-mist border border-slate-200/80 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold-light text-amber-900 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-charcoal mb-2">
                Real Household RSVP Engine
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                Invite families or couples under one link. Control attendee limits, record dietary preferences, question answers, and export clean lists anytime.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-brand-mist border border-slate-200/80 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-charcoal mb-2">
                Built for Kenyan Workflows
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                Share natively through WhatsApp, format Kenyan numbers (+254), display East Africa Time, and provide direct M-Pesa Till or Paybill gift details without fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATE SUITE SHOWCASE */}
      <section className="py-20 bg-brand-mist border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="rose" size="sm">
                Curated Design Suites
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-charcoal mt-3">
                Crafted for Every Milestone
              </h2>
              <p className="text-xs sm:text-sm text-brand-slate mt-2 max-w-xl">
                From regal weddings in Nairobi to reverent memorial services and joyful baby showers, every occasion has its own tailored aesthetic.
              </p>
            </div>

            <Link href="/templates" className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All {TEMPLATES.length} Templates
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tmpl.sampleData.heroImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-brand-charcoal shadow-sm">
                      {tmpl.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-brand-charcoal group-hover:text-brand-purple transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-brand-slate mt-1.5 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-medium text-slate-500">
                      Liner: {tmpl.liner.name}
                    </span>
                    <Link href={`/templates/${tmpl.id}`}>
                      <Button variant="ghost" size="sm" className="text-brand-purple">
                        Preview Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-brand-purple text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
            Ready to give your guests an unforgettable invitation?
          </h2>
          <p className="text-sm sm:text-base text-purple-100 max-w-xl mx-auto mt-4">
            Pick a design, customize your photographs and details, and publish your private link in under 10 minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/templates">
              <Button
                size="lg"
                variant="gold"
                className="text-base px-8 py-4 shadow-xl"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start Designing Free
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-base px-6 py-4"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
