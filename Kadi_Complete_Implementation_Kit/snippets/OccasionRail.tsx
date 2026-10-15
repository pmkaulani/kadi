'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { OCCASION_ART_DIRECTIONS, type OccasionId } from '@/lib/templates/occasion-art-direction';

export type OccasionRailItem = {
  id: OccasionId;
  image: string;
  imageAlt: string;
};

type OccasionRailProps = {
  items: OccasionRailItem[];
  selected?: string;
  onSelect: (category: string) => void;
};

/** Horizontal snap rail; the app page owns the selected filter state. */
export function OccasionRail({ items, selected = 'all', onSelect }: OccasionRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * Math.max(240, railRef.current.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="kadi-occasion-section" aria-label="Browse invitations by occasion">
      <div className="kadi-occasion-heading">
        <div>
          <p className="kadi-kicker">A design for your kind of day</p>
          <h2 className="kadi-display">Every occasion has its own feel.</h2>
        </div>
        <div className="kadi-occasion-controls">
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll occasions left"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll occasions right"><ArrowRight size={18} /></button>
        </div>
      </div>
      <div className="kadi-occasion-rail" ref={railRef} tabIndex={0} aria-label="Occasion categories">
        {items.map((item) => {
          const occasion = OCCASION_ART_DIRECTIONS.find((entry) => entry.id === item.id);
          if (!occasion) return null;
          const active = selected === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className="kadi-occasion-tile"
              onClick={() => onSelect(item.id)}
              aria-pressed={active}
              aria-label={`Filter templates: ${occasion.label}`}
            >
              <span className="kadi-occasion-tile__image">
                <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 640px) 124px, 164px" loading="lazy" />
              </span>
              <span className="kadi-occasion-tile__label">{occasion.label}</span>
              <span className="kadi-occasion-tile__desc">{occasion.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
