'use client';

import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { EVENT_CATEGORY_IDS, EVENT_CATEGORY_LABELS } from '@/lib/events/categories';
import { OccasionRail, type OccasionRailItem } from '@/components/templates/OccasionRail';
import { ResponsiveTemplateCard } from '@/components/templates/ResponsiveTemplateCard';
import { Search, X, RotateCcw } from 'lucide-react';

const OCCASION_RAIL_ITEMS: OccasionRailItem[] = EVENT_CATEGORY_IDS.map((catId) => {
  const template = TEMPLATES.find((t) => t.category === catId);
  return {
    id: catId,
    image: template?.sampleData.heroImage || '/kadi/category-botanical.webp',
    imageAlt: EVENT_CATEGORY_LABELS[catId] || catId,
  };
});

const CATEGORY_CHIPS = [
  { id: 'all', label: 'All Occasions' },
  ...EVENT_CATEGORY_IDS.map((id) => ({
    id,
    label: EVENT_CATEGORY_LABELS[id] || id,
  })),
];

function TemplatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    const qParam = searchParams.get('q');
    if (qParam) {
      setSearchQuery(qParam);
    }
  }, [searchParams]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    const queryString = params.toString();
    router.replace(queryString ? `/templates?${queryString}` : '/templates', { scroll: false });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (!query.trim()) {
      params.delete('q');
    } else {
      params.set('q', query);
    }
    const queryString = params.toString();
    router.replace(queryString ? `/templates?${queryString}` : '/templates', { scroll: false });
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    router.replace('/templates', { scroll: false });
  };

  const filtered = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === 'all' || template.category === selectedCategory;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedQuery === '' ||
        template.name.toLowerCase().includes(normalizedQuery) ||
        template.description.toLowerCase().includes(normalizedQuery) ||
        template.category.toLowerCase().includes(normalizedQuery) ||
        (template.sampleData.venue && template.sampleData.venue.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="kadi-page min-h-screen flex flex-col bg-[#F6F2EA]">
      <PublicNavbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <p className="kadi-kicker mb-1">Authentic Invitations for Real Moments</p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#272620] font-normal tracking-[-0.03em]">
                Design Library
              </h1>
              <p className="text-xs sm:text-sm text-[#756F64] mt-1.5 max-w-xl">
                Choose an artisan digital invitation crafted with tactile ceremony, authentic stationery aesthetics, and seamless RSVP tracking.
              </p>
            </div>

            {/* Search Input on Right */}
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8375] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by occasion, style, or title..."
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-[rgba(39,38,32,0.15)] rounded-full text-xs placeholder:text-[#9A9184] focus:outline-none focus:border-[#934638] transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8375] hover:text-[#272620]"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Occasion Touch Rail */}
          <div className="mb-10">
            <OccasionRail
              items={OCCASION_RAIL_ITEMS}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </div>

          {/* Category Filter Pills & Result Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(39,38,32,0.12)] mb-8">
            <div className="flex flex-wrap items-center gap-2" aria-label="Quick category filters">
              {CATEGORY_CHIPS.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    aria-pressed={active}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#794a32] text-white shadow-sm'
                        : 'bg-white/80 text-[#60584D] hover:bg-white hover:text-[#272620] border border-[rgba(39,38,32,0.12)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs text-[#756F64]">
              <span>Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'design' : 'designs'}</span>
              {(selectedCategory !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 text-[#934638] hover:underline font-semibold"
                >
                  <RotateCcw size={12} /> Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Template Grid */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center bg-white/60 border border-[rgba(39,38,32,0.09)] rounded-xl">
              <p className="font-serif text-2xl text-[#272620]">No designs matched your search</p>
              <p className="text-xs text-[#756F64] mt-2 max-w-sm mx-auto">
                Try searching for a different keyword, or clear your filters to view all available stationery suites.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 kadi-btn kadi-btn--light text-xs"
              >
                View all templates
              </button>
            </div>
          ) : (
            <div className="kadi-template-grid">
              {filtered.map((template, idx) => (
                <ResponsiveTemplateCard
                  key={template.id}
                  template={template}
                  index={idx}
                  priority={idx < 3}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F2EA] flex items-center justify-center text-sm text-[#756F64]">Loading designs...</div>}>
      <TemplatesContent />
    </Suspense>
  );
}
