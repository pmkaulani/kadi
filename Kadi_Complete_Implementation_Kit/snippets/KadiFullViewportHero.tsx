'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

export type KadiHeroSlide = {
  id: string;
  image: string;
  category: string;
  alt: string;
  objectPosition?: string;
};

type KadiFullViewportHeroProps = {
  slides: KadiHeroSlide[];
};

/**
 * The public navigation and hero are one viewport-sized composition.
 * Add this near the top of src/app/page.tsx, before the sections below the fold.
 * Start with the local envelope photograph, then use representative event images
 * from different categories after those catalogue entries exist.
 */
export function KadiFullViewportHero({ slides }: KadiFullViewportHeroProps) {
  const safeSlides = slides.filter((slide) => Boolean(slide.image));
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(-1);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = userPaused || hovered || focused;
  const [reducedMotion, setReducedMotion] = useState(false);
  const clearPreviousTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => () => {
    if (clearPreviousTimer.current) clearTimeout(clearPreviousTimer.current);
  }, []);

  const goTo = useCallback((requestedIndex: number) => {
    if (safeSlides.length < 2) return;
    const nextIndex = (requestedIndex + safeSlides.length) % safeSlides.length;
    if (nextIndex === activeIndex) return;
    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
    if (clearPreviousTimer.current) clearTimeout(clearPreviousTimer.current);
    clearPreviousTimer.current = setTimeout(() => setPreviousIndex(-1), reducedMotion ? 0 : 700);
  }, [activeIndex, reducedMotion, safeSlides.length]);

  useEffect(() => {
    if (paused || reducedMotion || safeSlides.length < 2) return;
    const timer = window.setTimeout(() => goTo(activeIndex + 1), 7000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, goTo, paused, reducedMotion, safeSlides.length]);

  if (!safeSlides.length) return null;
  const activeSlide = safeSlides[activeIndex] ?? safeSlides[0];

  return (
    <section
      className="kadi-home-viewport"
      aria-label="Kadi invitations for every occasion"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="kadi-home-bg" aria-hidden="true">
        {safeSlides.map((slide, index) => (
          (index === activeIndex || index === previousIndex) ? <div key={slide.id} className="kadi-home-photo" data-active={index === activeIndex}>
            <Image
              src={slide.image}
              alt=""
              fill
              {...(index === 0 ? { priority: true } : { loading: 'eager' as const })}
              sizes="100vw"
              quality={84}
              style={{ objectPosition: slide.objectPosition ?? '68% 50%' }}
            />
          </div> : null
        ))}
      </div>

      <div className="kadi-home-nav">
        {/* The existing navbar gains an optional hero variant; don't duplicate nav markup. */}
        <PublicNavbar variant="hero" />
      </div>

      <div className="kadi-home-hero-body">
        <div className="kadi-home-copy">
          <p className="kadi-home-kicker">Beautiful invitations, made personal</p>
          <h1 className="kadi-home-title">Beautiful invitations <em>for every moment.</em></h1>
          <p className="kadi-home-description">
            From birthdays and graduations to new homes, weddings and farewells, create an invitation that feels right for your occasion.
          </p>
          <div className="kadi-home-actions">
            <Link href="/templates" className="kadi-btn kadi-btn--light">
              Explore templates <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/how-it-works" className="kadi-btn kadi-btn--quiet">How Kadi works</Link>
          </div>
          <div className="kadi-home-occasions" aria-label="Occasions supported by Kadi">
            <span>Birthdays</span><span>Graduations</span><span>Housewarmings</span><span>Memorials</span><span>Weddings</span>
          </div>
        </div>

        <p className="kadi-home-caption" aria-live="off">Currently featuring: {activeSlide.category}</p>
        {safeSlides.length > 1 && (
          <div className="kadi-home-controls" aria-label="Featured invitation images">
            <button type="button" className="kadi-home-control" onClick={() => goTo(activeIndex - 1)} aria-label="Previous featured occasion">
              <ArrowLeft size={17} aria-hidden="true" />
            </button>
            <div className="kadi-home-indicators" role="group" aria-label="Choose featured occasion">
              {safeSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className="kadi-home-indicator"
                  aria-label={`Show ${slide.category}`}
                  aria-current={index === activeIndex}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
            <button type="button" className="kadi-home-control" onClick={() => goTo(activeIndex + 1)} aria-label="Next featured occasion">
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <button type="button" className="kadi-home-control" onClick={() => setUserPaused((value) => !value)} aria-label={userPaused ? 'Resume image rotation' : 'Pause image rotation'}>
              {userPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
