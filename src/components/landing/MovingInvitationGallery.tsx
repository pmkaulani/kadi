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
    | 'pastel-floral';
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
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'wedding', label: 'Weddings' },
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
  // Filter cards based on category and search query
  const filteredCards = useMemo(() => {
    return GALLERY_CARDS.filter((card) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        card.category === selectedCategory ||
        (selectedCategory === 'wedding' && card.category === 'anniversary') ||
        (selectedCategory === 'graduation' && (card.category === 'milestone' || card.category === 'corporate'));
      const matchesSearch =
        !searchQuery ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Distribute cards into 5 columns matching kadi-gallery-reference.png with deep scroll coverage
  const columns = useMemo(() => {
    if (selectedCategory === 'all' && !searchQuery) {
      // 7 distinct columns partitioned into 3 disjoint sets so NO adjacent columns ever share cards
      // Set 1: anabel-wedding, carla-birthday, thirty-hannah, james-carla, olivia-birthday
      // Set 2: carla-photo-party, david-peter, summit-of-honor, first-home-botanical, everlasting-peace
      // Set 3: twilight-toast, sweet-dreams, modern-monochrome, bon-voyage-safari, first-birthday-wild

      return [
        // Column 0 (Set 1)
        [
          GALLERY_CARDS.find((c) => c.id === 'anabel-wedding')!,
          GALLERY_CARDS.find((c) => c.id === 'carla-birthday')!,
          GALLERY_CARDS.find((c) => c.id === 'thirty-hannah')!,
          GALLERY_CARDS.find((c) => c.id === 'james-carla')!,
          GALLERY_CARDS.find((c) => c.id === 'olivia-birthday')!,
        ],
        // Column 1 (Set 2)
        [
          GALLERY_CARDS.find((c) => c.id === 'carla-photo-party')!,
          GALLERY_CARDS.find((c) => c.id === 'david-peter')!,
          GALLERY_CARDS.find((c) => c.id === 'summit-of-honor')!,
          GALLERY_CARDS.find((c) => c.id === 'first-home-botanical')!,
          GALLERY_CARDS.find((c) => c.id === 'everlasting-peace')!,
        ],
        // Column 2 (Set 3)
        [
          GALLERY_CARDS.find((c) => c.id === 'twilight-toast')!,
          GALLERY_CARDS.find((c) => c.id === 'sweet-dreams')!,
          GALLERY_CARDS.find((c) => c.id === 'modern-monochrome')!,
          GALLERY_CARDS.find((c) => c.id === 'bon-voyage-safari')!,
          GALLERY_CARDS.find((c) => c.id === 'first-birthday-wild')!,
        ],
        // Column 3 (Set 1 - permuted)
        [
          GALLERY_CARDS.find((c) => c.id === 'thirty-hannah')!,
          GALLERY_CARDS.find((c) => c.id === 'olivia-birthday')!,
          GALLERY_CARDS.find((c) => c.id === 'anabel-wedding')!,
          GALLERY_CARDS.find((c) => c.id === 'james-carla')!,
          GALLERY_CARDS.find((c) => c.id === 'carla-birthday')!,
        ],
        // Column 4 (Set 2 - permuted)
        [
          GALLERY_CARDS.find((c) => c.id === 'summit-of-honor')!,
          GALLERY_CARDS.find((c) => c.id === 'first-home-botanical')!,
          GALLERY_CARDS.find((c) => c.id === 'david-peter')!,
          GALLERY_CARDS.find((c) => c.id === 'everlasting-peace')!,
          GALLERY_CARDS.find((c) => c.id === 'carla-photo-party')!,
        ],
        // Column 5 (Set 3 - permuted)
        [
          GALLERY_CARDS.find((c) => c.id === 'bon-voyage-safari')!,
          GALLERY_CARDS.find((c) => c.id === 'first-birthday-wild')!,
          GALLERY_CARDS.find((c) => c.id === 'sweet-dreams')!,
          GALLERY_CARDS.find((c) => c.id === 'twilight-toast')!,
          GALLERY_CARDS.find((c) => c.id === 'modern-monochrome')!,
        ],
        // Column 6 (Set 1 - permuted)
        [
          GALLERY_CARDS.find((c) => c.id === 'james-carla')!,
          GALLERY_CARDS.find((c) => c.id === 'carla-birthday')!,
          GALLERY_CARDS.find((c) => c.id === 'olivia-birthday')!,
          GALLERY_CARDS.find((c) => c.id === 'thirty-hannah')!,
          GALLERY_CARDS.find((c) => c.id === 'anabel-wedding')!,
        ],
      ];
    }

    // Dynamic distribution when filtered by category or search:
    const cols: GalleryCardItem[][] = [[], [], [], [], [], [], []];
    const sourceCards = filteredCards.length > 0 ? filteredCards : GALLERY_CARDS;
    sourceCards.forEach((card, i) => {
      cols[i % 7].push(card);
    });
    return cols.map((colCards, idx) => {
      let padded = [...colCards];
      if (padded.length === 0) {
        padded = [
          sourceCards[idx % sourceCards.length],
          sourceCards[(idx + 2) % sourceCards.length],
          sourceCards[(idx + 4) % sourceCards.length],
        ];
      }
      while (padded.length < 5) {
        padded = [...padded, ...padded];
      }
      return padded.slice(0, 5);
    });
  }, [filteredCards, selectedCategory, searchQuery]);

  const handleSelectCard = (templateId: string) => {
    // Open editor directly with template selected — no registration wall
    router.push(`/app/events/new?templateId=${encodeURIComponent(templateId)}`);
  };

  return (
    <section
      className="relative w-full h-[190vh] sm:h-[220vh] text-white select-none overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 35%, #466F7F 0%, #365B6A 50%, #284753 100%)',
      }}
    >
      {/* ── THE DIAGONAL MOVING INVITATION GALLERY TAPESTRY (CENTERED IN DEEP SCROLL CONTAINER) ──── */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360vw] sm:w-[230vw] h-[360vh] flex flex-row items-center justify-center gap-3.5 sm:gap-6 lg:gap-8 rotate-[11.5deg] pointer-events-auto transform-gpu select-none"
        style={{ willChange: 'transform' }}
      >
        {columns.map((colCards, colIdx) => {
          // Alternating UP and DOWN motion along the tilted columns
          const animClass =
            colIdx % 2 === 0
              ? colIdx % 4 === 0
                ? 'kadi-stream-up'
                : 'kadi-stream-up-fast'
              : colIdx % 4 === 1
              ? 'kadi-stream-down'
              : 'kadi-stream-down-slow';

          // Repeat 4x (20 items) for seamless infinite marquee loop
          const streamItems = [...colCards, ...colCards, ...colCards, ...colCards];

          return (
            <div
              key={`col-${colIdx}`}
              className="kadi-stream-column relative h-full flex flex-col gap-3.5 sm:gap-6 lg:gap-8 shrink-0 w-[145px] sm:w-[220px] md:w-[260px] lg:w-[290px] touch-pan-y"
            >
              <div
                className={`kadi-stream-track ${animClass} flex flex-col gap-3.5 sm:gap-6 lg:gap-8 w-full`}
              >
                {streamItems.map((card, itemIdx) => (
                  <div
                    key={`${card.id}-${colIdx}-${itemIdx}`}
                    className="w-full shrink-0"
                  >
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

      {/* Very soft edge-vignette gradient masks so cards seamlessly fade into background edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_70%,_rgba(40,71,83,0.45)_100%)] pointer-events-none z-20" />

      {/* ── TOP BAR: FIXED WITH DYNAMIC BACKGROUND-ADAPTIVE TEXT CONTRAST ── */}
      <header className="fixed top-0 left-0 right-0 z-30 w-full px-3.5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between border-b border-white/[0.08] bg-transparent pointer-events-auto">
        {/* Left: Clean Brand Wordmark (No "Stationery Studio" label) */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group" aria-label="Kadi Home">
            <span className="font-serif text-xl sm:text-3xl tracking-[0.22em] font-black text-white mix-blend-difference select-none drop-shadow-xs transition-transform group-hover:scale-105">
              KADI
            </span>
          </Link>
        </div>

        {/* Center: Dynamic Contrast Category Filter Chips */}
        <div className="hidden lg:flex items-center gap-1.5 bg-transparent border border-white/25 rounded-full p-1 mix-blend-difference">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Center Search for Medium screens */}
        <div className="hidden sm:flex lg:hidden items-center gap-2 border border-white/25 rounded-full px-3 py-1 bg-transparent w-44 mix-blend-difference">
          <Search size={12} className="text-white shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search designs..."
            className="w-full bg-transparent text-xs text-white placeholder-white/70 focus:outline-none font-bold"
          />
        </div>

        {/* Right: Start Blank + Quiet Sign in / Drafts with dynamic contrast */}
        <div className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/app/events/new?blank=true"
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-white mix-blend-difference font-bold px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/30 hover:border-white transition-all"
          >
            <Plus size={12} className="text-white" />
            <span className="hidden sm:inline">Start</span> blank
          </Link>

          <Link
            href="/login"
            className="text-[11px] sm:text-xs text-white mix-blend-difference font-bold hover:underline transition-colors px-1"
          >
            Sign in
          </Link>
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

        {/* ── HOVER OVERLAY: "CUSTOMIZE THIS DESIGN" ACTION PILL ───────── */}
        <div
          className={`absolute inset-0 z-30 bg-neutral-950/85 backdrop-blur-md rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-3 sm:p-5 transition-all duration-200 ${
            isHovered
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full flex flex-col items-center justify-center text-center space-y-2 sm:space-y-2.5">
            <span className="text-[9px] sm:text-xs font-sans uppercase tracking-[0.24em] text-[#E6CA92] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {card.categoryLabel}
            </span>
            <div className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white hover:bg-[#FAF8F5] text-[#112327] font-sans font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-white/60 transform transition-transform group-hover:scale-105 active:scale-95">
              <span>Customize</span>
              <ArrowUpRight size={14} className="text-[#B99A62] stroke-[2.5]" />
            </div>
            <span className="text-[8px] sm:text-[11px] text-white/90 font-sans font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              No signup required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
