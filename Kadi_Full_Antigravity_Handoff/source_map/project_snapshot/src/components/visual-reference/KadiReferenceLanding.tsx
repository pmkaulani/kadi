'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { KadiFullViewportHero } from '@/components/landing/KadiFullViewportHero';
import { KADI_HERO_SLIDES } from '@/lib/landing-hero-slides';

const occasions = [
  {
    title: 'Weddings',
    description: 'Timeless elegance for your special day.',
    image: '/kadi/category-botanical.webp',
    imageAlt: 'Botanical paper envelope closed with a gold wax seal',
    href: '/templates?category=wedding',
  },
  {
    title: 'Birthdays',
    description: 'Bold, fun and full of personality.',
    image: '/kadi/category-velvet.webp',
    imageAlt: 'Deep burgundy invitation envelope with gold ornament',
    href: '/templates?category=birthday',
  },
  {
    title: 'Memorials',
    description: 'A dignified way to celebrate lives well lived.',
    image: '/kadi/category-letter.webp',
    imageAlt: 'A keepsake letter in warm natural paper tones',
    href: '/templates?category=memorial',
  },
  {
    title: '& More',
    description: 'Baby showers, graduations, anniversaries and more.',
    image: '/kadi/category-blush.webp',
    imageAlt: 'Soft blush envelope with a delicate wax seal',
    href: '/templates',
  },
];

export default function KadiReferenceLanding() {

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.documentElement.classList.add('kr-motion-ready');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-kr-reveal]').forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('kr-motion-ready');
    };
  }, []);

  return (
    <main className="kr-site">
      <KadiFullViewportHero slides={KADI_HERO_SLIDES} />

      <section id="kr-occasions" className="kr-occasions" aria-labelledby="kr-occasions-title">
        <div className="kr-container">
          <div className="kr-section-heading" data-kr-reveal>
            <p className="kr-eyebrow">Templates for every occasion</p>
            <h2 id="kr-occasions-title">Choose a style that tells your story</h2>
          </div>
          <div className="kr-occasion-rail" aria-label="Browse invitation occasions">
            {occasions.map((occasion, index) => (
              <article className="kr-occasion" data-kr-reveal key={occasion.title} style={{ '--kr-delay': `${index * 80}ms` } as CSSProperties & { '--kr-delay': string }}>
                <Link href={occasion.href} className="kr-occasion__link">
                  <div className="kr-occasion__image-wrap">
                    <img src={occasion.image} alt={occasion.imageAlt} loading="lazy" />
                  </div>
                  <div className="kr-occasion__body">
                    <h3>{occasion.title}</h3>
                    <p>{occasion.description}</p>
                    <span className="kr-occasion__action">View Templates <ArrowRight size={13} /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="kr-how" aria-labelledby="kr-how-title">
        <div className="kr-how__image" data-kr-reveal>
          <img src="/kadi/hero-phone.webp" alt="A mobile invitation displayed beside a sealed cream envelope and flowers" loading="lazy" />
          <Link href="/templates" className="kr-how__image-link" aria-label="Explore invitations"><ArrowUpRight size={18} /></Link>
        </div>
        <div className="kr-how__copy" data-kr-reveal>
          <p className="kr-eyebrow">How it works</p>
          <h2 id="kr-how-title">From envelope to experience</h2>
          <ol className="kr-steps">
            <li><span className="kr-step-number">01</span><div><h3>Choose your template</h3><p>Pick a style and customise it with your details.</p></div></li>
            <li><span className="kr-step-number">02</span><div><h3>Add your content</h3><p>Share your story, photos, venue, schedule and more.</p></div></li>
            <li><span className="kr-step-number">03</span><div><h3>Send & celebrate</h3><p>Get a unique link and share it with your guests.</p></div></li>
          </ol>
          <Link href="/app/events/new" className="kr-button kr-button--dark">Start Creating <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="kr-closing" aria-labelledby="kr-closing-title">
        <div className="kr-closing__art" aria-hidden="true" />
        <div className="kr-closing__content" data-kr-reveal>
          <h2 id="kr-closing-title">Good things are better when shared.</h2>
          <p>Join people creating beautiful invitations with Kadi.</p>
          <Link href="/app/events/new" className="kr-button kr-button--paper">Get Started <ArrowRight size={15} /></Link>
        </div>
        <footer className="kr-footer-line">
          <Link href="/" aria-label="Kadi home" className="flex items-center gap-2">
            <Logo size="sm" color="#e4cf9c" />
          </Link>
          <span>Beautiful invitations for life’s most memorable moments.</span>
          <span className="kr-footer-line__right">Invitations, with feeling.</span>
        </footer>
      </section>
    </main>
  );
}
