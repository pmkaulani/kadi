export interface StickerAsset {
  id: string;
  name: string;
  category:
    | 'heritage'
    | 'luxury'
    | 'botanical'
    | 'birthday'
    | 'wedding'
    | 'celebration'
    | 'milestone'
    | 'baby'
    | 'memorial';
  tags: string[];
  // SVG markup with genuine transparent alpha silhouette
  svgContent: string;
  defaultWidth: number;
  defaultHeight: number;
  aspectRatio: number;
}

export const STICKER_ASSETS: StickerAsset[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // 1. HERITAGE & AFRICAN CULTURAL MOTIFS
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'heritage-shield-spears',
    name: 'Ceremonial Shield & Spears',
    category: 'heritage',
    tags: ['shield', 'spears', 'kenya', 'african', 'heritage', 'warrior', 'ruracio', 'traditional'],
    defaultWidth: 120,
    defaultHeight: 140,
    aspectRatio: 120 / 140,
    svgContent: `<svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Crossed ceremonial spears -->
      <line x1="20" y1="125" x2="100" y2="15" stroke="#B87333" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="100,15 106,9 96,15" fill="#D4AF37"/>
      <polygon points="100,15 102,5 94,11" fill="#FFF8DC"/>
      <line x1="100" y1="125" x2="20" y2="15" stroke="#B87333" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="20,15 14,9 24,15" fill="#D4AF37"/>
      <polygon points="20,15 18,5 26,11" fill="#FFF8DC"/>
      <!-- Maasai/Kikuyu traditional oval shield -->
      <path d="M60 22 C84 22 92 50 92 70 C92 90 84 118 60 118 C36 118 28 90 28 70 C28 50 36 22 60 22 Z" fill="#7C2D12" stroke="#D4AF37" stroke-width="2"/>
      <!-- Shield center spine -->
      <line x1="60" y1="18" x2="60" y2="122" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
      <!-- Traditional shield geometric symbols -->
      <path d="M42 45 L60 62 L42 79 Z" fill="#F8FAFC" opacity="0.95"/>
      <path d="M78 45 L60 62 L78 79 Z" fill="#F8FAFC" opacity="0.95"/>
      <path d="M46 52 L60 62 L46 72 Z" fill="#DC2626"/>
      <path d="M74 52 L60 62 L74 72 Z" fill="#DC2626"/>
      <circle cx="60" cy="70" r="5" fill="#D4AF37"/>
      <circle cx="60" cy="70" r="2.5" fill="#1C1917"/>
    </svg>`,
  },
  {
    id: 'heritage-swahili-henna-lace',
    name: 'Swahili Henna Lace Medallion',
    category: 'heritage',
    tags: ['swahili', 'henna', 'lace', 'harusi', 'arabesque', 'coastal', 'mombasa', 'lamu', 'wedding'],
    defaultWidth: 130,
    defaultHeight: 130,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer filigree ring -->
      <circle cx="65" cy="65" r="58" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="2 3"/>
      <circle cx="65" cy="65" r="52" stroke="#B8860B" stroke-width="1.2"/>
      <!-- 8-petal coastal henna rosette -->
      <g stroke="#D4AF37" stroke-width="1.5" fill="#D4AF37" fill-opacity="0.12">
        <path d="M65 20 C60 38 60 48 65 52 C70 48 70 38 65 20 Z"/>
        <path d="M65 110 C60 92 60 82 65 78 C70 82 70 92 65 110 Z"/>
        <path d="M20 65 C38 60 48 60 52 65 C48 70 38 70 20 65 Z"/>
        <path d="M110 65 C92 60 82 60 78 65 C82 70 92 70 110 65 Z"/>
        <path d="M33 33 C46 44 53 51 56 56 C51 53 44 46 33 33 Z"/>
        <path d="M97 97 C84 86 77 79 74 74 C79 77 86 84 97 97 Z"/>
        <path d="M33 97 C46 86 53 79 56 74 C51 77 44 84 33 97 Z"/>
        <path d="M97 33 C84 44 77 51 74 56 C79 53 86 46 97 33 Z"/>
      </g>
      <!-- Arabesque floral droplet accents -->
      <circle cx="65" cy="14" r="3" fill="#D4AF37"/>
      <circle cx="65" cy="116" r="3" fill="#D4AF37"/>
      <circle cx="14" cy="65" r="3" fill="#D4AF37"/>
      <circle cx="116" cy="65" r="3" fill="#D4AF37"/>
      <!-- Core star emblem -->
      <circle cx="65" cy="65" r="14" fill="#D4AF37" fill-opacity="0.25" stroke="#D4AF37" stroke-width="1.5"/>
      <circle cx="65" cy="65" r="6" fill="#D4AF37"/>
    </svg>`,
  },
  {
    id: 'heritage-maasai-chevron',
    name: 'Maasai Beaded Chevron Arch',
    category: 'heritage',
    tags: ['maasai', 'beads', 'chevron', 'pattern', 'traditional', 'ochre', 'african', 'celebration'],
    defaultWidth: 140,
    defaultHeight: 90,
    aspectRatio: 140 / 90,
    svgContent: `<svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Tier 1 Red Chevron Band -->
      <path d="M15 20 Q70 65 125 20" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/>
      <!-- Tier 2 Cobalt Blue Chevron Band -->
      <path d="M20 32 Q70 73 120 32" stroke="#2563EB" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Tier 3 Pure White Bead Band -->
      <path d="M26 43 Q70 80 114 43" stroke="#F8FAFC" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="3 4"/>
      <!-- Tier 4 Amber Gold Chevron Band -->
      <path d="M32 53 Q70 86 108 53" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
      <!-- Tier 5 Emerald Green Accent -->
      <path d="M40 63 Q70 91 100 63" stroke="#16A34A" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Dangling brass pendant bells -->
      <circle cx="70" cy="88" r="4.5" fill="#D4AF37" stroke="#92400E" stroke-width="1"/>
      <circle cx="55" cy="80" r="3.5" fill="#D4AF37"/>
      <circle cx="85" cy="80" r="3.5" fill="#D4AF37"/>
    </svg>`,
  },
  {
    id: 'heritage-cowrie-trio',
    name: 'Trio of Golden Cowrie Shells',
    category: 'heritage',
    tags: ['cowrie', 'shells', 'wealth', 'prosperity', 'ruracio', 'african', 'fortune', 'dowry'],
    defaultWidth: 110,
    defaultHeight: 110,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Rawhide string -->
      <path d="M20 90 Q55 60 90 20" stroke="#854D0E" stroke-width="1.8" stroke-dasharray="3 2"/>
      <!-- Cowrie Shell 1 (Center Golden) -->
      <g transform="translate(42, 38) rotate(-15)">
        <ellipse cx="16" cy="22" rx="14" ry="20" fill="#FEF3C7" stroke="#D4AF37" stroke-width="1.8"/>
        <!-- Slit with teeth -->
        <path d="M16 6 Q13 22 16 38" stroke="#78350F" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="12" y1="12" x2="20" y2="12" stroke="#92400E" stroke-width="1"/>
        <line x1="11" y1="18" x2="21" y2="18" stroke="#92400E" stroke-width="1"/>
        <line x1="11" y1="24" x2="21" y2="24" stroke="#92400E" stroke-width="1"/>
        <line x1="12" y1="30" x2="20" y2="30" stroke="#92400E" stroke-width="1"/>
      </g>
      <!-- Cowrie Shell 2 (Top Right Ivory) -->
      <g transform="translate(68, 12) rotate(35)">
        <ellipse cx="12" cy="16" rx="10" ry="15" fill="#FDFBF7" stroke="#B45309" stroke-width="1.5"/>
        <path d="M12 4 Q10 16 12 28" stroke="#78350F" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="9" y1="10" x2="15" y2="10" stroke="#92400E" stroke-width="0.8"/>
        <line x1="8" y1="16" x2="16" y2="16" stroke="#92400E" stroke-width="0.8"/>
        <line x1="9" y1="22" x2="15" y2="22" stroke="#92400E" stroke-width="0.8"/>
      </g>
      <!-- Cowrie Shell 3 (Bottom Left Warm) -->
      <g transform="translate(14, 56) rotate(-45)">
        <ellipse cx="12" cy="16" rx="10" ry="15" fill="#FFFBEB" stroke="#B45309" stroke-width="1.5"/>
        <path d="M12 4 Q10 16 12 28" stroke="#78350F" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="9" y1="10" x2="15" y2="10" stroke="#92400E" stroke-width="0.8"/>
        <line x1="8" y1="16" x2="16" y2="16" stroke="#92400E" stroke-width="0.8"/>
        <line x1="9" y1="22" x2="15" y2="22" stroke="#92400E" stroke-width="0.8"/>
      </g>
    </svg>`,
  },
  {
    id: 'heritage-acacia-sunset',
    name: 'Savannah Acacia Silhouette',
    category: 'heritage',
    tags: ['acacia', 'savannah', 'sunset', 'kenya', 'wildlife', 'nature', 'landscape', 'safari'],
    defaultWidth: 150,
    defaultHeight: 110,
    aspectRatio: 150 / 110,
    svgContent: `<svg viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Warm sunset sun orb -->
      <circle cx="85" cy="48" r="32" fill="#F59E0B" fill-opacity="0.25"/>
      <circle cx="85" cy="48" r="22" fill="#F59E0B" fill-opacity="0.5"/>
      <!-- Savannah ground horizon line -->
      <path d="M10 98 Q75 92 140 98" stroke="#292524" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Iconic umbrella acacia trunk -->
      <path d="M72 98 Q74 72 65 55 Q56 46 42 36 M65 55 Q76 46 95 38 M65 55 L68 34" stroke="#292524" stroke-width="3" stroke-linecap="round"/>
      <path d="M74 98 Q78 78 72 62" stroke="#292524" stroke-width="2" stroke-linecap="round"/>
      <!-- Canopy flat-topped foliage umbrellas -->
      <ellipse cx="44" cy="34" rx="28" ry="7" fill="#1C1917"/>
      <ellipse cx="94" cy="36" rx="34" ry="8" fill="#1C1917"/>
      <ellipse cx="68" cy="30" rx="22" ry="6" fill="#1C1917"/>
      <ellipse cx="118" cy="40" rx="16" ry="5" fill="#1C1917"/>
      <!-- Distant birds in flight -->
      <path d="M26 24 Q30 20 34 24 Q38 20 42 24" stroke="#44403C" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M48 18 Q51 15 54 18 Q57 15 60 18" stroke="#44403C" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'heritage-calabash-gourd',
    name: 'Ceremonial Beaded Calabash',
    category: 'heritage',
    tags: ['calabash', 'gourd', 'ruracio', 'traditional', 'kikuyu', 'blessing', 'beer', 'ceremony'],
    defaultWidth: 100,
    defaultHeight: 130,
    aspectRatio: 100 / 130,
    svgContent: `<svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Calabash body -->
      <path d="M44 28 C44 20 56 20 56 28 C56 38 66 50 72 65 C80 82 78 108 50 108 C22 108 20 82 28 65 C34 50 44 38 44 28 Z" fill="#9A3412" stroke="#7C2D12" stroke-width="2"/>
      <!-- Beaded collar necklace band -->
      <rect x="38" y="42" width="24" height="6" rx="2" fill="#F59E0B" stroke="#B45309" stroke-width="1"/>
      <circle cx="42" cy="45" r="1.5" fill="#DC2626"/>
      <circle cx="46" cy="45" r="1.5" fill="#F8FAFC"/>
      <circle cx="50" cy="45" r="1.5" fill="#2563EB"/>
      <circle cx="54" cy="45" r="1.5" fill="#F8FAFC"/>
      <circle cx="58" cy="45" r="1.5" fill="#16A34A"/>
      <!-- Braided leather carrying strap -->
      <path d="M44 32 C30 32 18 55 18 80 C18 105 32 118 50 118" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 3"/>
      <!-- Cowrie shell pendant on strap -->
      <ellipse cx="18" cy="80" rx="4" ry="6" fill="#FFFBEB" stroke="#B45309" stroke-width="1"/>
      <line x1="18" y1="76" x2="18" y2="84" stroke="#78350F" stroke-width="1"/>
      <!-- Gourd stopper cork -->
      <rect x="47" y="16" width="6" height="12" rx="2" fill="#D97706"/>
    </svg>`,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 2. LUXURY WAX SEALS & MONOGRAMS
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'luxury-wax-seal-crimson',
    name: 'Imperial Wax Seal · Crimson & Gold',
    category: 'luxury',
    tags: ['wax', 'seal', 'monogram', 'crimson', 'gold', 'royal', 'stamp', 'stationery', 'luxury'],
    defaultWidth: 120,
    defaultHeight: 120,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Natural melting wax uneven perimeter -->
      <path d="M60 8 C78 7 92 14 102 26 C114 40 116 62 108 80 C102 96 88 110 68 112 C48 114 30 106 18 92 C6 76 8 52 16 34 C24 16 42 9 60 8 Z" fill="#991B1B" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.35))"/>
      <path d="M60 12 C75 11 88 18 97 28 C108 41 110 60 103 76 C97 90 84 103 66 105 C48 107 32 99 22 86 C12 72 13 50 20 34 C27 18 44 13 60 12 Z" fill="#B91C1C"/>
      <!-- Inner circular impression rim -->
      <circle cx="60" cy="60" r="38" stroke="#7F1D1D" stroke-width="2.5" fill="#881337"/>
      <circle cx="60" cy="60" r="35" stroke="#D4AF37" stroke-width="1.2" stroke-dasharray="2 3"/>
      <!-- Embossed Monogram Initial 'K' -->
      <path d="M50 42 L50 78 M50 60 L68 42 M58 54 L70 78" stroke="#D4AF37" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="50" cy="42" r="3" fill="#D4AF37"/>
      <circle cx="50" cy="78" r="3" fill="#D4AF37"/>
      <circle cx="68" cy="42" r="3" fill="#D4AF37"/>
      <circle cx="70" cy="78" r="3" fill="#D4AF37"/>
    </svg>`,
  },
  {
    id: 'luxury-wax-seal-rose-gold',
    name: 'Rose Gold Wax Seal · Heart',
    category: 'luxury',
    tags: ['wax', 'seal', 'heart', 'rose gold', 'wedding', 'romance', 'blush', 'love'],
    defaultWidth: 120,
    defaultHeight: 120,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Natural melting wax perimeter -->
      <path d="M60 10 C82 8 98 18 106 36 C114 54 110 78 98 94 C84 110 58 114 40 106 C20 98 8 76 10 54 C12 32 36 12 60 10 Z" fill="#BE185D" filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.3))"/>
      <path d="M60 14 C80 12 94 21 101 37 C108 53 104 74 93 89 C80 103 56 107 40 100 C22 93 12 73 14 53 C16 33 38 16 60 14 Z" fill="#DB2777"/>
      <circle cx="60" cy="60" r="36" fill="#9D174D" stroke="#FDA4AF" stroke-width="2"/>
      <!-- Embossed Heart with Botanical Laurel inside seal -->
      <path d="M60 74 C60 74 42 62 42 50 C42 42 48 38 54 38 C58 38 60 41 60 41 C60 41 62 38 66 38 C72 38 78 42 78 50 C78 62 60 74 60 74 Z" fill="#FCE7F3" stroke="#F472B6" stroke-width="1.8"/>
    </svg>`,
  },
  {
    id: 'luxury-royal-crown',
    name: 'Imperial Regalia Crown',
    category: 'luxury',
    tags: ['crown', 'royal', 'regal', 'king', 'queen', 'gold', 'imperial', 'monarchy', 'honour'],
    defaultWidth: 130,
    defaultHeight: 100,
    aspectRatio: 130 / 100,
    svgContent: `<svg viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Crown base circlet -->
      <rect x="25" y="70" width="80" height="12" rx="3" fill="#D4AF37" stroke="#996515" stroke-width="1.5"/>
      <!-- Jewels on circlet -->
      <circle cx="35" cy="76" r="3.5" fill="#DC2626"/>
      <circle cx="48" cy="76" r="3" fill="#2563EB"/>
      <circle cx="65" cy="76" r="4" fill="#059669"/>
      <circle cx="82" cy="76" r="3" fill="#2563EB"/>
      <circle cx="95" cy="76" r="3.5" fill="#DC2626"/>
      <!-- Crown arches & peaks -->
      <path d="M28 70 L22 36 L45 52 L65 24 L85 52 L108 36 L102 70 Z" fill="#D4AF37" stroke="#996515" stroke-width="1.5"/>
      <!-- Finial pearls on peaks -->
      <circle cx="22" cy="34" r="5" fill="#FFFBEB" stroke="#D4AF37" stroke-width="1.5"/>
      <circle cx="45" cy="50" r="4" fill="#FFFBEB" stroke="#D4AF37" stroke-width="1.5"/>
      <circle cx="65" cy="20" r="6.5" fill="#FFFBEB" stroke="#D4AF37" stroke-width="1.5"/>
      <circle cx="85" cy="50" r="4" fill="#FFFBEB" stroke="#D4AF37" stroke-width="1.5"/>
      <circle cx="108" cy="34" r="5" fill="#FFFBEB" stroke="#D4AF37" stroke-width="1.5"/>
      <!-- Cross finial on center pearl -->
      <line x1="65" y1="9" x2="65" y2="16" stroke="#D4AF37" stroke-width="2"/>
      <line x1="62" y1="12" x2="68" y2="12" stroke="#D4AF37" stroke-width="2"/>
    </svg>`,
  },
  {
    id: 'luxury-imperial-bee',
    name: 'Gilded Imperial Bee',
    category: 'luxury',
    tags: ['bee', 'imperial', 'gold', 'napoleon', 'crest', 'emblem', 'luxury', 'heraldic'],
    defaultWidth: 120,
    defaultHeight: 110,
    aspectRatio: 120 / 110,
    svgContent: `<svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Bee Wings (filigree mesh) -->
      <path d="M55 45 C40 18 12 18 18 42 C22 55 42 55 55 48 Z" fill="#FEF3C7" fill-opacity="0.8" stroke="#D4AF37" stroke-width="1.5"/>
      <path d="M26 30 C34 38 45 44 55 46" stroke="#D4AF37" stroke-width="1" stroke-linecap="round"/>
      <path d="M65 45 C80 18 108 18 102 42 C98 55 78 55 65 48 Z" fill="#FEF3C7" fill-opacity="0.8" stroke="#D4AF37" stroke-width="1.5"/>
      <path d="M94 30 C86 38 75 44 65 46" stroke="#D4AF37" stroke-width="1" stroke-linecap="round"/>
      <!-- Lower mini-wings -->
      <path d="M54 52 C45 56 32 64 36 74 C40 82 52 70 56 58 Z" fill="#FEF3C7" fill-opacity="0.65" stroke="#D4AF37" stroke-width="1.2"/>
      <path d="M66 52 C75 56 88 64 84 74 C80 82 68 70 64 58 Z" fill="#FEF3C7" fill-opacity="0.65" stroke="#D4AF37" stroke-width="1.2"/>
      <!-- Bee Head -->
      <ellipse cx="60" cy="30" rx="9" ry="7" fill="#D4AF37"/>
      <!-- Antennae -->
      <path d="M56 25 Q50 16 44 18" stroke="#78350F" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M64 25 Q70 16 76 18" stroke="#78350F" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Bee Thorax -->
      <ellipse cx="60" cy="44" rx="11" ry="9" fill="#1C1917" stroke="#D4AF37" stroke-width="1.5"/>
      <!-- Bee Abdomen Striped -->
      <path d="M50 52 C50 78 60 92 60 92 C60 92 70 78 70 52 Z" fill="#1C1917" stroke="#D4AF37" stroke-width="1.5"/>
      <line x1="50" y1="60" x2="70" y2="60" stroke="#D4AF37" stroke-width="3"/>
      <line x1="52" y1="70" x2="68" y2="70" stroke="#D4AF37" stroke-width="3"/>
      <line x1="56" y1="80" x2="64" y2="80" stroke="#D4AF37" stroke-width="2.5"/>
    </svg>`,
  },
  {
    id: 'luxury-art-deco-sunburst',
    name: 'Art Deco Great Gatsby Crest',
    category: 'luxury',
    tags: ['art deco', 'gatsby', 'sunburst', '1920s', 'gold', 'vintage', 'gala', 'speakeasy', 'noir'],
    defaultWidth: 120,
    defaultHeight: 120,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Concentric Art Deco fan rays -->
      <path d="M60 100 L60 20" stroke="#D4AF37" stroke-width="2.5"/>
      <path d="M60 100 L30 30" stroke="#D4AF37" stroke-width="2"/>
      <path d="M60 100 L90 30" stroke="#D4AF37" stroke-width="2"/>
      <path d="M60 100 L12 55" stroke="#B8860B" stroke-width="1.8"/>
      <path d="M60 100 L108 55" stroke="#B8860B" stroke-width="1.8"/>
      <path d="M60 100 L10 82" stroke="#D4AF37" stroke-width="1.5"/>
      <path d="M60 100 L110 82" stroke="#D4AF37" stroke-width="1.5"/>
      <!-- Stepped Chevron Arches -->
      <path d="M25 80 Q60 40 95 80" stroke="#D4AF37" stroke-width="2" fill="none"/>
      <path d="M35 85 Q60 55 85 85" stroke="#D4AF37" stroke-width="1.5" fill="none"/>
      <path d="M45 90 Q60 70 75 90" stroke="#D4AF37" stroke-width="1.2" fill="none"/>
      <!-- Center Diamond Finial -->
      <polygon points="60,15 67,25 60,35 53,25" fill="#D4AF37"/>
      <polygon points="30,25 35,32 30,39 25,32" fill="#D4AF37"/>
      <polygon points="90,25 95,32 90,39 85,32" fill="#D4AF37"/>
      <!-- Base pedestal line -->
      <line x1="20" y1="102" x2="100" y2="102" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
      <circle cx="60" cy="102" r="4" fill="#D4AF37"/>
    </svg>`,
  },
  {
    id: 'luxury-calligraphy-ampersand',
    name: 'Flourished Calligraphy Ampersand',
    category: 'luxury',
    tags: ['ampersand', 'and', 'calligraphy', 'monogram', 'flourish', 'gold', 'wedding', 'script'],
    defaultWidth: 100,
    defaultHeight: 120,
    aspectRatio: 100 / 120,
    svgContent: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M68 28 C64 18 52 14 42 22 C32 30 34 46 48 56 L62 66 C78 78 78 96 64 104 C50 112 30 106 24 90 C18 74 28 62 40 56 M62 66 L25 102 M56 30 C76 34 85 45 80 58 M20 92 C12 85 10 74 15 64" stroke="#B8860B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Flourish tail loops -->
      <path d="M64 104 C74 108 86 102 88 90 C90 78 78 72 70 76" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/>
      <circle cx="88" cy="90" r="2.5" fill="#D4AF37"/>
      <circle cx="42" cy="20" r="2.5" fill="#D4AF37"/>
    </svg>`,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 3. BOTANICALS & FLORALS
  // ═════════════════════════════════════════════════════════════════════════
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
      <path d="M70 125 C40 125 20 100 20 70 C20 45 35 25 58 18" stroke="#B99A62" stroke-width="2" stroke-linecap="round"/>
      <path d="M70 125 C100 125 120 100 120 70 C120 45 105 25 82 18" stroke="#B99A62" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="26" cy="98" rx="8" ry="4" transform="rotate(40 26 98)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="18" cy="74" rx="8" ry="4" transform="rotate(10 18 74)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="24" cy="50" rx="8" ry="4" transform="rotate(-20 24 50)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="38" cy="30" rx="8" ry="4" transform="rotate(-45 38 30)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="56" cy="18" rx="7" ry="3.5" transform="rotate(-65 56 18)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="114" cy="98" rx="8" ry="4" transform="rotate(-40 114 98)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="122" cy="74" rx="8" ry="4" transform="rotate(-10 122 74)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="116" cy="50" rx="8" ry="4" transform="rotate(20 116 50)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="102" cy="30" rx="8" ry="4" transform="rotate(45 102 30)" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="84" cy="18" rx="7" ry="3.5" transform="rotate(65 84 18)" fill="#D4AF37" opacity="0.9"/>
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
      <path d="M65 20 C85 20 105 35 105 60 C105 85 85 105 65 105 C45 105 25 85 25 60 C25 35 45 20 65 20 Z" fill="#E8A598" opacity="0.45"/>
      <path d="M65 30 C80 30 95 42 95 62 C95 82 80 95 65 95 C50 95 35 82 35 62 C35 42 50 30 65 30 Z" fill="#D98274" opacity="0.6"/>
      <path d="M65 40 C75 40 85 50 85 64 C85 78 75 86 65 86 C55 86 45 78 45 64 C45 50 55 40 65 40 Z" fill="#C46050" opacity="0.75"/>
      <path d="M65 52 Q72 52 72 60 Q72 68 65 68 Q58 68 58 60 Q58 54 63 54" stroke="#8C2B1D" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M22 80 C10 82 5 95 10 108 C22 110 32 100 28 86 Z" fill="#6A8A6D" opacity="0.85"/>
      <path d="M108 80 C120 82 125 95 120 108 C108 110 98 100 102 86 Z" fill="#6A8A6D" opacity="0.85"/>
    </svg>`,
  },
  {
    id: 'botanical-olive-branch',
    name: 'Graceful Olive Branch',
    category: 'botanical',
    tags: ['olive', 'branch', 'peace', 'botanical', 'wedding', 'tuscany', 'mediterranean'],
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
      <ellipse cx="60" cy="55" rx="5" ry="7" transform="rotate(20 60 55)" fill="#3D3A2A"/>
      <ellipse cx="95" cy="42" rx="5" ry="6.5" transform="rotate(-15 95 42)" fill="#333826"/>
    </svg>`,
  },
  {
    id: 'botanical-monstera-frond',
    name: 'Tropical Monstera Frond',
    category: 'botanical',
    tags: ['monstera', 'tropical', 'palm', 'leaf', 'safari', 'jungle', 'greenery'],
    defaultWidth: 120,
    defaultHeight: 140,
    aspectRatio: 120 / 140,
    svgContent: `<svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Main stem -->
      <path d="M60 135 Q58 85 58 15" stroke="#166534" stroke-width="3" stroke-linecap="round"/>
      <!-- Monstera leaf blade with natural fenestrations -->
      <path d="M58 20 C85 22 108 48 108 80 C108 112 85 125 60 128 C35 125 12 112 12 80 C12 48 35 22 58 20 Z" fill="#15803D" opacity="0.9"/>
      <!-- Natural deep cutouts -->
      <path d="M58 35 C70 42 85 45 105 38 C98 52 82 52 65 48" fill="#FFFFFF" opacity="0.01"/>
      <!-- Fenestration holes inside leaf -->
      <ellipse cx="40" cy="65" rx="5" ry="14" transform="rotate(-30 40 65)" fill="#0D5528"/>
      <ellipse cx="80" cy="65" rx="5" ry="14" transform="rotate(30 80 65)" fill="#0D5528"/>
      <ellipse cx="36" cy="92" rx="4" ry="11" transform="rotate(-40 36 92)" fill="#0D5528"/>
      <ellipse cx="84" cy="92" rx="4" ry="11" transform="rotate(40 84 92)" fill="#0D5528"/>
      <line x1="58" y1="35" x2="35" y2="48" stroke="#166534" stroke-width="1.8"/>
      <line x1="58" y1="35" x2="85" y2="48" stroke="#166534" stroke-width="1.8"/>
      <line x1="58" y1="65" x2="25" y2="78" stroke="#166534" stroke-width="1.8"/>
      <line x1="58" y1="65" x2="95" y2="78" stroke="#166534" stroke-width="1.8"/>
    </svg>`,
  },
  {
    id: 'botanical-ginkgo-biloba',
    name: 'Gilded Ginkgo Leaves',
    category: 'botanical',
    tags: ['ginkgo', 'gold', 'japan', 'foliage', 'zen', 'elegance', 'leaves'],
    defaultWidth: 130,
    defaultHeight: 120,
    aspectRatio: 130 / 120,
    svgContent: `<svg viewBox="0 0 130 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Stems -->
      <path d="M65 110 Q58 85 45 60" stroke="#B45309" stroke-width="2" stroke-linecap="round"/>
      <path d="M65 110 Q72 80 85 55" stroke="#B45309" stroke-width="2" stroke-linecap="round"/>
      <!-- Left Ginkgo Fan -->
      <path d="M45 60 C25 58 10 40 18 20 C28 5 45 15 48 30 C50 15 68 5 78 20 C85 40 70 58 45 60 Z" fill="#F59E0B" opacity="0.9" stroke="#D97706" stroke-width="1.5"/>
      <line x1="45" y1="60" x2="30" y2="24" stroke="#D97706" stroke-width="1" stroke-dasharray="1 2"/>
      <line x1="45" y1="60" x2="48" y2="28" stroke="#D97706" stroke-width="1" stroke-dasharray="1 2"/>
      <line x1="45" y1="60" x2="65" y2="24" stroke="#D97706" stroke-width="1" stroke-dasharray="1 2"/>
      <!-- Right Ginkgo Fan -->
      <path d="M85 55 C102 52 118 36 112 18 C104 5 88 12 85 26 C82 12 66 5 58 18 C52 36 68 52 85 55 Z" fill="#FBBF24" opacity="0.9" stroke="#D97706" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id: 'botanical-hibiscus-bloom',
    name: 'Tropical Hibiscus Bloom',
    category: 'botanical',
    tags: ['hibiscus', 'tropical', 'red', 'coastal', 'flower', 'exotic'],
    defaultWidth: 120,
    defaultHeight: 120,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 5 fluted hibiscus petals -->
      <path d="M60 60 C55 35 30 18 15 35 C2 50 25 70 60 60 Z" fill="#E11D48"/>
      <path d="M60 60 C75 35 105 20 115 40 C125 58 95 72 60 60 Z" fill="#F43F5E"/>
      <path d="M60 60 C80 75 100 105 80 118 C62 125 55 95 60 60 Z" fill="#BE123C"/>
      <path d="M60 60 C40 80 15 110 5 95 C-5 78 30 65 60 60 Z" fill="#E11D48"/>
      <path d="M60 60 C50 30 65 5 80 15 C95 28 80 50 60 60 Z" fill="#FB7185"/>
      <!-- Long projecting stamen column -->
      <path d="M60 60 Q75 45 92 25" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <circle cx="94" cy="22" r="3.5" fill="#F59E0B"/>
      <circle cx="88" cy="28" r="2.5" fill="#F59E0B"/>
      <circle cx="82" cy="34" r="2.5" fill="#F59E0B"/>
      <!-- Center dark ruby throat -->
      <circle cx="60" cy="60" r="10" fill="#881337"/>
    </svg>`,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 4. WEDDINGS & ROMANCE
  // ═════════════════════════════════════════════════════════════════════════
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
      <path d="M25 35 C25 55 45 60 45 60 L45 95 M32 95 L58 95" stroke="#B99A62" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M20 35 L70 35 C70 35 60 55 45 58 C30 55 20 35 20 35 Z" fill="#FDF6B2" stroke="#B99A62" stroke-width="2"/>
      <path d="M95 35 C95 55 75 60 75 60 L75 95 M62 95 L88 95" stroke="#B99A62" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M100 35 L50 35 C50 35 60 55 75 58 C90 55 100 35 100 35 Z" fill="#FDF6B2" stroke="#B99A62" stroke-width="2"/>
      <path d="M60 20 Q60 28 68 28 Q60 28 60 36 Q60 28 52 28 Q60 28 60 20 Z" fill="#F59E0B"/>
      <circle cx="56" cy="42" r="1.5" fill="#FFFFFF"/>
      <circle cx="64" cy="46" r="1.5" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    id: 'wedding-lovebirds-perch',
    name: 'Pair of Lovebirds on Blossom',
    category: 'wedding',
    tags: ['birds', 'lovebirds', 'romance', 'wedding', 'sweet', 'spring'],
    defaultWidth: 130,
    defaultHeight: 100,
    aspectRatio: 130 / 100,
    svgContent: `<svg viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Twig branch -->
      <path d="M10 82 Q65 72 120 78" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>
      <!-- Pink blossoms on twig -->
      <circle cx="28" cy="80" r="6" fill="#FDA4AF"/>
      <circle cx="102" cy="76" r="6" fill="#FDA4AF"/>
      <circle cx="28" cy="80" r="2" fill="#F59E0B"/>
      <circle cx="102" cy="76" r="2" fill="#F59E0B"/>
      <!-- Left Lovebird (Sky Blue) -->
      <path d="M42 75 C35 70 30 52 45 42 C56 34 65 42 62 60 C62 70 54 75 42 75 Z" fill="#38BDF8"/>
      <!-- Left beak & eye -->
      <polygon points="62,44 68,46 62,48" fill="#F59E0B"/>
      <circle cx="54" cy="43" r="2" fill="#0F172A"/>
      <!-- Right Lovebird (Blush Rose) -->
      <path d="M80 75 C87 70 92 52 77 42 C66 34 57 42 60 60 C60 70 68 75 80 75 Z" fill="#F472B6"/>
      <polygon points="60,44 54,46 60,48" fill="#F59E0B"/>
      <circle cx="68" cy="43" r="2" fill="#0F172A"/>
      <!-- Floating tiny heart between them -->
      <path d="M61 32 C61 32 55 26 55 21 C55 17 58 15 61 18 C64 15 67 17 67 21 C67 26 61 32 61 32 Z" fill="#EF4444"/>
    </svg>`,
  },
  {
    id: 'wedding-airmail-postmark',
    name: 'Vintage Airmail Love Stamp',
    category: 'wedding',
    tags: ['stamp', 'airmail', 'vintage', 'postmark', 'travel', 'destination', 'love'],
    defaultWidth: 120,
    defaultHeight: 90,
    aspectRatio: 120 / 90,
    svgContent: `<svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Stamp scalloped serrated border -->
      <rect x="8" y="8" width="104" height="74" rx="4" fill="#FFFDF9" stroke="#CBD5E1" stroke-width="1.5"/>
      <!-- Inner framing line -->
      <rect x="14" y="14" width="92" height="62" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4 2"/>
      <!-- Stamp Heart & Typography -->
      <path d="M60 48 C60 48 44 36 44 26 C44 20 48 16 54 16 C58 16 60 19 60 19 C60 19 62 16 66 16 C72 16 76 20 76 26 C76 36 60 48 60 48 Z" fill="#DC2626"/>
      <text x="60" y="62" font-family="serif" font-size="8" font-weight="bold" fill="#1E3A8A" text-anchor="middle" letter-spacing="1.5">AIR MAIL</text>
      <text x="60" y="70" font-family="sans-serif" font-size="6" fill="#64748B" text-anchor="middle" letter-spacing="1">SPECIAL DELIVERY</text>
      <!-- Circular cancellation postmark wave -->
      <circle cx="88" cy="45" r="22" stroke="#475569" stroke-width="1.2" opacity="0.65"/>
      <path d="M72 40 Q88 35 104 40 M72 45 Q88 40 104 45 M72 50 Q88 45 104 50" stroke="#475569" stroke-width="1" opacity="0.65"/>
    </svg>`,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 5. BIRTHDAYS & PARTIES
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'birthday-tiered-cake',
    name: 'Celebration Layer Cake',
    category: 'birthday',
    tags: ['cake', 'candles', 'birthday', 'celebration', 'sweet'],
    defaultWidth: 120,
    defaultHeight: 140,
    aspectRatio: 120 / 140,
    svgContent: `<svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="130" rx="55" ry="8" fill="#E2E8F0"/>
      <rect x="20" y="85" width="80" height="40" rx="6" fill="#F472B6"/>
      <path d="M20 95 Q30 102 40 95 Q50 102 60 95 Q70 102 80 95 Q90 102 100 95 L100 85 L20 85 Z" fill="#FDF2F8"/>
      <rect x="35" y="55" width="50" height="30" rx="5" fill="#38BDF8"/>
      <path d="M35 63 Q43 70 51 63 Q60 70 68 63 Q76 70 85 63 L85 55 L35 55 Z" fill="#F0F9FF"/>
      <rect x="46" y="32" width="4" height="23" fill="#FBBF24" rx="1"/>
      <rect x="58" y="30" width="4" height="25" fill="#34D399" rx="1"/>
      <rect x="70" y="32" width="4" height="23" fill="#A78BFA" rx="1"/>
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
      <path d="M60 145 Q55 110 40 75" stroke="#94A3B8" stroke-width="1.5"/>
      <path d="M60 145 Q62 105 60 65" stroke="#94A3B8" stroke-width="1.5"/>
      <path d="M60 145 Q70 110 80 75" stroke="#94A3B8" stroke-width="1.5"/>
      <ellipse cx="40" cy="55" rx="22" ry="28" fill="#FB7185"/>
      <polygon points="38,82 42,82 40,86" fill="#E11D48"/>
      <ellipse cx="80" cy="55" rx="22" ry="28" fill="#FBBF24"/>
      <polygon points="78,82 82,82 80,86" fill="#D97706"/>
      <ellipse cx="60" cy="40" rx="24" ry="30" fill="#38BDF8"/>
      <polygon points="58,69 62,69 60,73" fill="#0284C7"/>
      <ellipse cx="53" cy="28" rx="5" ry="8" transform="rotate(-20 53 28)" fill="#FFFFFF" opacity="0.5"/>
      <ellipse cx="33" cy="45" rx="4" ry="7" transform="rotate(-20 33 45)" fill="#FFFFFF" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'birthday-retro-sun',
    name: '70s Groovy Sunshine',
    category: 'birthday',
    tags: ['sun', 'retro', '70s', 'groovy', 'disco', 'fun', 'happy', 'boho'],
    defaultWidth: 120,
    defaultHeight: 120,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Wavy 70s rays -->
      <g stroke="#F59E0B" stroke-width="4" stroke-linecap="round">
        <path d="M60 15 Q65 8 60 2"/>
        <path d="M60 105 Q65 112 60 118"/>
        <path d="M15 60 Q8 65 2 60"/>
        <path d="M105 60 Q112 65 118 60"/>
        <path d="M28 28 Q24 20 18 24"/>
        <path d="M92 92 Q96 100 102 96"/>
        <path d="M28 92 Q20 96 24 102"/>
        <path d="M92 28 Q100 24 96 18"/>
      </g>
      <!-- Sun Core Face -->
      <circle cx="60" cy="60" r="32" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>
      <!-- Happy retro eyes and smile -->
      <path d="M48 54 Q52 48 56 54" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M64 54 Q68 48 72 54" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M50 66 Q60 76 70 66" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Rosy cheeks -->
      <circle cx="46" cy="62" r="4" fill="#F43F5E" opacity="0.6"/>
      <circle cx="74" cy="62" r="4" fill="#F43F5E" opacity="0.6"/>
    </svg>`,
  },
  {
    id: 'birthday-party-popper',
    name: 'Party Popper Explosion',
    category: 'birthday',
    tags: ['popper', 'confetti', 'surprise', 'birthday', 'party', 'fireworks'],
    defaultWidth: 120,
    defaultHeight: 120,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Popper cone -->
      <polygon points="20,105 45,65 60,78 30,112" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
      <polygon points="25,98 52,72 56,76 30,104" fill="#EF4444"/>
      <!-- Streamers -->
      <path d="M52 70 Q70 45 95 52 Q110 58 115 45" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M56 75 Q85 85 92 68 Q98 50 112 55" stroke="#EC4899" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Exploding starburst confetti -->
      <circle cx="75" cy="35" r="4" fill="#10B981"/>
      <circle cx="95" cy="25" r="5" fill="#F59E0B"/>
      <circle cx="85" cy="55" r="3.5" fill="#8B5CF6"/>
      <circle cx="65" cy="45" r="3" fill="#EF4444"/>
      <polygon points="98,38 101,44 107,44 102,48 104,54 98,50 93,54 95,48 90,44 96,44" fill="#FBBF24"/>
    </svg>`,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 6. NIGHTLIFE & COCKTAILS
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'celebration-disco-ball',
    name: 'Faceted Mirror Disco Ball',
    category: 'celebration',
    tags: ['disco', 'ball', 'nightlife', 'party', 'cocktails', 'sparkle', 'music', 'dance'],
    defaultWidth: 120,
    defaultHeight: 140,
    aspectRatio: 120 / 140,
    svgContent: `<svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Hanging chain -->
      <line x1="60" y1="5" x2="60" y2="35" stroke="#94A3B8" stroke-width="2" stroke-dasharray="2 3"/>
      <!-- Disco Sphere -->
      <circle cx="60" cy="80" r="45" fill="#1E293B" stroke="#CBD5E1" stroke-width="2"/>
      <!-- Mirror Facet Grids -->
      <path d="M22 65 Q60 55 98 65" stroke="#94A3B8" stroke-width="1.2"/>
      <path d="M16 80 Q60 70 104 80" stroke="#E2E8F0" stroke-width="1.4"/>
      <path d="M22 95 Q60 85 98 95" stroke="#94A3B8" stroke-width="1.2"/>
      <line x1="42" y1="40" x2="42" y2="120" stroke="#94A3B8" stroke-width="1.2"/>
      <line x1="60" y1="35" x2="60" y2="125" stroke="#E2E8F0" stroke-width="1.5"/>
      <line x1="78" y1="40" x2="78" y2="120" stroke="#94A3B8" stroke-width="1.2"/>
      <!-- Gleaming Light Sparkles -->
      <path d="M42 62 Q42 52 48 52 Q42 52 42 42 Q42 52 36 52 Q42 52 42 62 Z" fill="#F8FAFC"/>
      <path d="M82 85 Q82 75 88 75 Q82 75 82 65 Q82 75 76 75 Q82 75 82 85 Z" fill="#F8FAFC"/>
      <circle cx="68" cy="74" r="3" fill="#38BDF8"/>
      <circle cx="52" cy="88" r="2.5" fill="#F472B6"/>
    </svg>`,
  },
  {
    id: 'celebration-martini-glass',
    name: 'Vintage Cocktail Martini Coupe',
    category: 'celebration',
    tags: ['cocktail', 'martini', 'coupe', 'drinks', 'olive', 'bar', 'nightlife', 'party'],
    defaultWidth: 100,
    defaultHeight: 130,
    aspectRatio: 100 / 130,
    svgContent: `<svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Base and stem -->
      <line x1="30" y1="120" x2="70" y2="120" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
      <line x1="50" y1="70" x2="50" y2="120" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round"/>
      <!-- V-shaped Martini Bowl -->
      <polygon points="15,25 85,25 50,70" fill="#FEF9C3" fill-opacity="0.3" stroke="#D4AF37" stroke-width="2"/>
      <line x1="24" y1="36" x2="76" y2="36" stroke="#FDE047" stroke-width="2"/>
      <!-- Cocktail skewer with green olive & red pimento -->
      <line x1="28" y1="12" x2="68" y2="52" stroke="#B87333" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse cx="50" cy="34" rx="7" ry="9" transform="rotate(45 50 34)" fill="#65A30D" stroke="#3F6212" stroke-width="1"/>
      <circle cx="50" cy="34" r="2.5" fill="#DC2626"/>
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
      <path d="M70 15 Q70 35 90 35 Q70 35 70 55 Q70 35 50 35 Q70 35 70 15 Z" fill="#F59E0B"/>
      <path d="M30 45 Q30 57 42 57 Q30 57 30 69 Q30 57 18 57 Q30 57 30 45 Z" fill="#D4AF37"/>
      <path d="M110 50 Q110 62 122 62 Q110 62 110 74 Q110 62 98 62 Q110 62 110 50 Z" fill="#D4AF37"/>
      <circle cx="50" cy="20" r="4" fill="#EC4899"/>
      <circle cx="95" cy="25" r="3.5" fill="#3B82F6"/>
      <circle cx="35" cy="85" r="4.5" fill="#10B981"/>
      <circle cx="105" cy="90" r="4" fill="#F43F5E"/>
      <circle cx="70" cy="80" r="5" fill="#FBBF24"/>
      <path d="M20 25 Q35 15 45 35" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M95 75 Q115 85 125 70" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 7. MILESTONES & HONOURS
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'milestone-mortarboard-cap',
    name: 'Graduation Mortarboard',
    category: 'milestone',
    tags: ['graduation', 'cap', 'mortarboard', 'honors', 'degree'],
    defaultWidth: 130,
    defaultHeight: 90,
    aspectRatio: 130 / 90,
    svgContent: `<svg viewBox="0 0 130 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="65,15 120,40 65,65 10,40" fill="#1E293B"/>
      <polygon points="65,18 114,40 65,62 16,40" fill="#0F172A"/>
      <path d="M35 50 C35 70 95 70 95 50" fill="#1E293B"/>
      <circle cx="65" cy="40" r="4" fill="#F59E0B"/>
      <path d="M65 40 Q85 45 90 68" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="87" y="68" width="6" height="14" rx="2" fill="#D97706"/>
    </svg>`,
  },
  {
    id: 'milestone-quill-inkwell',
    name: 'Quill Pen & Antique Inkwell',
    category: 'milestone',
    tags: ['quill', 'pen', 'ink', 'scholar', 'author', 'doctor', 'honour', 'certificate'],
    defaultWidth: 120,
    defaultHeight: 120,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Glass Inkwell -->
      <rect x="68" y="78" width="36" height="30" rx="6" fill="#1E293B" stroke="#D4AF37" stroke-width="1.8"/>
      <rect x="74" y="70" width="24" height="8" rx="2" fill="#D4AF37"/>
      <!-- Graceful Feather Quill Pen -->
      <path d="M22 18 C35 15 55 30 78 80 L80 84 L74 80 C50 60 30 40 22 18 Z" fill="#D4AF37" stroke="#92400E" stroke-width="1.5"/>
      <path d="M22 18 Q55 52 79 83" stroke="#FFFBEB" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Ink Droplet -->
      <path d="M82 92 C82 92 78 98 82 102 C86 98 82 92 82 92 Z" fill="#0F172A"/>
    </svg>`,
  },
  {
    id: 'milestone-rosette-medal',
    name: 'Distinction Rosette Ribbon',
    category: 'milestone',
    tags: ['rosette', 'medal', 'award', 'distinction', 'ribbon', 'first place', 'honour'],
    defaultWidth: 110,
    defaultHeight: 140,
    aspectRatio: 110 / 140,
    svgContent: `<svg viewBox="0 0 110 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Hanging Satin Ribbons -->
      <path d="M42 75 L30 130 L45 120 L55 130 L50 75 Z" fill="#1E3A8A"/>
      <path d="M68 75 L55 130 L65 120 L80 130 L68 75 Z" fill="#2563EB"/>
      <!-- Pleated Rosette Rim -->
      <circle cx="55" cy="50" r="38" fill="#1E3A8A" stroke="#D4AF37" stroke-width="2.5"/>
      <circle cx="55" cy="50" r="32" fill="#2563EB"/>
      <!-- Golden Center Medallion -->
      <circle cx="55" cy="50" r="22" fill="#D4AF37" stroke="#92400E" stroke-width="1.5"/>
      <!-- Embossed Center Star -->
      <polygon points="55,34 58,44 68,44 60,50 63,60 55,54 47,60 50,50 42,44 52,44" fill="#FFFBEB"/>
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

  // ═════════════════════════════════════════════════════════════════════════
  // 8. BABY & FAMILY
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'baby-crescent-moon-clouds',
    name: 'Lullaby Moon & Sleeping Cloud',
    category: 'baby',
    tags: ['moon', 'cloud', 'stars', 'baby', 'shower', 'lullaby', 'sweet', 'nursery'],
    defaultWidth: 130,
    defaultHeight: 120,
    aspectRatio: 130 / 120,
    svgContent: `<svg viewBox="0 0 130 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Golden Crescent Moon -->
      <path d="M65 15 C88 15 106 33 106 58 C106 83 88 101 65 101 C60 101 56 100 52 98 C72 90 85 70 85 58 C85 46 72 26 52 18 C56 16 60 15 65 15 Z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/>
      <!-- Soft Fluffy Cloud Base -->
      <path d="M25 85 C25 76 33 68 42 68 C44 60 52 54 62 54 C72 54 80 60 84 68 C92 68 98 75 98 83 C98 92 90 98 82 98 L32 98 C25 98 25 92 25 85 Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
      <!-- Hanging Star -->
      <line x1="72" y1="26" x2="72" y2="44" stroke="#D4AF37" stroke-width="1" stroke-dasharray="1 2"/>
      <polygon points="72,44 74,48 78,48 75,51 76,55 72,53 68,55 69,51 66,48 70,48" fill="#F59E0B"/>
    </svg>`,
  },
  {
    id: 'baby-safari-elephant',
    name: 'Baby Safari Elephant with Crown',
    category: 'baby',
    tags: ['elephant', 'safari', 'baby', 'crown', 'cute', 'nursery', 'shower'],
    defaultWidth: 120,
    defaultHeight: 110,
    aspectRatio: 120 / 110,
    svgContent: `<svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Elephant Body -->
      <ellipse cx="60" cy="65" rx="30" ry="24" fill="#94A3B8"/>
      <rect x="42" y="75" width="8" height="22" rx="4" fill="#64748B"/>
      <rect x="68" y="75" width="8" height="22" rx="4" fill="#64748B"/>
      <!-- Elephant Head -->
      <circle cx="85" cy="50" r="18" fill="#94A3B8"/>
      <!-- Large Ear -->
      <ellipse cx="72" cy="50" rx="14" ry="18" fill="#F472B6" stroke="#64748B" stroke-width="2"/>
      <!-- Trunk curving up -->
      <path d="M96 55 Q108 55 106 40 Q104 32 98 32" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
      <!-- Sprayed water heart -->
      <path d="M102 24 C102 24 98 18 98 14 C98 10 100 8 102 11 C104 8 106 10 106 14 C106 18 102 24 102 24 Z" fill="#38BDF8"/>
      <!-- Eye -->
      <circle cx="88" cy="46" r="2.5" fill="#0F172A"/>
      <!-- Tiny golden crown -->
      <polygon points="80,32 83,24 86,28 89,24 92,32" fill="#F59E0B"/>
    </svg>`,
  },
  {
    id: 'baby-footprints-golden',
    name: 'Golden Baby Footprints',
    category: 'baby',
    tags: ['baby', 'footprints', 'shower', 'sweet', 'family'],
    defaultWidth: 100,
    defaultHeight: 100,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="36" cy="62" rx="11" ry="17" transform="rotate(-10 36 62)" fill="#F472B6" opacity="0.9"/>
      <circle cx="28" cy="38" r="4.5" fill="#F472B6"/>
      <circle cx="37" cy="36" r="3.5" fill="#F472B6"/>
      <circle cx="44" cy="38" r="3" fill="#F472B6"/>
      <circle cx="49" cy="42" r="2.5" fill="#F472B6"/>
      <circle cx="52" cy="47" r="2" fill="#F472B6"/>
      <ellipse cx="64" cy="55" rx="11" ry="17" transform="rotate(10 64 55)" fill="#F472B6" opacity="0.9"/>
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
      <path d="M55 45 C45 20 15 10 10 35 C5 60 40 55 55 45 Z" fill="#C084FC" opacity="0.85"/>
      <path d="M55 45 C40 55 20 65 25 80 C30 90 50 70 55 45 Z" fill="#E879F9" opacity="0.85"/>
      <path d="M55 45 C65 20 95 10 100 35 C105 60 70 55 55 45 Z" fill="#C084FC" opacity="0.85"/>
      <path d="M55 45 C70 55 90 65 85 80 C80 90 60 70 55 45 Z" fill="#E879F9" opacity="0.85"/>
      <ellipse cx="55" cy="45" rx="3" ry="16" fill="#581C87"/>
      <path d="M55 30 Q50 20 44 18" stroke="#581C87" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M55 30 Q60 20 66 18" stroke="#581C87" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 9. MEMORIAL & SOLEMN TRIBUTES
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'memorial-tree-of-life',
    name: 'Ancient Tree of Life',
    category: 'memorial',
    tags: ['tree', 'roots', 'life', 'memorial', 'legacy', 'heritage', 'peace', 'tribute'],
    defaultWidth: 130,
    defaultHeight: 130,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Ancient rooted trunk -->
      <path d="M65 110 C62 90 55 75 48 60 M65 110 C68 90 75 75 82 60 M65 110 L65 52" stroke="#52525B" stroke-width="3" stroke-linecap="round"/>
      <!-- Intertwining deep roots -->
      <path d="M65 110 Q50 120 32 124 M65 110 Q80 120 98 124" stroke="#52525B" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Canopy branches forming circular aura -->
      <circle cx="65" cy="55" r="42" stroke="#B99A62" stroke-width="1.5" stroke-dasharray="3 3"/>
      <!-- Leaf clusters in sage & gold -->
      <ellipse cx="65" cy="22" rx="14" ry="8" fill="#71717A" opacity="0.8"/>
      <ellipse cx="40" cy="35" rx="12" ry="7" fill="#84A68B" opacity="0.8"/>
      <ellipse cx="90" cy="35" rx="12" ry="7" fill="#84A68B" opacity="0.8"/>
      <ellipse cx="30" cy="55" rx="10" ry="6" fill="#D4AF37" opacity="0.7"/>
      <ellipse cx="100" cy="55" rx="10" ry="6" fill="#D4AF37" opacity="0.7"/>
      <ellipse cx="45" cy="72" rx="10" ry="6" fill="#71717A" opacity="0.8"/>
      <ellipse cx="85" cy="72" rx="10" ry="6" fill="#71717A" opacity="0.8"/>
    </svg>`,
  },
  {
    id: 'memorial-peace-dove',
    name: 'Dove of Peace',
    category: 'memorial',
    tags: ['dove', 'peace', 'memorial', 'tribute', 'solemn'],
    defaultWidth: 120,
    defaultHeight: 100,
    aspectRatio: 120 / 100,
    svgContent: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 45 C40 25 70 15 95 15 C85 30 75 40 85 55 C95 55 105 50 110 55 C105 65 85 70 70 65 C55 75 40 85 25 90 C30 75 35 65 30 55 Z" fill="#E2E8F0" opacity="0.95"/>
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
      <rect x="25" y="55" width="30" height="60" rx="3" fill="#F1F5F9"/>
      <ellipse cx="40" cy="55" rx="15" ry="3" fill="#E2E8F0"/>
      <line x1="40" y1="53" x2="40" y2="42" stroke="#334155" stroke-width="2"/>
      <circle cx="40" cy="30" r="18" fill="#FEF08A" opacity="0.35"/>
      <path d="M40 16 C48 24 50 36 40 44 C30 36 32 24 40 16 Z" fill="#F59E0B"/>
      <path d="M40 25 C44 30 44 38 40 42 C36 38 36 30 40 25 Z" fill="#FEF08A"/>
    </svg>`,
  },
  {
    id: 'memorial-forget-me-not',
    name: 'Forget-Me-Not Blossoms',
    category: 'memorial',
    tags: ['flower', 'forget me not', 'blue', 'memorial', 'remembrance', 'tender', 'love'],
    defaultWidth: 110,
    defaultHeight: 110,
    aspectRatio: 1,
    svgContent: `<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Stems -->
      <path d="M35 85 Q50 65 60 40 M50 65 Q70 55 75 35" stroke="#4D7C0F" stroke-width="2" stroke-linecap="round"/>
      <!-- Flower 1 (Center Top) -->
      <g transform="translate(60, 38)">
        <circle cx="0" cy="-10" r="6" fill="#60A5FA"/>
        <circle cx="10" cy="-3" r="6" fill="#60A5FA"/>
        <circle cx="6" cy="8" r="6" fill="#60A5FA"/>
        <circle cx="-6" cy="8" r="6" fill="#60A5FA"/>
        <circle cx="-10" cy="-3" r="6" fill="#60A5FA"/>
        <circle cx="0" cy="0" r="4" fill="#FBBF24" stroke="#FFFFFF" stroke-width="1"/>
      </g>
      <!-- Flower 2 (Right) -->
      <g transform="translate(78, 32) scale(0.8)">
        <circle cx="0" cy="-10" r="6" fill="#93C5FD"/>
        <circle cx="10" cy="-3" r="6" fill="#93C5FD"/>
        <circle cx="6" cy="8" r="6" fill="#93C5FD"/>
        <circle cx="-6" cy="8" r="6" fill="#93C5FD"/>
        <circle cx="-10" cy="-3" r="6" fill="#93C5FD"/>
        <circle cx="0" cy="0" r="4" fill="#FBBF24"/>
      </g>
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
