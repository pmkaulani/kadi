import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heart, Sparkles, Shield, Compass, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="purple" size="sm">
            Our Purpose
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-charcoal mt-3">
            Crafting occasions, not just cards.
          </h1>
          <p className="text-sm sm:text-base text-brand-slate mt-4 leading-relaxed">
            Kadi was created to bring back the anticipation and dignity of receiving a formal, physical invitation—reimagined seamlessly for modern mobile life in Kenya.
          </p>
        </div>

        <div className="space-y-12 text-brand-charcoal text-sm sm:text-base leading-relaxed">
          <section className="p-8 rounded-3xl bg-brand-mist border border-slate-200/80">
            <h2 className="text-2xl font-serif font-bold text-brand-charcoal mb-4">
              The Problem with Digital Invites Today
            </h2>
            <p className="text-brand-slate text-xs sm:text-sm leading-relaxed mb-4">
              Over the last decade, invitations devolved into two extremes: either expensive printed stationery that gets lost on kitchen tables, or generic WhatsApp text blasts with compressed screenshot posters where dates and directions are impossible to read.
            </p>
            <p className="text-brand-slate text-xs sm:text-sm leading-relaxed">
              We asked ourselves: why shouldn&apos;t opening an invitation on your phone feel just as tactile, cinematic, and emotional as breaking a wax seal on hand-pressed paper?
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-charcoal mb-6 text-center">
              Our Core Guiding Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                <Sparkles className="w-6 h-6 text-brand-gold mb-3" />
                <h3 className="font-serif font-bold text-base mb-1">Physical Tactility</h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  Every envelope has real 3D depth, hinged folds, and textured liners that rise physically into the viewport.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                <Compass className="w-6 h-6 text-brand-purple mb-3" />
                <h3 className="font-serif font-bold text-base mb-1">Local Relevance</h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  Tailored specifically for East African celebrations: native WhatsApp dispatch, Kenyan phone formats, and direct M-Pesa gift rails.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                <Shield className="w-6 h-6 text-emerald-600 mb-3" />
                <h3 className="font-serif font-bold text-base mb-1">Dignity & Privacy</h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  Memorials are treated with reverence, not party gimmicks. Personal guest data is strictly guarded under KDPA 2019.
                </p>
              </div>
            </div>
          </section>

          <div className="pt-8 text-center">
            <Link href="/templates">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore the Template Suites
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
