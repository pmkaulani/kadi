'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export type HeroSlide = {
  src: string;
  alt: string;
  position?: string;
};

const DEFAULT_SLIDES: HeroSlide[] = [
  { src: '/kadi/hero-envelope.webp', alt: 'Burgundy wax-sealed invitation beside candlelight', position: 'center right' },
  { src: '/kadi/category-blush.webp', alt: 'Blush floral envelope with a wax seal', position: 'center center' },
  { src: '/kadi/category-velvet.webp', alt: 'Rich velvet envelope with antique-gold detailing', position: 'center center' },
];

/**
 * A restrained crossfading backdrop. The layout, heading and CTA never move,
 * so the carousel doesn't make the hero feel like a different page every few seconds.
 */
export function HeroBackdropCarousel({ slides = DEFAULT_SLIDES, intervalMs = 8000 }: { slides?: HeroSlide[]; intervalMs?: number }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const id = window.setInterval(() => setActive((current) => (current + 1) % slides.length), intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs, paused, reducedMotion, slides.length]);

  return (
    <div
      className="kr-hero-carousel"
      aria-label="Invitation imagery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`kr-hero-carousel__image${index === active ? ' is-active' : ''}`}
          aria-hidden={index !== active}
        >
          <Image
            src={slide.src}
            alt={index === active ? slide.alt : ''}
            fill
            sizes="100vw"
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
            style={{ objectPosition: slide.position || 'center', objectFit: 'cover' }}
          />
        </div>
      ))}
      <div className="kr-hero-carousel__shade" aria-hidden="true" />
      {slides.length > 1 && (
        <div className="kr-hero-carousel__dots" aria-label="Choose hero image">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show image ${index + 1} of ${slides.length}`}
              aria-pressed={index === active}
              className={index === active ? 'is-active' : ''}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroBackdropCarousel;
