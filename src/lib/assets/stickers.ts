export interface StickerAsset {
  id: string;
  name: string;
  category: 'botanical' | 'birthday' | 'wedding' | 'celebration' | 'milestone' | 'baby' | 'memorial';
  tags: string[];
  // SVG markup or SVG data URI with genuine transparent alpha silhouette
  svgContent: string;
  defaultWidth: number;
  defaultHeight: number;
  aspectRatio: number;
}

export const STICKER_ASSETS: StickerAsset[] = [
  // ── 1. BOTANICALS & FLORALS ───────────────────────────────────────────
  {
    id: 'botanical-eucalyptus-sprig',
    name: 'Eucalyptus Sprig',
    category: 'botanical',
    tags: ['eucalyptus', 'leaves', 'sage', 'greenery', 'foliage'],
    defaultWidth: 120,
    defaultHeight: 160,
    aspectRatio: 120 / 160,
    svgContent: `<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 150 Q55 90 62 10" stroke="#4A6B53" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="44" cy="120" rx="14" ry="9" transform="rotate(-25 44 120)" fill="#76987D" opacity="0.9"/>
      <ellipse cx="76" cy="105" rx="15" ry="10" transform="rotate(20 76 105)" fill="#688A6F" opacity="0.95"/>
      <ellipse cx="40" cy="80" rx="16" ry="10" transform="rotate(-30 40 80)" fill="#84A68B" opacity="0.9"/>
      <ellipse cx="80" cy="65" rx="15" ry="9" transform="rotate(25 80 65)" fill="#719378" opacity="0.95"/>
      <ellipse cx="46" cy="40" rx="13" ry="8" transform="rotate(-20 46 40)" fill="#8DAF94" opacity="0.9"/>
      <ellipse cx="74" cy="30" rx="12" ry="7" transform="rotate(18 74 30)" fill="#7A9C81" opacity="0.95"/>
      <ellipse cx="60" cy="12" rx="9" ry="6" fill="#99BAA0"/>
      <!-- Soft berries -->
      <circle cx="58" cy="98" r="3" fill="#D4AF37"/>
      <circle cx="64" cy="58" r="2.5" fill="#D4AF37"/>
    </svg>`,
  },
  {
    id: 'botanical-gold-laurel-wreath',
    name: 'Gold Laurel Crest',
    category: 'botanical',
    tags: ['crest', 'laurel', 'wreath', 'gold', 'monogram'],
    defaultWidth: 140,
    defaultHeight: 140,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Left branch -->
      <path d="M70 125 C40 125 20 100 20 70 C20 45 35 25 58 18" stroke="#B99A62" stroke-width="2" stroke-linecap="round"/>
      <!-- Right branch -->
      <path d="M70 125 C100 125 120 100 120 70 C120 45 105 25 82 18" stroke="#B99A62" stroke-width="2" stroke-linecap="round"/>
      <!-- Leaves left -->
      <ellipse cx="26" cy="98" rx="8" ry="4" transform="rotate(40 26 98)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="18" cy="74" rx="8" ry="4" transform="rotate(10 18 74)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="24" cy="50" rx="8" ry="4" transform="rotate(-20 24 50)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="38" cy="30" rx="8" ry="4" transform="rotate(-45 38 30)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="56" cy="18" rx="7" ry="3.5" transform="rotate(-65 56 18)" fill="#D4AF37" opacity="0.9"/>
      <!-- Leaves right -->
      <ellipse cx="114" cy="98" rx="8" ry="4" transform="rotate(-40 114 98)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="122" cy="74" rx="8" ry="4" transform="rotate(-10 122 74)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="116" cy="50" rx="8" ry="4" transform="rotate(20 116 50)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="102" cy="30" rx="8" ry="4" transform="rotate(45 102 30)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="84" cy="18" rx="7" ry="3.5" transform="rotate(65 84 18)" fill="#D4AF37" opacity="0.9"/>
      <!-- Bottom knot ribbon -->
      <circle cx="70" cy="125" r="4" fill="#B99A62"/>
    </svg>`,
  },
  {
    id: 'botanical-watercolor-rose',
    name: 'Watercolor Rose Bloom',
    category: 'botanical',
    tags: ['rose', 'flower', 'blush', 'floral', 'watercolor'],
    defaultWidth: 130,
    defaultHeight: 130,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Petals layers -->
      <path d="M65 20 C85 20 105 35 105 60 C105 85 85 105 65 105 C45 105 25 85 25 60 C25 35 45 20 65 20 Z" fill="#E8A598" opacity="0.45"/>
      <path d="M65 30 C80 30 95 42 95 62 C95 82 80 95 65 95 C50 95 35 82 35 62 C35 42 50 30 65 30 Z" fill="#D98274" opacity="0.6"/>
      <path d="M65 40 C75 40 85 50 85 64 C85 78 75 86 65 86 C55 86 45 78 45 64 C45 50 55 40 65 40 Z" fill="#C46050" opacity="0.75"/>
      <!-- Core spiral -->
      <path d="M65 52 Q72 52 72 60 Q72 68 65 68 Q58 68 58 60 Q58 54 63 54" stroke="#8C2B1D" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Leaves -->
      <path d="M22 80 C10 82 5 95 10 108 C22 110 32 100 28 86 Z" fill="#6A8A6D" opacity="0.85"/>
      <path d="M108 80 C120 82 125 95 120 108 C108 110 98 100 102 86 Z" fill="#6A8A6D" opacity="0.85"/>
    </svg>`,
  },
  {
    id: 'botanical-olive-branch',
    name: 'Graceful Olive Branch',
    category: 'botanical',
    tags: ['olive', 'branch', 'peace', 'botanical', 'wedding'],
    defaultWidth: 150,
    defaultHeight: 90,
    aspectRatio: 150 / 90,
    svgContent: `<svg viewBox="0 0 150 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 75 Q75 60 140 20" stroke="#526E55" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="40" cy="62" rx="14" ry="5" transform="rotate(-25 40 62)" fill="#789A7B"/>
      <ellipse cx="70" cy="50" rx="15" ry="6" transform="rotate(-15 70 50)" fill="#698A6C"/>
      <ellipse cx="100" cy="38" rx="14" ry="5" transform="rotate(-20 100 38)" fill="#81A384"/>
      <ellipse cx="125" cy="24" rx="12" ry="4" transform="rotate(-30 125 24)" fill="#93B496"/>
      <ellipse cx="50" cy="74" rx="13" ry="5" transform="rotate(35 50 74)" fill="#608063"/>
      <ellipse cx="85" cy="64" rx="14" ry="5" transform="rotate(30 85 64)" fill="#739476"/>
      <ellipse cx="115" cy="48" rx="12" ry="4" transform="rotate(25 115 48)" fill="#84A687"/>
      <!-- Olives -->
      <ellipse cx="60" cy="55" rx="5" ry="7" transform="rotate(20 60 55)" fill="#3D3A2A"/>
      <ellipse cx="95" cy="42" rx="5" ry="6.5" transform="rotate(-15 95 42)" fill="#333826"/>
    </svg>`,
  },

  // ── 2. BIRTHDAYS & CELEBRATIONS ───────────────────────────────────────
  {
    id: 'birthday-tiered-cake',
    name: 'Celebration Layer Cake',
    category: 'birthday',
    tags: ['cake', 'candles', 'birthday', 'celebration', 'sweet'],
    defaultWidth: 120,
    defaultHeight: 140,
    aspectRatio: 120 / 140,
    svgContent: `<svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cake plate -->
      <ellipse cx="60" cy="130" rx="55" ry="8" fill="#E2E8F0"/>
      <!-- Bottom tier -->
      <rect x="20" y="85" width="80" height="40" rx="6" fill="#F472B6"/>
      <path d="M20 95 Q30 102 40 95 Q50 102 60 95 Q70 102 80 95 Q90 102 100 95 L100 85 L20 85 Z" fill="#FDF2F8"/>
      <!-- Top tier -->
      <rect x="35" y="55" width="50" height="30" rx="5" fill="#38BDF8"/>
      <path d="M35 63 Q43 70 51 63 Q60 70 68 63 Q76 70 85 63 L85 55 L35 55 Z" fill="#F0F9FF"/>
      <!-- Candles -->
      <rect x="46" y="32" width="4" height="23" fill="#FBBF24" rx="1"/>
      <rect x="58" y="30" width="4" height="25" fill="#34D399" rx="1"/>
      <rect x="70" y="32" width="4" height="23" fill="#A78BFA" rx="1"/>
      <!-- Flames -->
      <path d="M48 24 Q51 28 48 31 Q45 28 48 24 Z" fill="#F59E0B"/>
      <path d="M60 22 Q63 26 60 29 Q57 26 60 22 Z" fill="#F59E0B"/>
      <path d="M72 24 Q75 28 72 31 Q69 28 72 24 Z" fill="#F59E0B"/>
    </svg>`,
  },
  {
    id: 'birthday-balloon-cluster',
    name: 'Pastel Balloons Cluster',
    category: 'birthday',
    tags: ['balloons', 'party', 'celebration', 'kids', 'joy'],
    defaultWidth: 120,
    defaultHeight: 150,
    aspectRatio: 120 / 150,
    svgContent: `<svg viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Strings -->
      <path d="M60 145 Q55 110 40 75" stroke="#94A3B8" stroke-width="1.5"/>
      <path d="M60 145 Q62 105 60 65" stroke="#94A3B8" stroke-width="1.5"/>
      <path d="M60 145 Q70 110 80 75" stroke="#94A3B8" stroke-width="1.5"/>
      <!-- Left Balloon (Coral) -->
      <ellipse cx="40" cy="55" rx="22" ry="28" fill="#FB7185"/>
      <polygon points="38,82 42,82 40,86" fill="#E11D48"/>
      <!-- Right Balloon (Gold/Amber) -->
      <ellipse cx="80" cy="55" rx="22" ry="28" fill="#FBBF24"/>
      <polygon points="78,82 82,82 80,86" fill="#D97706"/>
      <!-- Center Top Balloon (Azure) -->
      <ellipse cx="60" cy="40" rx="24" ry="30" fill="#38BDF8"/>
      <polygon points="58,69 62,69 60,73" fill="#0284C7"/>
      <!-- Highlights -->
      <ellipse cx="53" cy="28" rx="5" ry="8" transform="rotate(-20 53 28)" fill="#FFFFFF" opacity="0.5"/>
      <ellipse cx="33" cy="45" rx="4" ry="7" transform="rotate(-20 33 45)" fill="#FFFFFF" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'celebration-confetti-sparkles',
    name: 'Golden Confetti Burst',
    category: 'celebration',
    tags: ['confetti', 'sparkles', 'gold', 'celebration', 'glamour'],
    defaultWidth: 140,
    defaultHeight: 120,
    aspectRatio: 140 / 120,
    svgContent: `<svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Sparkle stars -->
      <path d="M70 15 Q70 35 90 35 Q70 35 70 55 Q70 35 50 35 Q70 35 70 15 Z" fill="#F59E0B"/>
      <path d="M30 45 Q30 57 42 57 Q30 57 30 69 Q30 57 18 57 Q30 57 30 45 Z" fill="#D4AF37"/>
      <path d="M110 50 Q110 62 122 62 Q110 62 110 74 Q110 62 98 62 Q110 62 110 50 Z" fill="#D4AF37"/>
      <!-- Confetti circles -->
      <circle cx="50" cy="20" r="4" fill="#EC4899"/>
      <circle cx="95" cy="25" r="3.5" fill="#3B82F6"/>
      <circle cx="35" cy="85" r="4.5" fill="#10B981"/>
      <circle cx="105" cy="90" r="4" fill="#F43F5E"/>
      <circle cx="70" cy="80" r="5" fill="#FBBF24"/>
      <!-- Ribbons -->
      <path d="M20 25 Q35 15 45 35" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M95 75 Q115 85 125 70" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },

  // ── 3. WEDDINGS & ROMANCE ─────────────────────────────────────────────
  {
    id: 'wedding-gold-rings',
    name: 'Intertwined Gold Bands',
    category: 'wedding',
    tags: ['rings', 'gold', 'wedding', 'bands', 'marriage'],
    defaultWidth: 110,
    defaultHeight: 80,
    aspectRatio: 110 / 80,
    svgContent: `<svg viewBox="0 0 110 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="42" cy="40" rx="26" ry="26" stroke="#D4AF37" stroke-width="6" fill="none"/>
      <ellipse cx="68" cy="40" rx="26" ry="26" stroke="#B99A62" stroke-width="6" fill="none"/>
      <!-- Diamond solitaire on left ring -->
      <polygon points="42,10 46,14 42,18 38,14" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1"/>
      <circle cx="42" cy="14" r="1.5" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: 'wedding-champagne-coupe',
    name: 'Champagne Coupe Clink',
    category: 'wedding',
    tags: ['toast', 'champagne', 'coupe', 'drinks', 'reception'],
    defaultWidth: 120,
    defaultHeight: 110,
    aspectRatio: 120 / 110,
    svgContent: `<svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Left Glass -->
      <path d="M25 35 C25 55 45 60 45 60 L45 95 M32 95 L58 95" stroke="#B99A62" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M20 35 L70 35 C70 35 60 55 45 58 C30 55 20 35 20 35 Z" fill="#FDF6B2" stroke="#B99A62" stroke-width="2"/>
      <!-- Right Glass -->
      <path d="M95 35 C95 55 75 60 75 60 L75 95 M62 95 L88 95" stroke="#B99A62" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M100 35 L50 35 C50 35 60 55 75 58 C90 55 100 35 100 35 Z" fill="#FDF6B2" stroke="#B99A62" stroke-width="2"/>
      <!-- Clink sparkle -->
      <path d="M60 20 Q60 28 68 28 Q60 28 60 36 Q60 28 52 28 Q60 28 60 20 Z" fill="#F59E0B"/>
      <circle cx="56" cy="42" r="1.5" fill="#FFFFFF"/>
      <circle cx="64" cy="46" r="1.5" fill="#FFFFFF"/>
    </svg>`,
  },

  // ── 4. MILESTONES & HONOURS ───────────────────────────────────────────
  {
    id: 'milestone-mortarboard-cap',
    name: 'Graduation Mortarboard',
    category: 'milestone',
    tags: ['graduation', 'cap', 'mortarboard', 'honors', 'degree'],
    defaultWidth: 130,
    defaultHeight: 90,
    aspectRatio: 130 / 90,
    svgContent: `<svg viewBox="0 0 130 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Diamond cap top -->
      <polygon points="65,15 120,40 65,65 10,40" fill="#1E293B"/>
      <polygon points="65,18 114,40 65,62 16,40" fill="#0F172A"/>
      <!-- Cap base -->
      <path d="M35 50 C35 70 95 70 95 50" fill="#1E293B"/>
      <!-- Tassel button & tassel -->
      <circle cx="65" cy="40" r="4" fill="#F59E0B"/>
      <path d="M65 40 Q85 45 90 68" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="87" y="68" width="6" height="14" rx="2" fill="#D97706"/>
    </svg>`,
  },
  {
    id: 'milestone-starburst-crest',
    name: 'Gilded Starburst Crest',
    category: 'milestone',
    tags: ['star', 'crest', 'gala', 'gold', 'honor'],
    defaultWidth: 100,
    defaultHeight: 100,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L55 35 L85 20 L65 45 L95 50 L65 55 L85 80 L55 65 L50 95 L45 65 L15 80 L35 55 L5 50 L35 45 L15 20 L45 35 Z" fill="#D4AF37"/>
      <circle cx="50" cy="50" r="14" fill="#B99A62"/>
      <circle cx="50" cy="50" r="10" fill="#FFFBEB"/>
      <circle cx="50" cy="50" r="6" fill="#D4AF37"/>
    </svg>`,
  },

  // ── 5. MEMORIAL & SOLEMN ──────────────────────────────────────────────
  {
    id: 'memorial-peace-dove',
    name: 'Dove of Peace',
    category: 'memorial',
    tags: ['dove', 'peace', 'memorial', 'tribute', 'solemn'],
    defaultWidth: 120,
    defaultHeight: 100,
    aspectRatio: 120 / 100,
    svgContent: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Dove silhouette -->
      <path d="M30 45 C40 25 70 15 95 15 C85 30 75 40 85 55 C95 55 105 50 110 55 C105 65 85 70 70 65 C55 75 40 85 25 90 C30 75 35 65 30 55 Z" fill="#E2E8F0" opacity="0.95"/>
      <!-- Olive leaf in beak -->
      <path d="M110 55 Q115 50 120 52 Q115 57 110 55 Z" fill="#65A30D"/>
      <circle cx="95" cy="28" r="2" fill="#475569"/>
    </svg>`,
  },
  {
    id: 'memorial-candle-flame',
    name: 'Candle of Remembrance',
    category: 'memorial',
    tags: ['candle', 'flame', 'remembrance', 'tribute', 'light'],
    defaultWidth: 80,
    defaultHeight: 120,
    aspectRatio: 80 / 120,
    svgContent: `<svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Candle pillar -->
      <rect x="25" y="55" width="30" height="60" rx="3" fill="#F1F5F9"/>
      <ellipse cx="40" cy="55" rx="15" ry="3" fill="#E2E8F0"/>
      <!-- Wick -->
      <line x1="40" y1="53" x2="40" y2="42" stroke="#334155" stroke-width="2"/>
      <!-- Flame outer glow -->
      <circle cx="40" cy="30" r="18" fill="#FEF08A" opacity="0.35"/>
      <!-- Flame -->
      <path d="M40 16 C48 24 50 36 40 44 C30 36 32 24 40 16 Z" fill="#F59E0B"/>
      <!-- Flame core -->
      <path d="M40 25 C44 30 44 38 40 42 C36 38 36 30 40 25 Z" fill="#FEF08A"/>
    </svg>`,
  },

  // ── 6. BABY & FAMILY ──────────────────────────────────────────────────
  {
    id: 'baby-footprints-golden',
    name: 'Golden Baby Footprints',
    category: 'baby',
    tags: ['baby', 'footprints', 'shower', 'sweet', 'family'],
    defaultWidth: 100,
    defaultHeight: 100,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Left foot sole -->
      <ellipse cx="36" cy="62" rx="11" ry="17" transform="rotate(-10 36 62)" fill="#F472B6" opacity="0.9"/>
      <!-- Left foot toes -->
      <circle cx="28" cy="38" r="4.5" fill="#F472B6"/>
      <circle cx="37" cy="36" r="3.5" fill="#F472B6"/>
      <circle cx="44" cy="38" r="3" fill="#F472B6"/>
      <circle cx="49" cy="42" r="2.5" fill="#F472B6"/>
      <circle cx="52" cy="47" r="2" fill="#F472B6"/>
      <!-- Right foot sole -->
      <ellipse cx="64" cy="55" rx="11" ry="17" transform="rotate(10 64 55)" fill="#F472B6" opacity="0.9"/>
      <!-- Right foot toes -->
      <circle cx="72" cy="31" r="4.5" fill="#F472B6"/>
      <circle cx="63" cy="29" r="3.5" fill="#F472B6"/>
      <circle cx="56" cy="31" r="3" fill="#F472B6"/>
      <circle cx="51" cy="35" r="2.5" fill="#F472B6"/>
      <circle cx="48" cy="40" r="2" fill="#F472B6"/>
    </svg>`,
  },
  {
    id: 'baby-butterfly-flutter',
    name: 'Pastel Butterfly',
    category: 'baby',
    tags: ['butterfly', 'flutter', 'spring', 'sweet', 'nature'],
    defaultWidth: 110,
    defaultHeight: 90,
    aspectRatio: 110 / 90,
    svgContent: `<svg viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Left top wing -->
      <path d="M55 45 C45 20 15 10 10 35 C5 60 40 55 55 45 Z" fill="#C084FC" opacity="0.85"/>
      <!-- Left bottom wing -->
      <path d="M55 45 C40 55 20 65 25 80 C30 90 50 70 55 45 Z" fill="#E879F9" opacity="0.85"/>
      <!-- Right top wing -->
      <path d="M55 45 C65 20 95 10 100 35 C105 60 70 55 55 45 Z" fill="#C084FC" opacity="0.85"/>
      <!-- Right bottom wing -->
      <path d="M55 45 C70 55 90 65 85 80 C80 90 60 70 55 45 Z" fill="#E879F9" opacity="0.85"/>
      <!-- Body & Antennae -->
      <ellipse cx="55" cy="45" rx="3" ry="16" fill="#581C87"/>
      <path d="M55 30 Q50 20 44 18" stroke="#581C87" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M55 30 Q60 20 66 18" stroke="#581C87" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
];

export function getStickersByCategory(category?: string): StickerAsset[] {
  if (!category || category === 'all') return STICKER_ASSETS;
  return STICKER_ASSETS.filter((s) => s.category === category);
}

export function searchStickers(query: string): StickerAsset[] {
  const q = query.toLowerCase().trim();
  if (!q) return STICKER_ASSETS;
  return STICKER_ASSETS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
  );
}
