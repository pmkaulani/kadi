'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { TEMPLATES, getTemplatesByCategory } from '@/lib/templates/catalogue';
import { EventCategory } from '@/lib/templates/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

const CATEGORIES: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'All Designs' },
  { id: 'wedding', label: 'Weddings' },
  { id: 'birthday', label: 'Birthdays' },
  { id: 'memorial', label: 'Memorials & Funerals' },
  { id: 'baby-shower', label: 'Baby Showers' },
  { id: 'graduation', label: 'Graduations' },
];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = getTemplatesByCategory(selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <PublicNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="purple" size="sm">
            Invitation Design Suites
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-charcoal mt-3">
            Choose your occasion
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-3 leading-relaxed">
            Every suite comes with a physical animated 3D envelope, hand-selected liner pattern, responsive wax seal, and customizable sections.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-purple text-white shadow-md'
                    : 'bg-white text-brand-slate hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tmpl.sampleData.heroImage}
                  alt={tmpl.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-brand-charcoal shadow-sm">
                    {tmpl.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link href={`/templates/${tmpl.id}`}>
                    <Button
                      size="sm"
                      variant="gold"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Live Demo
                    </Button>
                  </Link>
                  <Link href={`/app/events/new?template=${tmpl.id}`}>
                    <Button size="sm" variant="primary">
                      Use Design
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Template Meta */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-charcoal">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-brand-slate mt-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: tmpl.palette.envelope }}
                      title="Envelope color"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: tmpl.seal.color }}
                      title="Seal color"
                    />
                    <span className="text-[11px] text-brand-slate ml-1">
                      {tmpl.liner.name}
                    </span>
                  </div>

                  <Link href={`/templates/${tmpl.id}`}>
                    <Button variant="ghost" size="sm" className="text-brand-purple">
                      Preview <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
