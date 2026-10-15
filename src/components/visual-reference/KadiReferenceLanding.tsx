'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  QrCode,
  BarChart3,
  Bell,
  ChevronDown,
  PartyPopper,
  GraduationCap,
  Flower2,
  Home,
} from 'lucide-react';
import { KadiFullViewportHero } from '@/components/landing/KadiFullViewportHero';
import { KADI_HERO_SLIDES } from '@/lib/landing-hero-slides';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { EVENT_CATEGORY_LABELS } from '@/lib/events/categories';
import { PublicFooter } from '@/components/layout/PublicFooter';
import type { TemplateDefinition } from '@/lib/templates/types';

/* ──────────────────────────────────────────────────────────────────────────
   Static data
   ────────────────────────────────────────────────────────────────────── */

const occasions = [
  { title: 'Weddings',      desc: 'Romantic & elegant',              image: '/kadi/category-botanical.webp', alt: 'Gold wax-sealed botanical envelope for weddings',     href: '/templates?category=wedding' },
  { title: 'Birthdays',     desc: 'Fun & vibrant',                   image: '/kadi/category-velvet.webp',    alt: 'Deep burgundy envelope for birthday celebrations',    href: '/templates?category=birthday' },
  { title: 'Graduations',   desc: 'Celebrate milestones',            image: '/kadi/category-celestial.webp', alt: 'Navy-toned envelope for graduation ceremonies',       href: '/templates?category=graduation' },
  { title: 'Housewarmings', desc: 'New beginnings',                  image: '/kadi/category-wedding.webp',   alt: 'Warm cream envelope for housewarming gatherings',     href: '/templates?category=housewarming' },
  { title: 'Memorials',     desc: 'Honour & remember',               image: '/kadi/category-letter.webp',    alt: 'Natural paper envelope for memorial services',        href: '/templates?category=memorial' },
  { title: 'Baby Showers',  desc: 'Sweet & personal',                image: '/kadi/category-blush.webp',     alt: 'Soft blush envelope for baby shower celebrations',    href: '/templates?category=baby-shower' },
  { title: 'Anniversaries', desc: 'Celebrate your story',            image: '/kadi/hero-envelope.webp',      alt: 'Elegant detailed envelope for anniversary events',    href: '/templates?category=anniversary' },
  { title: '& More',        desc: 'Corporate, engagements, holidays & more', image: '/kadi/category-botanical.webp', alt: 'Diverse occasion invitation styles', href: '/templates' },
];

const FEATURED_IDS = [
  'savannah-twilight',
  'ruby-disco-birthday',
  'summit-of-honor',
  'first-home-botanical',
  'everlasting-peace',
  'twilight-toast',
];

type IconComponent = typeof PartyPopper;

const experiences: Array<{ icon: IconComponent; label: string; desc: string; color: string }> = [
  { icon: PartyPopper,   label: 'Birthdays',    desc: 'Playful animations, vibrant colour palettes, age reveals and confetti effects.',                       color: '#D84D68' },
  { icon: GraduationCap, label: 'Graduations',   desc: 'Varsity colours, distinguished typography, academic honours and ceremony schedules.',                  color: '#1D4ED8' },
  { icon: Flower2,       label: 'Memorials',     desc: 'Serene tones, no celebratory effects. Space for tributes, condolences and service details.',           color: '#747D62' },
  { icon: Home,          label: 'Housewarmings', desc: 'Botanical warmth, open-door photography, neighbourhood maps and open-house schedules.',                color: '#49694C' },
];

const hostTools: Array<{ icon: IconComponent; title: string; desc: string }> = [
  { icon: Users,     title: 'Guest list',     desc: 'Add guests, import contacts, and keep track of who has been invited to your event.' },
  { icon: BarChart3, title: 'RSVP tracking',  desc: 'See real-time responses — attending, not attending and pending — at a glance.' },
  { icon: QrCode,    title: 'Share & QR code', desc: 'Get a unique shareable link and printable QR code for your invitation.' },
  { icon: Bell,      title: 'Event updates',   desc: 'Notify guests when plans change — new times, venues or additional details.' },
];

const faqItems = [
  { q: 'What is Kadi?',                        a: 'Kadi is a digital invitation platform designed for Kenya and beyond. Create beautiful, animated invitations for weddings, birthdays, graduations, memorials, housewarmings and more — then share them instantly with a simple link.' },
  { q: 'Is Kadi free to use?',                 a: 'You can explore all templates and start creating invitations at no cost. Some premium features may require a paid plan in the future.' },
  { q: 'Can I customise the templates?',        a: 'Yes. Every template can be personalised with your event details, photos, colours and content. You see a live preview as you edit, so there are no surprises.' },
  { q: 'How do guests open their invitation?',  a: 'Guests receive a link that opens a beautifully animated envelope experience in any browser. The envelope unseals and opens to reveal the full invitation — no app download needed.' },
  { q: 'What occasions does Kadi support?',     a: 'Kadi supports over 20 occasion types: weddings, birthdays, graduations, housewarmings, baby showers, memorials, funerals, engagements, anniversaries, corporate events, holidays, community gatherings and more.' },
  { q: 'Can I track RSVPs?',                   a: 'Yes. Every event includes a guest list, real-time RSVP tracking with attendance counts, and the ability to export guest data.' },
  { q: 'Do guests need to download an app?',    a: 'No. Kadi invitations work entirely in the browser. Guests simply tap the link on any device and enjoy the full animated experience.' },
];

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────── */

export default function KadiReferenceLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featuredTemplates = FEATURED_IDS
    .map((id) => TEMPLATES.find((t) => t.id === id))
    .filter((t): t is TemplateDefinition => !!t);

  /* Progressive scroll-reveal */
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.documentElement.classList.add('kr-motion-ready');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-kr-reveal]').forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('kr-motion-ready');
    };
  }, []);

  return (
    <main className="kr-site">
      {/* ── 1  HERO ───────────────────────────────────────────────────── */}
      <KadiFullViewportHero slides={KADI_HERO_SLIDES} />

      {/* ── 2  OCCASION EXPLORATION ───────────────────────────────────── */}
      <section id="kr-occasions" className="kr-occasions" aria-labelledby="kr-occasions-title">
        <div className="kr-container">
          <div className="kr-section-heading" data-kr-reveal>
            <p className="kr-eyebrow">Templates for every occasion</p>
            <h2 id="kr-occasions-title">Choose a style that tells your story</h2>
          </div>
          <div className="kr-occasion-rail" aria-label="Browse invitation occasions">
            {occasions.map((occ, i) => (
              <article
                className="kr-occasion"
                data-kr-reveal
                key={occ.title}
                style={{ '--kr-delay': `${i * 60}ms` } as CSSProperties & { '--kr-delay': string }}
              >
                <Link href={occ.href} className="kr-occasion__link">
                  <div className="kr-occasion__image-wrap">
                    <Image
                      src={occ.image}
                      alt={occ.alt}
                      fill
                      sizes="(max-width: 680px) 76vw, 22vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="kr-occasion__body">
                    <h3>{occ.title}</h3>
                    <p>{occ.desc}</p>
                    <span className="kr-occasion__action">
                      View Templates <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3  FEATURED TEMPLATES ─────────────────────────────────────── */}
      <section className="kr-featured" aria-labelledby="kr-featured-title">
        <div className="kr-container">
          <div className="kr-section-heading" data-kr-reveal>
            <p className="kr-eyebrow">Featured designs</p>
            <h2 id="kr-featured-title">Explore the template collection</h2>
          </div>
          <div className="kr-featured-grid" data-kr-reveal>
            {featuredTemplates.map((t) => {
              const label =
                (EVENT_CATEGORY_LABELS as Record<string, string>)[t.category] ?? t.category;
              return (
                <article className="kr-featured-card" key={t.id}>
                  <Link
                    href={`/templates?category=${t.category}`}
                    className="kr-featured-card__link"
                  >
                    <div className="kr-featured-card__image">
                      <Image
                        src={t.sampleData.heroImage}
                        alt={`${t.name} — ${label} invitation template`}
                        fill
                        unoptimized={t.sampleData.heroImage.startsWith('http')}
                        sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <span className="kr-featured-card__badge">{label}</span>
                    </div>
                    <div className="kr-featured-card__meta">
                      <h3>{t.name}</h3>
                      <p>{t.description}</p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
          <div className="kr-featured-cta" data-kr-reveal>
            <Link href="/templates" className="kr-button kr-button--dark">
              Browse all templates <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4  HOW IT WORKS ───────────────────────────────────────────── */}
      <section id="how-it-works" className="kr-how" aria-labelledby="kr-how-title">
        <div className="kr-how__image" data-kr-reveal>
          <Image
            src="/kadi/hero-phone.webp"
            alt="A mobile invitation displayed beside a sealed cream envelope and flowers"
            fill
            sizes="(max-width: 680px) 100vw, 50vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <Link href="/templates" className="kr-how__image-link" aria-label="Explore invitations">
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="kr-how__copy" data-kr-reveal>
          <p className="kr-eyebrow">How it works</p>
          <h2 id="kr-how-title">From envelope to experience</h2>
          <ol className="kr-steps">
            <li>
              <span className="kr-step-number">01</span>
              <div>
                <h3>Choose your template</h3>
                <p>Pick a style and customise it with your details.</p>
              </div>
            </li>
            <li>
              <span className="kr-step-number">02</span>
              <div>
                <h3>Add your content</h3>
                <p>Share your story, photos, venue, schedule and more.</p>
              </div>
            </li>
            <li>
              <span className="kr-step-number">03</span>
              <div>
                <h3>Send &amp; celebrate</h3>
                <p>Get a unique link and share it with your guests.</p>
              </div>
            </li>
          </ol>
          <Link href="/app/events/new" className="kr-button kr-button--dark">
            Start Creating <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── 5  EXPERIENCE BY EVENT TYPE ────────────────────────────────── */}
      <section className="kr-experiences" aria-labelledby="kr-experiences-title">
        <div className="kr-container">
          <div className="kr-section-heading" data-kr-reveal>
            <p className="kr-eyebrow">One platform, every occasion</p>
            <h2 id="kr-experiences-title">Every event gets the tone it deserves</h2>
          </div>
          <div className="kr-experiences-grid" data-kr-reveal>
            {experiences.map((exp) => (
              <div
                className="kr-experience-card"
                key={exp.label}
                style={{ '--exp-color': exp.color } as CSSProperties & { '--exp-color': string }}
              >
                <div className="kr-experience-card__icon">
                  <exp.icon size={22} />
                </div>
                <h3>{exp.label}</h3>
                <p>{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6  HOST TOOLS ─────────────────────────────────────────────── */}
      <section className="kr-tools" aria-labelledby="kr-tools-title">
        <div className="kr-container">
          <div className="kr-tools-layout" data-kr-reveal>
            <div className="kr-tools-copy">
              <p className="kr-eyebrow">Host tools</p>
              <h2 id="kr-tools-title">Everything you need to manage your event</h2>
              <p className="kr-tools-desc">
                Track RSVPs, share your invitation link, and keep your guest list organised — all
                from one dashboard.
              </p>
              <Link href="/app/events/new" className="kr-button kr-button--paper">
                Create an event <ArrowRight size={15} />
              </Link>
            </div>
            <div className="kr-tools-grid">
              {hostTools.map((tool) => (
                <div className="kr-tool-card" key={tool.title}>
                  <div className="kr-tool-card__icon">
                    <tool.icon size={20} />
                  </div>
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7  KENYAN CONTEXT ─────────────────────────────────────────── */}
      <section className="kr-kenyan" aria-labelledby="kr-kenyan-title">
        <div className="kr-container">
          <div className="kr-kenyan-inner" data-kr-reveal>
            <p className="kr-eyebrow kr-eyebrow--gold">Made for Kenya</p>
            <h2 id="kr-kenyan-title">Designed for the occasions that bring us together</h2>
            <p>
              Kadi is built with Kenyan venues, names and occasions in mind — from weddings at Safari
              Park to memorials at Langata, graduations at UoN and housewarmings in Karen. EAT
              timezone, M-Pesa-ready contributions, and templates that feel like home.
            </p>
            <p className="kr-kenyan-shared">Beautiful enough to share anywhere in the world.</p>
          </div>
        </div>
      </section>

      {/* ── 8  FAQ ────────────────────────────────────────────────────── */}
      <section className="kr-faq" aria-labelledby="kr-faq-title">
        <div className="kr-container">
          <div className="kr-section-heading" data-kr-reveal>
            <p className="kr-eyebrow">Common questions</p>
            <h2 id="kr-faq-title">Frequently asked questions</h2>
          </div>
          <div className="kr-faq-list" data-kr-reveal>
            {faqItems.map((item, i) => (
              <div className={`kr-faq-item${openFaq === i ? ' is-open' : ''}`} key={i}>
                <button
                  type="button"
                  className="kr-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-q-${i}`}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="kr-faq-chevron" aria-hidden="true" />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="kr-faq-answer"
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9  CLOSING CTA ────────────────────────────────────────────── */}
      <section className="kr-closing" aria-labelledby="kr-closing-title">
        <div className="kr-closing__art" aria-hidden="true" />
        <div className="kr-closing__content" data-kr-reveal>
          <h2 id="kr-closing-title">Good things are better when shared.</h2>
          <p>Join people creating beautiful invitations with Kadi.</p>
          <Link href="/app/events/new" className="kr-button kr-button--paper">
            Get Started <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── 10  FOOTER ────────────────────────────────────────────────── */}
      <PublicFooter />
    </main>
  );
}
