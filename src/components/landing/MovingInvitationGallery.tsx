'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  ArrowUpRight,
  Heart,
  X,
} from 'lucide-react';
import { filterInvitationGallery } from '@/lib/templates/gallery-search';

interface GalleryCardItem {
  id: string;
  templateId: string;
  category: string;
  categoryLabel: string;
  title: string;
  subtitle: string;
  dateText: string;
  venueText: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  layoutType:
    | 'anabel-petal-arch'
    | 'carla-cake-bunting'
    | 'thirty-photo-terracotta'
    | 'james-carla-canoe'
    | 'olivia-pastel-garland'
    | 'carla-photo-bows'
    | 'peter-sage-ribbon'
    | 'celestial-gold'
    | 'minimal-botanical'
    | 'watercolor-crest'
    | 'pastel-floral'
    | 'swahili-gold-lace'
    | 'kikuyu-ruracio-ochre'
    | 'retro-disco-wave'
    | 'vogue-editorial-photo'
    | 'amalfi-lemon-grove'
    | 'art-deco-noir'
    | 'celestial-starmap'
    | 'safari-wild-one';
  celebrants?: string;
  photoUrl?: string;
  rsvpText?: string;
}

const GALLERY_CARDS: GalleryCardItem[] = [
  // ── HERO REFERENCE CARDS (MATCHING kadi-gallery-reference.png) ──────────
  {
    id: 'anabel-wedding',
    templateId: 'savannah-twilight',
    category: 'wedding',
    categoryLabel: 'Wedding',
    title: 'Anabel Mahat & Daniel Graham',
    subtitle: 'Invite you to join them at the celebration of their marriage',
    dateText: 'APR 30. 2028 · 4:00 PM',
    venueText: '222 Highland Park Rd, East Flat Rock, NC',
    cardBg: '#FFFFFF',
    textColor: '#272620',
    accentColor: '#B99A62',
    layoutType: 'anabel-petal-arch',
    celebrants: 'Anabel & Daniel',
  },
  {
    id: 'carla-birthday',
    templateId: 'ruby-disco-birthday',
    category: 'birthday',
    categoryLabel: 'Birthday',
    title: 'Carla is turning 3!',
    subtitle: 'Join us for cake, games & balloons',
    dateText: 'March 24 2028',
    venueText: '380 Sutley Cir, Sacramento, CA, 95835',
    cardBg: '#FFFDF9',
    textColor: '#D84D68',
    accentColor: '#F59E0B',
    layoutType: 'carla-cake-bunting',
    rsvpText: 'RSVP to (123) 456-7890',
  },
  {
    id: 'thirty-hannah',
    templateId: 'coastal-romance',
    category: 'birthday',
    categoryLabel: 'Celebration',
    title: 'Thirty · Hannah',
    subtitle: 'Please join us for a birthday party celebrating Hannah',
    dateText: 'June 8th, 2028 | 6pm',
    venueText: '380 Sutley Cir, Sacramento, CA, 95835',
    cardBg: '#B67263',
    textColor: '#FFFFFF',
    accentColor: '#F3E5C8',
    layoutType: 'thirty-photo-terracotta',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rsvpText: 'Please RSVP to (123) 456-7890',
  },
  {
    id: 'james-carla',
    templateId: 'twilight-toast',
    category: 'wedding',
    categoryLabel: 'Wedding',
    title: 'James & Carla',
    subtitle: 'You are invited to the wedding of',
    dateText: 'Jan | 24 | 2028 at 9am',
    venueText: '4626 Eucalyptus Ave, Chino, CA, 91710',
    cardBg: '#D5C9C1',
    textColor: '#2E2824',
    accentColor: '#5F8569',
    layoutType: 'james-carla-canoe',
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80',
    rsvpText: 'RSVP Jenny: (302) 540-0713',
  },
  {
    id: 'olivia-birthday',
    templateId: 'pastel-garden-birthday',
    category: 'birthday',
    categoryLabel: 'Baby & Family',
    title: "Olivia's 1st Birthday",
    subtitle: "You're invited to celebrate Olivia's first milestone",
    dateText: 'Saturday · 1 - 4 p.m.',
    venueText: 'Zen Garden, Spring Valley',
    cardBg: '#F8FAF7',
    textColor: '#3A2E39',
    accentColor: '#F48FB1',
    layoutType: 'olivia-pastel-garland',
  },
  {
    id: 'carla-photo-party',
    templateId: 'birthday-color-pop',
    category: 'birthday',
    categoryLabel: 'Birthday',
    title: 'Carla Birthday Party',
    subtitle: 'Join us for fun, sweet treats and beach games',
    dateText: 'Saturday · Aug 5th · 10 a.m. - 2 p.m.',
    venueText: '919 Stemple Ct, Fairbanks, Alaska 99712',
    cardBg: '#F4F6FC',
    textColor: '#1E293B',
    accentColor: '#EC4899',
    layoutType: 'carla-photo-bows',
    photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
    rsvpText: 'RSVP To Jessica',
  },
  {
    id: 'david-peter',
    templateId: 'sage-love-letter',
    category: 'wedding',
    categoryLabel: 'Wedding',
    title: 'David & Peter',
    subtitle: 'Invite you to celebrate their wedding ceremony & reception',
    dateText: 'MAY 16, 2028 · 3:00 PM',
    venueText: 'Safari Park Gardens, Nairobi',
    cardBg: '#EBF3EA',
    textColor: '#2E4334',
    accentColor: '#5F8569',
    layoutType: 'peter-sage-ribbon',
  },
  {
    id: 'summit-of-honor',
    templateId: 'summit-of-honor',
    category: 'graduation',
    categoryLabel: 'Milestones & Honours',
    title: 'Dr. Marcus Omondi',
    subtitle: 'Doctor of Medicine · Class of 2027',
    dateText: 'DECEMBER 12, 2027 · 1:00 PM',
    venueText: 'Nairobi Serena Grand Ballroom',
    cardBg: '#0F1E36',
    textColor: '#F8FAFC',
    accentColor: '#F59E0B',
    layoutType: 'celestial-gold',
  },
  {
    id: 'first-home-botanical',
    templateId: 'first-home-botanical',
    category: 'housewarming',
    categoryLabel: 'Housewarming',
    title: 'Our New Haven',
    subtitle: 'Come warm our hearth and share a toast',
    dateText: 'SATURDAY, JULY 18 · 3:00 PM',
    venueText: '14 Acacia Lane, Karen',
    cardBg: '#F3F7F2',
    textColor: '#2E4334',
    accentColor: '#5F8569',
    layoutType: 'minimal-botanical',
  },
  {
    id: 'everlasting-peace',
    templateId: 'everlasting-peace',
    category: 'memorial',
    categoryLabel: 'Memorial',
    title: 'In Loving Memory of Mary Wanjiku',
    subtitle: 'A life beautifully lived, a heart deeply loved',
    dateText: 'OCTOBER 24, 2027 · 10:30 AM',
    venueText: 'All Saints Cathedral, Nairobi',
    cardBg: '#FAF9F6',
    textColor: '#2E332A',
    accentColor: '#7A8370',
    layoutType: 'watercolor-crest',
  },
  {
    id: 'twilight-toast',
    templateId: 'twilight-toast',
    category: 'anniversary',
    categoryLabel: 'Anniversary',
    title: 'James & Carla · 10 Years',
    subtitle: 'Together with our closest friends to celebrate a decade',
    dateText: 'JANUARY 24, 2028 · 7:00 PM',
    venueText: 'The View Rooftop, Westlands',
    cardBg: '#EFEAE3',
    textColor: '#2C2A26',
    accentColor: '#8C765C',
    layoutType: 'minimal-botanical',
    celebrants: 'James & Carla',
  },
  {
    id: 'sweet-dreams',
    templateId: 'sweet-beginnings',
    category: 'baby-shower',
    categoryLabel: 'Baby & Family',
    title: 'Welcome Baby Olivia',
    subtitle: 'A little flower is blooming soon',
    dateText: 'AUGUST 5TH, 2028 · 11:00 AM',
    venueText: 'Zen Garden, Spring Valley',
    cardBg: '#FFF9FB',
    textColor: '#A04561',
    accentColor: '#D97793',
    layoutType: 'pastel-floral',
  },
  {
    id: 'modern-monochrome',
    templateId: 'summit-executive',
    category: 'corporate',
    categoryLabel: 'Gala',
    title: 'The Horizon Gala 2028',
    subtitle: 'Honoring innovation in East African creative arts',
    dateText: 'NOVEMBER 28, 2028 · 6:30 PM',
    venueText: 'KICC Amphitheatre, Nairobi',
    cardBg: '#18181B',
    textColor: '#F4F4F5',
    accentColor: '#A1A1AA',
    layoutType: 'celestial-gold',
  },
  {
    id: 'bon-voyage-safari',
    templateId: 'bon-voyage-safari',
    category: 'milestone',
    categoryLabel: 'Milestones & Honours',
    title: 'Safari Golden Jubilee · 50',
    subtitle: 'Honoring David Gitau on his 50th Milestone Year',
    dateText: 'DECEMBER 5, 2027 · 6:00 PM',
    venueText: 'Hemingways Nairobi, Karen',
    cardBg: '#231B15',
    textColor: '#FDFCF7',
    accentColor: '#D4AF37',
    layoutType: 'celestial-gold',
  },
  {
    id: 'first-birthday-wild',
    templateId: 'ruby-disco-birthday',
    category: 'birthday',
    categoryLabel: 'Birthday',
    title: 'Liam is Wild One!',
    subtitle: 'Join the jungle safari for our little adventurer',
    dateText: 'APRIL 14, 2028 · 1:00 PM',
    venueText: 'Giraffe Manor Gardens, Langata',
    cardBg: '#FFFDF9',
    textColor: '#78350F',
    accentColor: '#D97706',
    layoutType: 'carla-cake-bunting',
  },
  // ── NEW BESPOKE DESIGN ARCHETYPES (EXPANDED DIVERSE SUITES) ───────────────
  {
    id: 'swahili-harusi-gold',
    templateId: 'harambee-cultural-night',
    category: 'heritage',
    categoryLabel: 'Heritage & African',
    title: 'Harusi Yetu · Tariq & Amina',
    subtitle: 'Familia za Shariff na Al-Bakri wanawaalika kwenye sherehe ya harusi na tafrija ya kipekee',
    dateText: 'JUMATATU · 18 DESEMBA 2028 · 4:00 PM',
    venueText: 'Fort Jesus Ocean Terrace, Mombasa',
    cardBg: '#181411',
    textColor: '#FAF6EE',
    accentColor: '#D4AF37',
    layoutType: 'swahili-gold-lace',
    celebrants: 'Tariq & Amina',
  },
  {
    id: 'kikuyu-ruracio-ochre',
    templateId: 'harambee-cultural-night',
    category: 'heritage',
    categoryLabel: 'Heritage & African',
    title: 'Ruracio · Njeri & Mwangi',
    subtitle: 'Kuhanda Ithigi & Traditional Betrothal Ceremony',
    dateText: 'SATURDAY, AUG 22, 2028 · 11:00 AM',
    venueText: 'Thuo Heritage Homestead, Nyeri',
    cardBg: '#3E1F10',
    textColor: '#FFFDF7',
    accentColor: '#E6AA38',
    layoutType: 'kikuyu-ruracio-ochre',
    celebrants: 'Njeri & Mwangi',
  },
  {
    id: 'retro-disco-wave',
    templateId: 'ruby-disco-birthday',
    category: 'birthday',
    categoryLabel: 'Birthday',
    title: 'Studio 74 · Chloe turns 30',
    subtitle: 'Boogie down with disco beats, sparkling mirror balls & cocktails',
    dateText: 'FRIDAY · OCT 27 · 8:00 PM TILL LATE',
    venueText: 'The Alchemist Courtyard, Westlands',
    cardBg: '#1B0824',
    textColor: '#FFF0F5',
    accentColor: '#F43F5E',
    layoutType: 'retro-disco-wave',
    rsvpText: 'Dress Code: 70s Glamour',
  },
  {
    id: 'vogue-editorial-photo',
    templateId: 'savannah-twilight',
    category: 'wedding',
    categoryLabel: 'Wedding',
    title: 'The Wedding of Vivienne & Alexander',
    subtitle: 'An intimate celebration of eternal vows & editorial romance',
    dateText: 'SEPTEMBER 12, 2028 · 3:30 PM',
    venueText: 'Villa Rosa Kempinski Grand Ballroom, Nairobi',
    cardBg: '#FAF8F5',
    textColor: '#1A1816',
    accentColor: '#8C7355',
    layoutType: 'vogue-editorial-photo',
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    celebrants: 'Vivienne & Alexander',
  },
  {
    id: 'amalfi-lemon-grove',
    templateId: 'harvest-table',
    category: 'anniversary',
    categoryLabel: 'Anniversary',
    title: 'A Summer in Amalfi · 25 Years',
    subtitle: 'Under the citrus canopy for a silver jubilee garden feast',
    dateText: 'SUNDAY · JULY 19, 2028 · 1:30 PM',
    venueText: 'Enashipai Resort & Spa, Naivasha',
    cardBg: '#FFFDF5',
    textColor: '#1E3A8A',
    accentColor: '#EAB308',
    layoutType: 'amalfi-lemon-grove',
    celebrants: 'Marco & Sophia',
  },
  {
    id: 'art-deco-noir',
    templateId: 'golden-soiree',
    category: 'corporate',
    categoryLabel: 'Honours',
    title: 'The Great Gatsby Midnight Gala',
    subtitle: 'An evening of live jazz, vintage champagne & roaring elegance',
    dateText: "NEW YEAR'S EVE · DEC 31 · 9:00 PM",
    venueText: 'Tribe Hotel Rooftop, Gigiri',
    cardBg: '#121212',
    textColor: '#F9F6EE',
    accentColor: '#D4AF37',
    layoutType: 'art-deco-noir',
  },
  {
    id: 'celestial-starmap',
    templateId: 'lullaby-stars',
    category: 'wedding',
    categoryLabel: 'Wedding',
    title: 'Written in the Stars · Maya & Leo',
    subtitle: 'Under the celestial canopy, we pledge our infinite journey',
    dateText: 'OCTOBER 14, 2028 · 6:30 PM',
    venueText: 'Lake Elementaita Astronomy Camp',
    cardBg: '#090D1E',
    textColor: '#FFFFFF',
    accentColor: '#FDE047',
    layoutType: 'celestial-starmap',
    celebrants: 'Maya & Leo',
  },
  {
    id: 'safari-wild-one',
    templateId: 'tender-welcome-baby',
    category: 'baby-shower',
    categoryLabel: 'Family',
    title: 'Zayn is The Wild One!',
    subtitle: 'Put on your safari hat & join our little explorer in the jungle',
    dateText: 'SATURDAY · NOV 4, 2028 · 11:00 AM',
    venueText: 'Langata Botanical Gardens, Nairobi',
    cardBg: '#FAF6ED',
    textColor: '#3D2E1E',
    accentColor: '#15803D',
    layoutType: 'safari-wild-one',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Weddings' },
  { id: 'heritage', label: 'Heritage & African' },
  { id: 'birthday', label: 'Birthdays' },
  { id: 'anniversary', label: 'Anniversaries' },
  { id: 'graduation', label: 'Honours' },
  { id: 'baby-shower', label: 'Family' },
  { id: 'memorial', label: 'Memorials' },
];

export function MovingInvitationGallery() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const hasActiveFilters = selectedCategory !== 'all' || normalizedQuery.length > 0;

  const filteredCards = useMemo(
    () => filterInvitationGallery(GALLERY_CARDS, selectedCategory, normalizedQuery),
    [normalizedQuery, selectedCategory]
  );

  // Distribute cards into 7 columns matching kadi-gallery-reference.png with deep scroll coverage
  const columns = useMemo(() => {
    if (hasActiveFilters) return [];
    if (selectedCategory === 'all') {
      // 7 distinct columns partitioned into 3 disjoint sets so NO adjacent columns ever share cards
      return [
        // Column 0
        [
          GALLERY_CARDS.find((c) => c.id === 'anabel-wedding')!,
          GALLERY_CARDS.find((c) => c.id === 'swahili-harusi-gold')!,
          GALLERY_CARDS.find((c) => c.id === 'thirty-hannah')!,
          GALLERY_CARDS.find((c) => c.id === 'vogue-editorial-photo')!,
          GALLERY_CARDS.find((c) => c.id === 'olivia-birthday')!,
        ],
        // Column 1
        [
          GALLERY_CARDS.find((c) => c.id === 'kikuyu-ruracio-ochre')!,
          GALLERY_CARDS.find((c) => c.id === 'carla-photo-party')!,
          GALLERY_CARDS.find((c) => c.id === 'summit-of-honor')!,
          GALLERY_CARDS.find((c) => c.id === 'amalfi-lemon-grove')!,
          GALLERY_CARDS.find((c) => c.id === 'everlasting-peace')!,
        ],
        // Column 2
        [
          GALLERY_CARDS.find((c) => c.id === 'retro-disco-wave')!,
          GALLERY_CARDS.find((c) => c.id === 'art-deco-noir')!,
          GALLERY_CARDS.find((c) => c.id === 'celestial-starmap')!,
          GALLERY_CARDS.find((c) => c.id === 'bon-voyage-safari')!,
          GALLERY_CARDS.find((c) => c.id === 'safari-wild-one')!,
        ],
        // Column 3
        [
          GALLERY_CARDS.find((c) => c.id === 'david-peter')!,
          GALLERY_CARDS.find((c) => c.id === 'james-carla')!,
          GALLERY_CARDS.find((c) => c.id === 'swahili-harusi-gold')!,
          GALLERY_CARDS.find((c) => c.id === 'carla-birthday')!,
          GALLERY_CARDS.find((c) => c.id === 'vogue-editorial-photo')!,
        ],
        // Column 4
        [
          GALLERY_CARDS.find((c) => c.id === 'amalfi-lemon-grove')!,
          GALLERY_CARDS.find((c) => c.id === 'first-home-botanical')!,
          GALLERY_CARDS.find((c) => c.id === 'kikuyu-ruracio-ochre')!,
          GALLERY_CARDS.find((c) => c.id === 'sweet-dreams')!,
          GALLERY_CARDS.find((c) => c.id === 'modern-monochrome')!,
        ],
        // Column 5
        [
          GALLERY_CARDS.find((c) => c.id === 'art-deco-noir')!,
          GALLERY_CARDS.find((c) => c.id === 'retro-disco-wave')!,
          GALLERY_CARDS.find((c) => c.id === 'celestial-starmap')!,
          GALLERY_CARDS.find((c) => c.id === 'first-birthday-wild')!,
          GALLERY_CARDS.find((c) => c.id === 'twilight-toast')!,
        ],
        // Column 6
        [
          GALLERY_CARDS.find((c) => c.id === 'safari-wild-one')!,
          GALLERY_CARDS.find((c) => c.id === 'thirty-hannah')!,
          GALLERY_CARDS.find((c) => c.id === 'anabel-wedding')!,
          GALLERY_CARDS.find((c) => c.id === 'james-carla')!,
          GALLERY_CARDS.find((c) => c.id === 'olivia-birthday')!,
        ],
      ];
    }

    return [];
  }, [hasActiveFilters]);

  const handleSelectCard = (templateId: string) => {
    // Open editor directly with template selected — no registration wall
    router.push(`/app/events/new?templateId=${encodeURIComponent(templateId)}`);
  };

  return (
    <section
      className={`relative w-full text-white select-none overflow-hidden ${hasActiveFilters ? "min-h-screen" : "h-[190vh] sm:h-[220vh]"}`}
      style={{
        background: 'radial-gradient(circle at 50% 35%, #466F7F 0%, #365B6A 50%, #284753 100%)',
      }}
    >
      {!hasActiveFilters ? (
        <>
          {/* Diagonal invitation tapestry: the unfiltered home remains an immersive, slow-moving gallery. */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360vw] sm:w-[230vw] h-[360vh] flex flex-row items-center justify-center gap-3.5 sm:gap-6 lg:gap-8 rotate-[11.5deg] pointer-events-auto transform-gpu select-none"
            style={{ willChange: 'transform' }}
          >
            {columns.map((colCards, colIdx) => {
              const animClass =
                colIdx % 2 === 0
                  ? colIdx % 4 === 0
                    ? 'kadi-stream-up'
                    : 'kadi-stream-up-fast'
                  : colIdx % 4 === 1
                  ? 'kadi-stream-down'
                  : 'kadi-stream-down-slow';

              // Repeat each column to preserve the seamless marquee on the home view.
              const streamItems = [...colCards, ...colCards, ...colCards, ...colCards];

              return (
                <div
                  key={'col-' + colIdx}
                  className="kadi-stream-column relative h-full flex flex-col gap-3.5 sm:gap-6 lg:gap-8 shrink-0 w-[145px] sm:w-[220px] md:w-[260px] lg:w-[290px] touch-pan-y"
                >
                  <div className={'kadi-stream-track ' + animClass + ' flex flex-col gap-3.5 sm:gap-6 lg:gap-8 w-full'}>
                    {streamItems.map((card, itemIdx) => (
                      <div key={card.id + '-' + colIdx + '-' + itemIdx} className="w-full shrink-0">
                        <InvitationGalleryCard
                          card={card}
                          onSelect={() => handleSelectCard(card.templateId)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Soft edge vignette keeps the moving invitation tapestry calm and cinematic. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_70%,_rgba(40,71,83,0.45)_100%)] pointer-events-none z-20" />
        </>
      ) : (
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-32 pb-16 sm:px-8 sm:pt-36">
          <div className="mb-7 flex flex-col gap-3 border-b border-white/20 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Kadi design library</p>
              <h1 className="font-serif text-3xl tracking-tight text-white sm:text-4xl">Find your invitation</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                Explore a specific occasion or search by name, style, date, or venue.
              </p>
            </div>
            <p className="text-sm text-white/75" aria-live="polite">
              {filteredCards.length} {filteredCards.length === 1 ? 'design' : 'designs'} found
            </p>
          </div>

          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {filteredCards.map((card) => (
                <InvitationGalleryCard
                  key={card.id}
                  card={card}
                  onSelect={() => handleSelectCard(card.templateId)}
                />
              ))}
            </div>
          ) : (
            <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center" role="status">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <Search size={22} aria-hidden="true" />
              </div>
              <h2 className="font-serif text-2xl text-white sm:text-3xl">No invitations match that search</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
                Try a shorter keyword or clear the filters to return to the full invitation gallery.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#284753] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Responsive navigation and invitation discovery controls. */}
      <header
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-30 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 bg-[#284753]/85 px-3.5 py-3 backdrop-blur-md sm:px-8 sm:py-3.5"
      >
        <div className="flex shrink-0 items-center">
          <Link href="/" className="group flex items-center" aria-label="Kadi home">
            <span className="select-none font-serif text-xl font-black tracking-[0.22em] text-white transition-transform group-hover:scale-105 sm:text-3xl">
              KADI
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1.5 rounded-full border border-white/20 p-1 2xl:flex" aria-label="Invitation categories">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive ? 'bg-white text-[#284753]' : 'text-white hover:bg-white/15'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden w-48 items-center gap-2 rounded-full border border-white/25 bg-black/10 px-3 py-2 2xl:flex">
          <Search size={14} className="shrink-0 text-white/80" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search invitation designs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search designs"
            className="w-full bg-transparent text-xs font-medium text-white placeholder-white/65 focus:outline-none"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="text-white/70 hover:text-white">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-5">
          <Link
            href="/app/events/new?blank=true"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10 sm:text-xs"
          >
            <Plus size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Start blank</span>
            <span className="sm:hidden">Create</span>
          </Link>
          <Link href="/login" className="px-1 py-2 text-[11px] font-semibold text-white/90 transition-colors hover:text-white hover:underline sm:text-xs">
            Sign in
          </Link>
        </div>

        {/* These controls stay available at phone, tablet, and laptop widths. */}
        <div className="flex w-full flex-col gap-2 pb-1 2xl:hidden">
          <div className="flex min-h-10 items-center gap-2 rounded-full border border-white/25 bg-black/10 px-3">
            <Search size={15} className="shrink-0 text-white/75" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search invitation designs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, occasion, date, or venue..."
              className="min-w-0 flex-1 bg-transparent py-2 text-xs text-white placeholder-white/65 focus:outline-none sm:text-sm"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="shrink-0 p-1 text-white/75 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <nav className="flex gap-1.5 overflow-x-auto px-0.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter invitation designs by occasion">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? 'border-white bg-white text-[#284753]'
                      : 'border-white/30 bg-white/5 text-white hover:bg-white/15'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>
    </section>
  );
}

// ── INDIVIDUAL HIGH-FIDELITY INVITATION CARD COMPONENT ────────────────────────
function InvitationGalleryCard({
  card,
  onSelect,
}: {
  card: GalleryCardItem;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`Customize ${card.title} - ${card.categoryLabel} invitation`}
      style={{
        transform: isHovered
          ? 'scale(1.03) translateZ(0)'
          : 'translateZ(0)',
      }}
      className={`group relative w-full aspect-[1/1.42] rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 select-none touch-pan-y ${
        isHovered
          ? 'z-40 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.85),0_0_0_2px_rgba(212,175,55,0.8)] ring-2 ring-[#D4AF37]'
          : 'shadow-[0_16px_36px_-10px_rgba(0,0,0,0.55)]'
      }`}
    >
      {/* Stationery Card Container with Texture */}
      <div
        className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative border border-white/20 transition-colors flex flex-col justify-between"
        style={{
          backgroundColor: card.cardBg,
          color: card.textColor,
        }}
      >
        {/* Subtle Paper Linen Texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${card.textColor} 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
          }}
        />

        {/* ── CARD SPECIFIC LAYOUT RENDERERS (kadi-gallery-reference.png) ──── */}

        {/* 1. ANABEL MAHAT & DANIEL GRAHAM (Petal Arch Frame) */}
        {card.layoutType === 'anabel-petal-arch' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col items-center justify-between">
            {/* Scalloped Watercolor Petal Arch Wreath SVG */}
            <div className="absolute inset-1 sm:inset-2 pointer-events-none flex items-center justify-center opacity-90">
              <svg viewBox="0 0 260 360" className="w-full h-full" fill="none">
                {/* Petals around the perimeter */}
                <g opacity="0.85">
                  {/* Top petals */}
                  <ellipse cx="130" cy="30" rx="14" ry="24" fill="#F4B5A4" transform="rotate(0 130 30)" />
                  <ellipse cx="160" cy="35" rx="13" ry="22" fill="#F9C8B5" transform="rotate(20 160 35)" />
                  <ellipse cx="100" cy="35" rx="13" ry="22" fill="#F29E88" transform="rotate(-20 100 35)" />
                  <ellipse cx="190" cy="50" rx="13" ry="22" fill="#F7B29D" transform="rotate(40 190 50)" />
                  <ellipse cx="70" cy="50" rx="13" ry="22" fill="#F5C0AC" transform="rotate(-40 70 50)" />
                  {/* Right petals */}
                  <ellipse cx="220" cy="80" rx="13" ry="22" fill="#F29E88" transform="rotate(65 220 80)" />
                  <ellipse cx="235" cy="120" rx="13" ry="22" fill="#F9C8B5" transform="rotate(85 235 120)" />
                  <ellipse cx="238" cy="160" rx="13" ry="22" fill="#F4B5A4" transform="rotate(90 238 160)" />
                  <ellipse cx="235" cy="200" rx="13" ry="22" fill="#F29E88" transform="rotate(95 235 200)" />
                  <ellipse cx="225" cy="240" rx="13" ry="22" fill="#F7B29D" transform="rotate(115 225 240)" />
                  <ellipse cx="205" cy="280" rx="13" ry="22" fill="#F5C0AC" transform="rotate(135 205 280)" />
                  {/* Left petals */}
                  <ellipse cx="40" cy="80" rx="13" ry="22" fill="#F7B29D" transform="rotate(-65 40 80)" />
                  <ellipse cx="25" cy="120" rx="13" ry="22" fill="#F5C0AC" transform="rotate(-85 25 120)" />
                  <ellipse cx="22" cy="160" rx="13" ry="22" fill="#F4B5A4" transform="rotate(-90 22 160)" />
                  <ellipse cx="25" cy="200" rx="13" ry="22" fill="#F9C8B5" transform="rotate(-95 25 200)" />
                  <ellipse cx="35" cy="240" rx="13" ry="22" fill="#F29E88" transform="rotate(-115 35 240)" />
                  <ellipse cx="55" cy="280" rx="13" ry="22" fill="#F7B29D" transform="rotate(-135 55 280)" />
                  {/* Bottom petals */}
                  <ellipse cx="85" cy="315" rx="13" ry="22" fill="#F5C0AC" transform="rotate(-155 85 315)" />
                  <ellipse cx="120" cy="330" rx="14" ry="24" fill="#F4B5A4" transform="rotate(175 120 330)" />
                  <ellipse cx="150" cy="328" rx="13" ry="22" fill="#F29E88" transform="rotate(-175 150 328)" />
                  <ellipse cx="180" cy="315" rx="13" ry="22" fill="#F9C8B5" transform="rotate(155 180 315)" />
                </g>
                {/* Center scalloped arch cut-out */}
                <path
                  d="M 65 70 C 65 50, 85 45, 130 45 C 175 45, 195 50, 195 70 C 195 80, 205 90, 205 180 C 205 270, 195 280, 195 290 C 195 310, 175 315, 130 315 C 85 315, 65 310, 65 290 C 65 280, 55 270, 55 180 C 55 90, 65 80, 65 70 Z"
                  fill="#FCFAF8"
                  stroke="#E8D5C4"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Typography inside the floral arch */}
            <div className="relative z-[2] my-auto text-center px-1.5 sm:px-4 py-1 sm:py-2 flex flex-col items-center">
              <h3 className="font-serif text-xs sm:text-base font-medium tracking-wide text-[#272620] mb-0.5 leading-tight">
                Anabel Mahat
              </h3>
              <span className="font-serif italic text-[10px] sm:text-xs text-[#B99A62] my-0.5 leading-none">&amp;</span>
              <h3 className="font-serif text-xs sm:text-base font-medium tracking-wide text-[#272620] mb-1 sm:mb-2 leading-tight">
                Daniel Graham
              </h3>

              <p className="text-[6.5px] sm:text-[9px] uppercase tracking-wider text-neutral-500 max-w-[120px] sm:max-w-[170px] leading-tight mb-1 sm:mb-2">
                Invite you to join them at the celebration of their marriage
              </p>

              <div className="font-serif font-bold text-[9px] sm:text-sm tracking-wider text-[#272620] mb-0.5 sm:mb-1">
                APR 30. 2028
              </div>

              <div className="text-[6.5px] sm:text-[8px] italic text-neutral-600 mb-0.5 sm:mb-1 leading-tight">
                at four o’clock in the afternoon
              </div>

              <div className="text-[6px] sm:text-[7.5px] text-neutral-600 leading-tight max-w-[110px] sm:max-w-[160px]">
                222 Highland Park Rd, NC
              </div>

              <div className="text-[6.5px] sm:text-[8px] italic text-neutral-500 mt-1 sm:mt-2 font-serif">
                Reception &amp; Dinner to follow
              </div>
            </div>
          </div>
        )}

        {/* 2. CARLA IS TURNING 3! (Bunting Banner + Cake + Balloons + Gifts) */}
        {card.layoutType === 'carla-cake-bunting' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between">
            {/* Top Party Bunting Garland */}
            <div className="relative w-full pt-0.5 sm:pt-1">
              <div className="flex justify-between items-center px-0.5 sm:px-1 mb-0.5 sm:mb-1">
                {['#4FD1C5', '#F687B3', '#F6AD55', '#68D391', '#63B3ED', '#F687B3', '#4FD1C5'].map(
                  (col, i) => (
                    <div
                      key={i}
                      className="w-2.5 sm:w-4 h-3.5 sm:h-5 shadow-xs"
                      style={{
                        backgroundColor: col,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Playful Headline */}
            <div className="text-center my-auto">
              <h2 className="text-xl sm:text-3xl font-black text-[#F25A75] tracking-tight leading-none mb-0.5">
                Carla
              </h2>
              <h3 className="text-sm sm:text-xl font-bold text-[#F25A75] tracking-tight mb-0.5 sm:mb-1">
                is turning 3!
              </h3>

              <div className="text-[8px] sm:text-[10px] font-bold text-neutral-700">
                March 24 2028
              </div>
              <div className="text-[6.5px] sm:text-[8px] text-neutral-500">
                Sacramento, CA
              </div>

              <div className="text-[6.5px] sm:text-[8px] font-semibold text-neutral-600 mt-0.5 sm:mt-1">
                RSVP to (123) 456-7890
              </div>
            </div>

            {/* Bottom Celebration Cake & Balloons Illustration */}
            <div className="relative w-full h-14 sm:h-24 flex items-end justify-center">
              <svg viewBox="0 0 200 100" className="w-full h-full" fill="none">
                {/* Pastel Balloons */}
                <ellipse cx="150" cy="28" rx="14" ry="18" fill="#FBD38D" opacity="0.9" />
                <path d="M 150 46 Q 152 70 148 85" stroke="#CBD5E1" strokeWidth="1" />
                <ellipse cx="168" cy="22" rx="14" ry="18" fill="#FED7E2" opacity="0.9" />
                <path d="M 168 40 Q 165 65 152 85" stroke="#CBD5E1" strokeWidth="1" />

                {/* Birthday Cake */}
                <rect x="35" y="60" width="80" height="26" rx="4" fill="#4FD1C5" />
                <path d="M 35 60 Q 45 68 55 60 Q 65 68 75 60 Q 85 68 95 60 Q 105 68 115 60 L 115 65 L 35 65 Z" fill="#FFFFFF" />
                <rect x="45" y="42" width="60" height="20" rx="3" fill="#F687B3" />
                <path d="M 45 42 Q 55 48 65 42 Q 75 48 85 42 Q 95 48 105 42 L 105 46 L 45 46 Z" fill="#FFFFFF" />

                {/* Candles */}
                <rect x="58" y="28" width="4" height="14" fill="#38B2AC" />
                <ellipse cx="60" cy="24" rx="2.5" ry="4" fill="#F6E05E" />
                <rect x="73" y="26" width="4" height="16" fill="#ED64A6" />
                <ellipse cx="75" cy="22" rx="2.5" ry="4" fill="#F6E05E" />
                <rect x="88" y="28" width="4" height="14" fill="#F6AD55" />
                <ellipse cx="90" cy="24" rx="2.5" ry="4" fill="#F6E05E" />

                {/* Wrapped Gift Boxes */}
                <rect x="122" y="58" width="28" height="28" rx="2" fill="#38B2AC" />
                <rect x="134" y="58" width="4" height="28" fill="#F687B3" />
                <rect x="122" y="70" width="28" height="4" fill="#F687B3" />
                <circle cx="136" cy="56" r="3" fill="#F687B3" />

                <rect x="144" y="66" width="24" height="20" rx="2" fill="#F6AD55" />
                <rect x="154" y="66" width="4" height="20" fill="#38B2AC" />
                <circle cx="156" cy="64" r="2.5" fill="#38B2AC" />
              </svg>
            </div>
          </div>
        )}

        {/* 3. THIRTY · HANNAH (Terracotta Rose + Pinned Photo + Floral Accents) */}
        {card.layoutType === 'thirty-photo-terracotta' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-white">
            {/* Top Script "Thirty" */}
            <div className="text-center pt-0.5 sm:pt-1">
              <span className="font-serif italic text-xl sm:text-3xl text-[#FCECD7] tracking-wide font-normal">
                Thirty
              </span>
              <div className="w-10 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-[#F3E5C8] to-transparent mx-auto mt-0.5" />
            </div>

            {/* Inset Photo pinned with gold seal */}
            <div className="relative w-18 sm:w-28 h-20 sm:h-32 mx-auto my-0.5 sm:my-1">
              {/* Photo Frame */}
              <div className="w-full h-full p-0.5 sm:p-1 bg-[#FAF6F0] rounded shadow-lg overflow-hidden transform -rotate-1">
                <img
                  src={card.photoUrl}
                  alt="Hannah"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              {/* Gold Pin on top */}
              <div className="absolute -top-1 sm:-top-1.5 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gradient-to-br from-[#F5DF9E] to-[#B99A62] shadow-sm border border-white/50" />
            </div>

            {/* Party Details */}
            <div className="text-center pb-0.5 sm:pb-1">
              <p className="text-[6.5px] sm:text-[8px] text-white/80 uppercase tracking-widest mb-0.5">
                Celebrating
              </p>
              <h3 className="font-serif italic text-base sm:text-xl text-[#FFF8F0] mb-0.5 sm:mb-1">
                Hannah
              </h3>
              <div className="text-[7.5px] sm:text-[9px] text-[#FCECD7] font-medium">
                {card.dateText}
              </div>
              <div className="text-[6.5px] sm:text-[7.5px] text-white/70 truncate px-1">
                {card.venueText}
              </div>
            </div>
          </div>
        )}

        {/* 4. JAMES & CARLA (Warm Greige + Eucalyptus Berries + Canoe Photo) */}
        {card.layoutType === 'james-carla-canoe' && (
          <div className="relative w-full h-full p-2 sm:p-3.5 flex flex-col justify-between text-[#2C2723]">
            {/* Top Eucalyptus Branch Garland */}
            <div className="relative w-full h-7 sm:h-10 flex justify-center">
              <svg viewBox="0 0 180 40" className="w-full h-full" fill="none">
                <path d="M 10 8 Q 90 22 170 8" stroke="#4A5568" strokeWidth="1" />
                {/* Leaves */}
                <ellipse cx="40" cy="16" rx="6" ry="12" fill="#718096" transform="rotate(30 40 16)" />
                <ellipse cx="65" cy="18" rx="7" ry="14" fill="#4A5568" transform="rotate(-25 65 18)" />
                <ellipse cx="90" cy="22" rx="7" ry="14" fill="#718096" transform="rotate(15 90 22)" />
                <ellipse cx="115" cy="18" rx="7" ry="14" fill="#4A5568" transform="rotate(-30 115 18)" />
                <ellipse cx="140" cy="16" rx="6" ry="12" fill="#718096" transform="rotate(25 140 16)" />
                {/* Dark berries */}
                <circle cx="52" cy="12" r="2.5" fill="#1A202C" />
                <circle cx="56" cy="14" r="2" fill="#1A202C" />
                <circle cx="102" cy="15" r="2.5" fill="#1A202C" />
                <circle cx="106" cy="18" r="2" fill="#1A202C" />
                <circle cx="128" cy="13" r="2.5" fill="#1A202C" />
              </svg>
            </div>

            {/* Wedding Invitation Text */}
            <div className="text-center my-auto px-1 sm:px-2">
              <span className="text-[6.5px] sm:text-[8px] uppercase tracking-widest text-neutral-600 block mb-0.5">
                Wedding of
              </span>
              <h2 className="font-serif italic text-base sm:text-2xl text-[#2B2622] mb-0.5 sm:mb-1.5">
                James &amp; Carla
              </h2>

              {/* Boxed Date */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 border border-neutral-400 rounded text-[7.5px] sm:text-[9px] font-serif mb-0.5 sm:mb-1">
                <span>Jan</span>
                <span>|</span>
                <span className="font-bold text-[10px] sm:text-xs">24</span>
                <span>|</span>
                <span>2028</span>
              </div>
              <div className="text-[6.5px] sm:text-[8px] text-neutral-600 mb-0.5 sm:mb-1">at 9am</div>

              <div className="text-[6px] sm:text-[7.5px] text-neutral-600 leading-tight truncate px-1">
                {card.venueText}
              </div>
              <div className="text-[6.5px] sm:text-[8px] font-medium text-neutral-700 mt-0.5 sm:mt-1">
                {card.rsvpText}
              </div>
            </div>

            {/* Inset Photo of Canoe at Bottom */}
            <div className="relative w-full h-11 sm:h-18 rounded-lg overflow-hidden border border-black/10 mt-0.5 sm:mt-1 shadow-sm">
              <img
                src={card.photoUrl}
                alt="James & Carla in canoe"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* 5. OLIVIA'S 1ST BIRTHDAY */}
        {card.layoutType === 'olivia-pastel-garland' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between">
            <div className="text-center pt-1 sm:pt-2">
              <div className="text-[7.5px] sm:text-[9px] font-medium text-neutral-500 uppercase tracking-widest">
                Saturday · 1 - 4 p.m.
              </div>
              <div className="text-[6.5px] sm:text-[8px] uppercase tracking-wider text-neutral-400 mt-0.5 sm:mt-1">
                You’re invited to
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-[#F48FB1] tracking-tight mt-0.5 sm:mt-1 leading-none">
                OLIVIA’S
              </h2>
              <div className="font-serif italic text-[10px] sm:text-xs text-neutral-600 mt-0.5">
                1st birthday party
              </div>
            </div>

            <div className="relative w-full h-12 sm:h-20 flex justify-center items-center">
              <span className="text-xl sm:text-3xl">🌸</span>
              <span className="text-base sm:text-2xl -ml-1 sm:-ml-2 mt-2 sm:mt-4">🌿</span>
              <span className="text-xl sm:text-3xl -ml-0.5 sm:-ml-1">🎀</span>
            </div>

            <div className="text-center pb-1 sm:pb-2 text-[6.5px] sm:text-[8px] text-neutral-500">
              Spring Valley, Nairobi
            </div>
          </div>
        )}

        {/* 6. JOIN US FOR CARLA TURNING (Photo + Stars) */}
        {card.layoutType === 'carla-photo-bows' && (
          <div className="relative w-full h-full p-2 sm:p-3.5 flex flex-col justify-between bg-[#F8FAFC]">
            <div className="flex justify-between items-center px-1 sm:px-2 pt-0.5 sm:pt-1 text-teal-400 text-xs">
              <span>★</span>
              <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest text-neutral-500">
                Join us for
              </span>
              <span>★</span>
            </div>

            <div className="relative w-16 sm:w-24 h-16 sm:h-24 mx-auto rounded-full overflow-hidden border-2 border-pink-300 shadow-md my-0.5 sm:my-1">
              <img
                src={card.photoUrl}
                alt="Birthday celebrant"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center my-auto">
              <h3 className="font-serif italic text-sm sm:text-lg text-pink-600">Carla</h3>
              <div className="text-[7.5px] sm:text-[9px] uppercase tracking-wider text-neutral-600">
                turning party
              </div>
              <div className="text-[6.5px] sm:text-[8px] text-neutral-500 mt-0.5 sm:mt-1 truncate px-1">
                {card.dateText}
              </div>
            </div>

            <div className="text-center text-[6px] sm:text-[7.5px] text-neutral-500 pb-0.5 sm:pb-1">
              {card.rsvpText}
            </div>
          </div>
        )}

        {/* 7. DAVID & PETER (Sage & Ribbon Flourish) */}
        {card.layoutType === 'peter-sage-ribbon' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-[#2E4334]">
            <div className="pt-1 sm:pt-2 text-center">
              <span className="text-[6.5px] sm:text-[8px] uppercase tracking-[0.25em] text-[#5F8569] block">
                Together with family
              </span>
            </div>

            <div className="my-auto text-center px-1">
              <h2 className="font-serif italic text-base sm:text-2xl text-[#2E4334] mb-0.5 sm:mb-1">
                David &amp; Peter
              </h2>
              <div className="w-8 sm:w-12 h-px bg-[#5F8569]/40 mx-auto my-1 sm:my-1.5" />
              <p className="text-[6.5px] sm:text-[8.5px] text-[#4A6451] max-w-[120px] sm:max-w-[170px] mx-auto leading-relaxed">
                Invite you to share in the joy of their marriage celebration
              </p>
            </div>

            <div className="text-center pb-1 sm:pb-2 text-[6.5px] sm:text-[8px] text-[#5F8569] truncate px-1">
              {card.dateText}
            </div>
          </div>
        )}

        {/* 8. CELESTIAL GOLD & HONOUR (Marcus Omondi) */}
        {card.layoutType === 'celestial-gold' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between pt-0.5 sm:pt-1 px-1">
              <span className="text-[10px] sm:text-[12px] text-[#EAB308]">✦</span>
              <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.2em] text-[#EAB308]">
                Honour Suite
              </span>
              <span className="text-[10px] sm:text-[12px] text-[#EAB308]">✦</span>
            </div>

            <div className="text-center my-auto px-1">
              <h3 className="font-serif text-sm sm:text-lg text-white font-medium mb-0.5 sm:mb-1">
                {card.title}
              </h3>
              <p className="text-[7px] sm:text-[9px] text-white/70 max-w-[130px] sm:max-w-[180px] mx-auto leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="text-center border-t border-white/10 pt-1 sm:pt-2 text-[6.5px] sm:text-[8px] text-white/60 truncate px-1">
              {card.dateText}
            </div>
          </div>
        )}

        {/* 9. MINIMAL BOTANICAL / WATERCOLOR CREST / PASTEL FLORAL FALLBACKS */}
        {(card.layoutType === 'minimal-botanical' ||
          card.layoutType === 'watercolor-crest' ||
          card.layoutType === 'pastel-floral') && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between">
            <div className="text-center pt-1 sm:pt-2">
              <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest opacity-60">
                {card.categoryLabel} Collection
              </span>
            </div>

            <div className="text-center my-auto px-1">
              <h3 className="font-serif text-sm sm:text-xl mb-0.5 sm:mb-1">{card.title}</h3>
              <p className="text-[7px] sm:text-[9px] opacity-75 max-w-[130px] sm:max-w-[180px] mx-auto leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="text-center border-t border-black/10 pt-1 sm:pt-2 text-[6.5px] sm:text-[8px] opacity-70 truncate px-1">
              {card.dateText}
            </div>
          </div>
        )}

        {/* 10. SWAHILI COASTAL HARUSI YETU (Gold Lace & Ogee Arch) */}
        {card.layoutType === 'swahili-gold-lace' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-[#FAF6EE]">
            <div className="absolute inset-1 sm:inset-2 pointer-events-none opacity-85">
              <svg viewBox="0 0 240 340" className="w-full h-full" fill="none">
                <path
                  d="M 20 80 Q 20 30 70 20 Q 120 10 120 5 Q 120 10 170 20 Q 220 30 220 80 L 220 320 L 20 320 Z"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                <path
                  d="M 26 84 Q 26 36 72 26 Q 120 17 120 12 Q 120 17 168 26 Q 214 36 214 84 L 214 314 L 26 314 Z"
                  stroke="#B8860B"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                />
                <circle cx="120" cy="5" r="3" fill="#D4AF37" />
                <circle cx="32" cy="308" r="4" fill="#D4AF37" fillOpacity="0.3" stroke="#D4AF37" strokeWidth="1" />
                <circle cx="208" cy="308" r="4" fill="#D4AF37" fillOpacity="0.3" stroke="#D4AF37" strokeWidth="1" />
              </svg>
            </div>

            <div className="relative z-[2] text-center pt-2 sm:pt-3">
              <span className="text-[7.5px] sm:text-[9.5px] uppercase tracking-[0.28em] text-[#D4AF37] font-semibold block">
                Harusi Yetu
              </span>
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-1" />
            </div>

            <div className="relative z-[2] text-center my-auto px-2">
              <h3 className="font-serif text-sm sm:text-lg font-medium tracking-wide text-[#FAF6EE] leading-tight">
                Tariq
              </h3>
              <span className="font-serif italic text-xs sm:text-sm text-[#D4AF37] leading-none my-0.5 block">&amp;</span>
              <h3 className="font-serif text-sm sm:text-lg font-medium tracking-wide text-[#FAF6EE] leading-tight mb-1 sm:mb-2">
                Amina
              </h3>
              <p className="text-[6.5px] sm:text-[8px] text-[#E0D7C6] max-w-[130px] sm:max-w-[180px] mx-auto leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="relative z-[2] text-center pb-2 sm:pb-3 border-t border-[#D4AF37]/20 pt-1.5 sm:pt-2">
              <div className="text-[7px] sm:text-[8.5px] text-[#D4AF37] font-bold tracking-wider mb-0.5 truncate px-1">
                {card.dateText}
              </div>
              <div className="text-[6px] sm:text-[7.5px] text-[#B8AF9F] truncate px-1">
                {card.venueText}
              </div>
            </div>
          </div>
        )}

        {/* 11. KIKUYU TRADITIONAL RURACIO (Ochre & Beaded Chevrons) */}
        {card.layoutType === 'kikuyu-ruracio-ochre' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-[#FFFDF7]">
            <div className="relative w-full pt-1">
              <div className="flex justify-center items-center gap-1 sm:gap-1.5 mb-1">
                {['#DC2626', '#2563EB', '#F8FAFC', '#F59E0B', '#16A34A', '#DC2626', '#2563EB'].map((c, i) => (
                  <div key={i} className="w-2.5 sm:w-3.5 h-1.5 sm:h-2 rounded-xs" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="text-center">
                <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.25em] text-[#E6AA38] font-bold">
                  Kuhanda Ithigi
                </span>
              </div>
            </div>

            <div className="my-auto text-center px-1">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#E6AA38]/20 border border-[#E6AA38]/40 text-[7px] sm:text-[8.5px] font-semibold text-[#FDE68A] uppercase tracking-wider mb-1">
                Traditional Ruracio
              </div>
              <h2 className="font-serif text-base sm:text-2xl text-[#FFFDF7] font-bold tracking-tight mb-0.5 leading-tight">
                Njeri &amp; Mwangi
              </h2>
              <div className="w-10 sm:w-16 h-0.5 bg-[#E6AA38] mx-auto my-1.5" />
              <p className="text-[6.5px] sm:text-[8px] text-[#F3E8E2] max-w-[130px] sm:max-w-[180px] mx-auto leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="text-center pb-1 sm:pb-2 pt-1.5 border-t border-[#E6AA38]/30">
              <div className="text-[7.5px] sm:text-[9px] font-bold text-[#E6AA38] tracking-wide">
                {card.dateText}
              </div>
              <div className="text-[6px] sm:text-[7.5px] text-[#E0D0C5] mt-0.5">
                {card.venueText}
              </div>
            </div>
          </div>
        )}

        {/* 12. RETRO 70s DISCO WAVE (Electric Plum & Funk Ribbons) */}
        {card.layoutType === 'retro-disco-wave' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-[#FFF0F5] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
                <path d="M -20 50 Q 80 120 180 50 Q 220 20 250 80" stroke="#F43F5E" strokeWidth="12" opacity="0.6"/>
                <path d="M -20 70 Q 80 140 180 70 Q 220 40 250 100" stroke="#F59E0B" strokeWidth="10" opacity="0.7"/>
                <path d="M -20 90 Q 80 160 180 90 Q 220 60 250 120" stroke="#06B6D4" strokeWidth="8" opacity="0.5"/>
              </svg>
            </div>

            <div className="relative z-[2] text-center pt-1 flex flex-col items-center">
              <div className="w-9 sm:w-12 h-9 sm:h-12 rounded-full bg-white/10 border border-white/30 backdrop-blur-xs flex items-center justify-center shadow-lg">
                <span className="text-base sm:text-xl">🪩</span>
              </div>
              <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.25em] text-[#F43F5E] font-black mt-1">
                Studio 74
              </span>
            </div>

            <div className="relative z-[2] my-auto text-center px-1">
              <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F43F5E] via-[#FBBF24] to-[#38BDF8] tracking-tight leading-none mb-1">
                CHLOE
              </h2>
              <div className="text-[10px] sm:text-sm font-bold text-white tracking-wide uppercase">
                Turns 30!
              </div>
              <p className="text-[6.5px] sm:text-[8px] text-white/80 max-w-[130px] sm:max-w-[170px] mx-auto mt-1 leading-snug">
                {card.subtitle}
              </p>
            </div>

            <div className="relative z-[2] text-center pb-1 sm:pb-2 pt-1 border-t border-white/15">
              <div className="text-[7.5px] sm:text-[9px] font-bold text-[#FBBF24]">
                {card.dateText}
              </div>
              <div className="text-[6px] sm:text-[7.5px] text-white/70 mt-0.5">
                {card.rsvpText}
              </div>
            </div>
          </div>
        )}

        {/* 13. VOGUE EDITORIAL ROMANCE (Arched Photo & Masthead) */}
        {card.layoutType === 'vogue-editorial-photo' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-[#1A1816]">
            <div className="text-center pt-0.5 sm:pt-1 border-b border-black/15 pb-1 sm:pb-1.5 flex items-center justify-between px-1">
              <span className="text-[6.5px] sm:text-[8px] font-mono tracking-widest uppercase text-neutral-500">
                ISSUE NO. 12
              </span>
              <span className="font-serif font-bold text-[9px] sm:text-xs tracking-[0.25em] text-[#1A1816]">
                VOWS
              </span>
              <span className="text-[6.5px] sm:text-[8px] font-mono tracking-widest uppercase text-neutral-500">
                EDITION
              </span>
            </div>

            <div className="relative w-24 sm:w-36 h-28 sm:h-40 mx-auto my-auto rounded-t-full rounded-b-md overflow-hidden shadow-lg border-2 border-white">
              {card.photoUrl && (
                <img
                  src={card.photoUrl}
                  alt={card.celebrants || card.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            <div className="text-center pb-1 sm:pb-2">
              <h3 className="font-serif italic text-xs sm:text-base font-medium text-[#1A1816] leading-tight">
                Vivienne &amp; Alexander
              </h3>
              <p className="text-[6.5px] sm:text-[8px] uppercase tracking-wider text-neutral-600 mt-0.5">
                {card.dateText}
              </p>
              <div className="text-[6px] sm:text-[7.5px] text-neutral-500 font-mono mt-0.5">
                1°16&apos;05.4&quot;S 36°48&apos;33.1&quot;E · Nairobi
              </div>
            </div>
          </div>
        )}

        {/* 14. AMALFI LEMON GROVE (Majolica Tile & Citrus Jubilee) */}
        {card.layoutType === 'amalfi-lemon-grove' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-[#1E3A8A]">
            <div className="absolute inset-1 sm:inset-2 pointer-events-none opacity-80">
              <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
                <rect x="5" y="5" width="22" height="22" stroke="#1E3A8A" strokeWidth="1.2" fill="#EFF6FF" />
                <circle cx="16" cy="16" r="6" fill="#EAB308" />
                <rect x="173" y="5" width="22" height="22" stroke="#1E3A8A" strokeWidth="1.2" fill="#EFF6FF" />
                <circle cx="184" cy="16" r="6" fill="#EAB308" />
                <rect x="5" y="273" width="22" height="22" stroke="#1E3A8A" strokeWidth="1.2" fill="#EFF6FF" />
                <circle cx="16" cy="284" r="6" fill="#EAB308" />
                <rect x="173" y="273" width="22" height="22" stroke="#1E3A8A" strokeWidth="1.2" fill="#EFF6FF" />
                <circle cx="184" cy="284" r="6" fill="#EAB308" />
                <rect x="10" y="10" width="180" height="280" stroke="#1E3A8A" strokeWidth="1" strokeDasharray="3 3"/>
              </svg>
            </div>

            <div className="relative z-[2] text-center pt-2 sm:pt-3">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-sm sm:text-base">🍋</span>
                <span className="text-[7.5px] sm:text-[9.5px] uppercase tracking-[0.25em] text-[#1E3A8A] font-bold">
                  Amalfi Soirée
                </span>
                <span className="text-sm sm:text-base">🍋</span>
              </div>
              <div className="w-10 sm:w-14 h-px bg-[#EAB308] mx-auto" />
            </div>

            <div className="relative z-[2] text-center my-auto px-2">
              <h2 className="font-serif italic text-base sm:text-2xl text-[#1E3A8A] font-bold leading-tight">
                A Summer in Amalfi
              </h2>
              <div className="text-[8px] sm:text-[10px] font-serif uppercase tracking-widest text-[#B45309] font-semibold mt-0.5">
                25th Wedding Anniversary
              </div>
              <p className="text-[6.5px] sm:text-[8px] text-neutral-600 max-w-[130px] sm:max-w-[170px] mx-auto mt-1 leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="relative z-[2] text-center pb-2 sm:pb-3 border-t border-[#1E3A8A]/20 pt-1">
              <div className="text-[7px] sm:text-[8.5px] font-bold text-[#1E3A8A]">{card.dateText}</div>
              <div className="text-[6px] sm:text-[7.5px] text-neutral-500 mt-0.5">{card.venueText}</div>
            </div>
          </div>
        )}

        {/* 15. ART DECO NOIR (Onyx & Stepped Gold Geometrics) */}
        {card.layoutType === 'art-deco-noir' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-[#F9F6EE]">
            <div className="absolute inset-1 sm:inset-2 pointer-events-none opacity-90">
              <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
                <rect x="6" y="6" width="188" height="288" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="12" y="12" width="176" height="276" stroke="#B8860B" strokeWidth="0.8" />
                <path d="M 6 30 L 30 6 M 6 36 L 36 6 M 170 6 L 194 30 M 164 6 L 194 36 M 6 270 L 30 294 M 6 264 L 36 294 M 170 294 L 194 270 M 164 294 L 194 264" stroke="#D4AF37" strokeWidth="1"/>
                <polygon points="100,8 108,18 100,28 92,18" fill="#D4AF37"/>
              </svg>
            </div>

            <div className="relative z-[2] text-center pt-3 sm:pt-4">
              <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block">
                The Great Gatsby
              </span>
              <div className="text-[6px] sm:text-[7.5px] tracking-widest text-neutral-400 uppercase mt-0.5">
                Midnight Soirée
              </div>
            </div>

            <div className="relative z-[2] text-center my-auto px-2">
              <h2 className="font-serif text-sm sm:text-xl font-medium tracking-[0.15em] text-[#F9F6EE] uppercase mb-1 leading-tight">
                Midnight Gala
              </h2>
              <div className="w-8 sm:w-12 h-px bg-[#D4AF37] mx-auto my-1" />
              <p className="text-[6.5px] sm:text-[8px] text-neutral-300 max-w-[130px] sm:max-w-[170px] mx-auto leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="relative z-[2] text-center pb-3 sm:pb-4 border-t border-[#D4AF37]/25 pt-1.5">
              <div className="text-[7.5px] sm:text-[9px] font-bold text-[#D4AF37] tracking-wider">
                {card.dateText}
              </div>
              <div className="text-[6px] sm:text-[7.5px] text-neutral-400 mt-0.5">
                {card.venueText}
              </div>
            </div>
          </div>
        )}

        {/* 16. CELESTIAL STARMAP (Midnight Navy & Constellation) */}
        {card.layoutType === 'celestial-starmap' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-white overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-85">
              <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
                <line x1="30" y1="60" x2="65" y2="40" stroke="#FDE047" strokeWidth="0.8" opacity="0.6"/>
                <line x1="65" y1="40" x2="110" y2="55" stroke="#FDE047" strokeWidth="0.8" opacity="0.6"/>
                <line x1="110" y1="55" x2="160" y2="35" stroke="#FDE047" strokeWidth="0.8" opacity="0.6"/>
                <line x1="40" y1="240" x2="85" y2="260" stroke="#FDE047" strokeWidth="0.8" opacity="0.6"/>
                <line x1="85" y1="260" x2="150" y2="245" stroke="#FDE047" strokeWidth="0.8" opacity="0.6"/>
                <circle cx="30" cy="60" r="2" fill="#FFFFFF"/>
                <circle cx="65" cy="40" r="2.5" fill="#FDE047"/>
                <circle cx="110" cy="55" r="2" fill="#FFFFFF"/>
                <circle cx="160" cy="35" r="3" fill="#FDE047"/>
                <circle cx="40" cy="240" r="2" fill="#FFFFFF"/>
                <circle cx="85" cy="260" r="2.5" fill="#FDE047"/>
                <circle cx="150" cy="245" r="2" fill="#FFFFFF"/>
                <circle cx="100" cy="150" r="60" fill="#3B82F6" fillOpacity="0.08"/>
              </svg>
            </div>

            <div className="relative z-[2] text-center pt-1 sm:pt-2">
              <div className="flex items-center justify-center gap-1 text-[8px] sm:text-[10px] text-[#FDE047] opacity-90">
                <span>🌑</span>
                <span>🌒</span>
                <span>🌕</span>
                <span>🌘</span>
                <span>🌑</span>
              </div>
              <span className="text-[6.5px] sm:text-[8px] uppercase tracking-[0.25em] text-[#FDE047] font-semibold block mt-0.5">
                Written in the Stars
              </span>
            </div>

            <div className="relative z-[2] text-center my-auto px-1">
              <h2 className="font-serif italic text-base sm:text-2xl text-white font-normal leading-tight">
                Maya &amp; Leo
              </h2>
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#FDE047] to-transparent mx-auto my-1" />
              <p className="text-[6.5px] sm:text-[8px] text-white/80 max-w-[130px] sm:max-w-[175px] mx-auto leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="relative z-[2] text-center pb-1 sm:pb-2 border-t border-white/10 pt-1">
              <div className="text-[7.5px] sm:text-[9px] font-semibold text-[#FDE047]">{card.dateText}</div>
              <div className="text-[6px] sm:text-[7.5px] text-white/60 mt-0.5">{card.venueText}</div>
            </div>
          </div>
        )}

        {/* 17. SAFARI WILD ONE (Tropical Jungle & Lion Cub) */}
        {card.layoutType === 'safari-wild-one' && (
          <div className="relative w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-[#3D2E1E]">
            <div className="relative w-full pt-0.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-base sm:text-xl">🌿</span>
                <div className="text-center">
                  <span className="text-[7px] sm:text-[8.5px] uppercase tracking-[0.22em] text-[#15803D] font-black">
                    Safari Expedition
                  </span>
                </div>
                <span className="text-base sm:text-xl">🌴</span>
              </div>
            </div>

            <div className="my-auto text-center px-1">
              <div className="w-10 sm:w-14 h-10 sm:h-14 mx-auto mb-1 flex items-center justify-center">
                <span className="text-2xl sm:text-4xl">🦁</span>
              </div>
              <h2 className="font-serif text-base sm:text-2xl font-black text-[#B45309] leading-tight">
                Zayn
              </h2>
              <div className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#15803D]">
                is The Wild One!
              </div>
              <p className="text-[6.5px] sm:text-[8px] text-neutral-600 max-w-[130px] sm:max-w-[170px] mx-auto mt-1 leading-snug">
                {card.subtitle}
              </p>
            </div>

            <div className="text-center pb-1 sm:pb-2 pt-1 border-t border-amber-900/15">
              <div className="text-[7.5px] sm:text-[9px] font-bold text-[#B45309]">{card.dateText}</div>
              <div className="text-[6px] sm:text-[7.5px] text-neutral-500 mt-0.5">{card.venueText}</div>
            </div>
          </div>
        )}

        {/* ── HOVER OVERLAY: "CUSTOMIZE THIS DESIGN" ACTION PILL ───────── */}
        <div
          className={`absolute inset-0 z-30 bg-black/25 backdrop-blur-[1px] rounded-xl sm:rounded-2xl flex items-center justify-center p-3 sm:p-4 transition-all duration-200 ${
            isHovered
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Frosted Action Island (keeps the canvas fully visible while making text 100% legible) */}
          <div className="flex flex-col items-center justify-center text-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.6)] space-y-1.5 sm:space-y-2">
            <span className="text-[8.5px] sm:text-[10.5px] font-sans uppercase tracking-[0.22em] text-[#E6CA92] font-bold">
              {card.categoryLabel}
            </span>
            <div className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white hover:bg-[#FAF8F5] text-[#112327] font-sans font-bold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-md border border-white/80 transform transition-transform group-hover:scale-105 active:scale-95">
              <span>Customize</span>
              <ArrowUpRight size={13} className="text-[#B99A62] stroke-[2.5]" />
            </div>
            <span className="text-[7.5px] sm:text-[9.5px] text-white/90 font-sans font-medium tracking-wide">
              No signup required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
