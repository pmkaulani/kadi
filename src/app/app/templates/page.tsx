'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { EVENT_CATEGORY_IDS, EVENT_CATEGORY_LABELS } from '@/lib/events/categories';
import { Search, Heart, Eye, ArrowRight, Sparkles, Check } from 'lucide-react';

const CATEGORY_CHIPS = [
  { id: 'all', label: 'All' },
  ...EVENT_CATEGORY_IDS.map((id) => ({
    id,
    label: EVENT_CATEGORY_LABELS[id] || id,
  })),
];

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  wedding: '/kadi/category-wedding.webp',
  birthday: '/kadi/category-velvet.webp',
  memorial: '/kadi/category-celestial.webp',
  'baby-shower': '/kadi/category-blush.webp',
  graduation: '/kadi/category-letter.webp',
  housewarming: '/kadi/category-botanical.webp',
  anniversary: '/kadi/category-velvet.webp',
  corporate: '/kadi/category-letter.webp',
};

function WorkspaceTemplatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || 'all';
  const initialQuery = searchParams?.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [previewTemplate, setPreviewTemplate] = useState<(typeof TEMPLATES)[0] | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tmpl) => {
      if (selectedCategory !== 'all' && tmpl.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tmpl.name.toLowerCase().includes(q);
        const matchDesc = tmpl.description.toLowerCase().includes(q);
        const matchCat = tmpl.category.toLowerCase().includes(q);
        return matchName || matchDesc || matchCat;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-[1380px] mx-auto space-y-6">
      {/* Top Header & Search Bar matching app-workspace-target.png (Top-Right Screen & Phone 2) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(39,38,32,0.1)] pb-4 sm:pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#272620] font-normal tracking-[-0.03em]">
            Templates
          </h1>
          <p className="hidden sm:block text-xs sm:text-sm text-[#756F64] mt-1">
            Find the perfect style for your special occasion.
          </p>
        </div>

        {/* Search input in header (universal on all devices) */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8375] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            aria-label="Search templates by title or category"
            className="w-full pl-9 pr-4 py-2 bg-white border border-[rgba(39,38,32,0.15)] rounded-lg text-xs placeholder:text-[#9A9184] focus:outline-none focus:border-[#934638] shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills matching reference */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Category filter">
        {CATEGORY_CHIPS.map((chip) => {
          const isActive = selectedCategory === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              aria-pressed={isActive}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#794a32] text-white shadow-sm'
                  : 'bg-white border border-[rgba(39,38,32,0.14)] text-[#6D6558] hover:text-[#272620] hover:bg-[#FAF4EB]'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Templates Grid: 1 column on ultra-compact (<420px), 2 on mobile/tablet, 3 on desktop */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {filteredTemplates.map((tmpl) => {
          const isFav = !!favorites[tmpl.id];

          return (
            <div
              key={tmpl.id}
              className="bg-white border border-[rgba(39,38,32,0.12)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <Link href={`/app/events/new?templateId=${tmpl.id}`} className="block flex-1">
                {/* Image Container with heart button */}
                <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#2D211A]">
                  <Image
                    src={tmpl.sampleData.heroImage || CATEGORY_FALLBACK_IMAGES[tmpl.category] || '/kadi/category-wedding.webp'}
                    alt={tmpl.name}
                    fill
                    unoptimized={Boolean(tmpl.sampleData.heroImage?.startsWith('http'))}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle top vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20 pointer-events-none" />

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(tmpl.id, e)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1 sm:p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-colors"
                    aria-label="Add to favorites"
                  >
                    <Heart
                      size={14}
                      className={isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}
                    />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-2.5 sm:p-5">
                  <h3 className="font-serif text-sm sm:text-lg text-[#272620] font-medium leading-tight truncate">
                    {tmpl.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-[#8C8375] block mt-0.5 capitalize truncate">
                    {tmpl.category}
                  </span>
                  <p className="hidden sm:block text-xs text-[#756F64] mt-1.5 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
              </Link>

              {/* Action Buttons: Preview and Use Template matching reference (desktop only, on mobile tapping card chooses it) */}
              <div className="p-4 pt-0 hidden sm:flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(tmpl)}
                  className="flex-1 py-2 px-3 bg-[#FAF7F0] hover:bg-[#F0EAE0] border border-[rgba(39,38,32,0.18)] rounded-md text-xs font-medium text-[#272620] transition-colors text-center"
                >
                  Preview
                </button>
                <Link
                  href={`/app/events/new?templateId=${tmpl.id}`}
                  className="flex-1 py-2 px-3 bg-[#794a32] hover:bg-[#603924] rounded-md text-xs font-medium text-white transition-colors text-center shadow-sm"
                >
                  Use Template
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal if requested */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1613] text-[#FAF4EB] border border-[#3A2E26] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="relative h-64 w-full bg-[#120D0A]">
              <Image
                src={previewTemplate.sampleData.heroImage || '/kadi/category-wedding.webp'}
                alt={previewTemplate.name}
                fill
                unoptimized={Boolean(previewTemplate.sampleData.heroImage?.startsWith('http'))}
                sizes="(max-width: 640px) 100vw, 512px"
                className="w-full h-full object-cover filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1613] via-transparent to-transparent" />
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-200/80">
                  {previewTemplate.category}
                </span>
                <h3 className="font-serif text-2xl text-amber-100 font-medium mt-0.5">
                  {previewTemplate.name}
                </h3>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  {previewTemplate.description}
                </p>
              </div>

              <div className="p-3.5 bg-black/40 border border-white/10 rounded-lg text-xs space-y-1.5 text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-400">Heading typography:</span>
                  <span className="capitalize">{previewTemplate.fonts.heading}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Stationery liner:</span>
                  <span>{previewTemplate.liner.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Motion preset:</span>
                  <span className="capitalize">{previewTemplate.motionPreset}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-white/20 text-xs font-medium text-white hover:bg-white/10"
                >
                  Close
                </button>
                <Link
                  href={`/app/events/new?templateId=${previewTemplate.id}`}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#934638] hover:bg-[#73352B] text-xs font-medium text-white text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Select & Customize</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkspaceTemplatesPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-[#756F64]">Loading template gallery...</div>}>
      <WorkspaceTemplatesContent />
    </Suspense>
  );
}
