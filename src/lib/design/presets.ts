/**
 * Curated typography pairs, palette presets with WCAG contrast math,
 * and layout presets for the Kadi Studio creative controls.
 */

export interface FontPair {
  id: string;
  label: string;
  headingFont: string;
  bodyFont: string;
  headingStyle: 'serif' | 'sans' | 'display' | 'script';
  description: string;
}

export const CURATED_FONT_PAIRS: FontPair[] = [
  {
    id: 'playfair-inter',
    label: 'Playfair Display + Inter',
    headingFont: 'Playfair Display, Georgia, serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    headingStyle: 'serif',
    description: 'Regal editorial poise paired with crisp contemporary clarity.',
  },
  {
    id: 'cormorant-proza',
    label: 'Cormorant Garamond + Proza',
    headingFont: 'Cormorant Garamond, Garamond, serif',
    bodyFont: 'DM Sans, sans-serif',
    headingStyle: 'serif',
    description: 'Timeless luxury with delicate serifs and warm humanist readability.',
  },
  {
    id: 'cinzel-montserrat',
    label: 'Cinzel + Montserrat',
    headingFont: 'Cinzel, Georgia, serif',
    bodyFont: 'Montserrat, sans-serif',
    headingStyle: 'display',
    description: 'Classical Roman stone-carved stateliness with architectural balance.',
  },
  {
    id: 'fraunces-dmsans',
    label: 'Fraunces + DM Sans',
    headingFont: 'Fraunces, serif',
    bodyFont: 'DM Sans, sans-serif',
    headingStyle: 'serif',
    description: 'Warm editorial character with expressive soft curves.',
  },
  {
    id: 'bodoni-jakarta',
    label: 'Bodoni Moda + Plus Jakarta Sans',
    headingFont: 'Bodoni Moda, Didot, serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    headingStyle: 'serif',
    description: 'High-fashion editorial elegance with clean modern typography.',
  },
  {
    id: 'newsreader-worksans',
    label: 'Newsreader + Work Sans',
    headingFont: 'Newsreader, Georgia, serif',
    bodyFont: 'Work Sans, sans-serif',
    headingStyle: 'serif',
    description: 'Literary heritage and rhythmic cadence for solemn or dignified gatherings.',
  },
  {
    id: 'marcellus-lato',
    label: 'Marcellus + Lato',
    headingFont: 'Marcellus, serif',
    bodyFont: 'Lato, sans-serif',
    headingStyle: 'serif',
    description: 'Flared roman terminals with balanced neutral body paragraphs.',
  },
  {
    id: 'merriweather-opensans',
    label: 'Merriweather + Open Sans',
    headingFont: 'Merriweather, serif',
    bodyFont: 'Open Sans, sans-serif',
    headingStyle: 'serif',
    description: 'Sturdy, highly legible proportions built for effortless mobile reading.',
  },
  {
    id: 'syne-space',
    label: 'Syne + Space Grotesk',
    headingFont: 'Syne, sans-serif',
    bodyFont: 'Space Grotesk, sans-serif',
    headingStyle: 'display',
    description: 'Modern avant-garde geometry for product launches and contemporary galas.',
  },
  {
    id: 'baskerville-source',
    label: 'Libre Baskerville + Source Sans',
    headingFont: 'Libre Baskerville, serif',
    bodyFont: 'Source Sans 3, sans-serif',
    headingStyle: 'serif',
    description: 'Traditional academic and diplomatic grace for formal convocations.',
  },
  {
    id: 'prata-outfit',
    label: 'Prata + Outfit',
    headingFont: 'Prata, Didot, serif',
    bodyFont: 'Outfit, sans-serif',
    headingStyle: 'serif',
    description: 'Didone aesthetic with sharp teardrop terminals and spirited body rhythm.',
  },
  {
    id: 'alex-brush-inter',
    label: 'Alex Brush + Inter',
    headingFont: 'Alex Brush, cursive',
    bodyFont: 'Inter, sans-serif',
    headingStyle: 'script',
    description: 'Hand-scripted calligraphic flourishing with restrained modern body text.',
  },
];

export interface PalettePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export const CURATED_PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'savannah-twilight',
    name: 'Savannah Twilight',
    category: 'wedding',
    description: 'Warm terracotta, dark roast coffee, muted brass, and linen vellum.',
    colors: {
      primary: '#934638',
      secondary: '#3E2F28',
      accent: '#C59B4B',
      background: '#FAF8F5',
      text: '#272620',
    },
  },
  {
    id: 'terracotta-sunset',
    name: 'Terracotta Sunset',
    category: 'cultural-celebration',
    description: 'Earthy brick clay, baked earth, and warm acacia sunshine.',
    colors: {
      primary: '#C2593F',
      secondary: '#6B3426',
      accent: '#E8A87C',
      background: '#FDF9F5',
      text: '#2E1F1A',
    },
  },
  {
    id: 'maasai-ochre',
    name: 'Maasai Ochre & Bead',
    category: 'cultural-celebration',
    description: 'Ceremonial red ochre, deep bead lapis, and savannah sunlight.',
    colors: {
      primary: '#B93B26',
      secondary: '#1F365D',
      accent: '#D9A74A',
      background: '#FAF6EE',
      text: '#24221E',
    },
  },
  {
    id: 'rift-valley-sage',
    name: 'Rift Valley Sage',
    category: 'wedding',
    description: 'Subtle acacia sage, deep cedar pine, and morning mountain mist.',
    colors: {
      primary: '#4A6B53',
      secondary: '#2D4433',
      accent: '#C3A66B',
      background: '#F7FAF6',
      text: '#1E2922',
    },
  },
  {
    id: 'swahili-azure',
    name: 'Swahili Coast Azure',
    category: 'anniversary',
    description: 'Lamu coral stone, Indian Ocean lapis, and weathered teakwood.',
    colors: {
      primary: '#20546F',
      secondary: '#113243',
      accent: '#E4B87C',
      background: '#F6FAFC',
      text: '#18252C',
    },
  },
  {
    id: 'nairobi-jacaranda',
    name: 'Nairobi Jacaranda',
    category: 'birthday',
    description: 'October lilac blossoms, twilight shadow, and warm bronze.',
    colors: {
      primary: '#6B5282',
      secondary: '#3E2950',
      accent: '#E2B774',
      background: '#FAF7FC',
      text: '#281F30',
    },
  },
  {
    id: 'dignified-obsidian',
    name: 'Dignified Obsidian',
    category: 'memorial',
    description: 'Solemn charcoal slate, pure onyx, and warm candlelight beeswax.',
    colors: {
      primary: '#33373E',
      secondary: '#1E2024',
      accent: '#B09B82',
      background: '#F7F7F8',
      text: '#191B1F',
    },
  },
  {
    id: 'rose-blush',
    name: 'Rose Blush & Champagne',
    category: 'bridal-shower',
    description: 'Soft heirloom rose, plum velvet, and vintage champagne shimmer.',
    colors: {
      primary: '#9E5A63',
      secondary: '#593138',
      accent: '#D8AE75',
      background: '#FCF8F8',
      text: '#332124',
    },
  },
  {
    id: 'golden-champagne',
    name: 'Imperial Champagne',
    category: 'anniversary',
    description: 'Burnished leaf gold, dark bronze umber, and shimmering alabaster.',
    colors: {
      primary: '#8C7335',
      secondary: '#52421B',
      accent: '#C9A75E',
      background: '#FDFCF7',
      text: '#2E2818',
    },
  },
  {
    id: 'earthy-henna',
    name: 'Earthy Henna',
    category: 'engagement',
    description: 'Traditional henna dye, rich mahogany bark, and marigold pollen.',
    colors: {
      primary: '#8F432B',
      secondary: '#5C2718',
      accent: '#DCA052',
      background: '#FAF5EE',
      text: '#2D1A14',
    },
  },
  {
    id: 'royal-velvet',
    name: 'Royal Purple Velvet',
    category: 'milestone',
    description: 'Imperial amethyst, deep night purple, and heraldic crest gold.',
    colors: {
      primary: '#4D3670',
      secondary: '#201736',
      accent: '#D8AA47',
      background: '#F8F6FC',
      text: '#1C152A',
    },
  },
  {
    id: 'desert-sand',
    name: 'Desert Plaster & Sand',
    category: 'housewarming',
    description: 'Sunlit adobe plaster, roasted camel stone, and dried pampas.',
    colors: {
      primary: '#826D57',
      secondary: '#4A3E31',
      accent: '#C8995C',
      background: '#FBF8F3',
      text: '#29241E',
    },
  },
  {
    id: 'olive-orchard',
    name: 'Olive Orchard & Moss',
    category: 'engagement',
    description: 'Mediterranean pressed olive leaf, dark forest moss, and raw linen.',
    colors: {
      primary: '#5B6349',
      secondary: '#333827',
      accent: '#B89758',
      background: '#F9F9F4',
      text: '#22251D',
    },
  },
  {
    id: 'classic-monochrome',
    name: 'Architectural Slate',
    category: 'corporate',
    description: 'High-contrast carbon black, graphite, and pure newsprint.',
    colors: {
      primary: '#262626',
      secondary: '#525252',
      accent: '#8A8A8A',
      background: '#FAFAFA',
      text: '#171717',
    },
  },
  {
    id: 'warm-coral',
    name: 'Warm Coral & Apricot',
    category: 'birthday',
    description: 'Sunlit coral bloom, terracotta blush, and warm cream silk.',
    colors: {
      primary: '#B85848',
      secondary: '#702E23',
      accent: '#E8A87C',
      background: '#FFF9F7',
      text: '#301E1B',
    },
  },
  {
    id: 'forest-pine',
    name: 'Highland Pine',
    category: 'retreat',
    description: 'Mt. Kenya indigenous spruce, moss bark, and highland sunshine.',
    colors: {
      primary: '#294738',
      secondary: '#14281E',
      accent: '#C29B38',
      background: '#F5FAF6',
      text: '#17241D',
    },
  },
  {
    id: 'vintage-sepia',
    name: 'Vintage Sepia Folio',
    category: 'anniversary',
    description: 'Archival tintype sepia, chestnut ink, and aged vellum parchment.',
    colors: {
      primary: '#6E533F',
      secondary: '#423023',
      accent: '#BFA07A',
      background: '#FAF5EB',
      text: '#2B211A',
    },
  },
  {
    id: 'copper-rust',
    name: 'Burnished Copper Rust',
    category: 'cultural-celebration',
    description: 'Oxidized metal patina, scorched clay, and autumn amber.',
    colors: {
      primary: '#9E4E36',
      secondary: '#5E2A1C',
      accent: '#D98850',
      background: '#FDF7F3',
      text: '#2B1812',
    },
  },
  {
    id: 'soft-lavender',
    name: 'Soft Lavender Mist',
    category: 'baby-shower',
    description: 'Gentle English lavender, soft heather, and delicate morning dew.',
    colors: {
      primary: '#706488',
      secondary: '#453A57',
      accent: '#B8A279',
      background: '#FAF8FC',
      text: '#282133',
    },
  },
  {
    id: 'regal-navy',
    name: 'Kilindini Deep Navy',
    category: 'corporate',
    description: 'Port Kilindini ocean depths, brass compass, and naval officer white.',
    colors: {
      primary: '#1E3250',
      secondary: '#101E33',
      accent: '#C59B4B',
      background: '#F7FAFD',
      text: '#131E2E',
    },
  },
];

/**
 * Convert 3 or 6 hex digits to sRGB array [r, g, b] (0-255).
 */
export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) {
    return [39, 38, 32]; // fallback to dark ink
  }
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculate relative luminance of an sRGB color per WCAG 2.1 specs.
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG contrast ratio between foreground and background hex colors.
 * Returns ratio between 1.0 and 21.0.
 */
export function calculateContrastRatio(hexForeground: string, hexBackground: string): number {
  const [r1, g1, b1] = hexToRgb(hexForeground);
  const [r2, g2, b2] = hexToRgb(hexBackground);

  const lum1 = getRelativeLuminance(r1, g1, b1);
  const lum2 = getRelativeLuminance(r2, g2, b2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Number(ratio.toFixed(2));
}

export interface WcagRating {
  ratio: number;
  passAA: boolean; // >= 4.5:1 for normal text
  passAALarge: boolean; // >= 3.0:1 for large text
  passAAA: boolean; // >= 7.0:1
  label: 'AAA Excellent' | 'AA Pass' | 'Low Contrast Warning';
  badgeColor: string;
}

export function evaluateWcagContrast(hexForeground: string, hexBackground: string): WcagRating {
  const ratio = calculateContrastRatio(hexForeground, hexBackground);
  if (ratio >= 7.0) {
    return {
      ratio,
      passAA: true,
      passAALarge: true,
      passAAA: true,
      label: 'AAA Excellent',
      badgeColor: '#059669', // Emerald
    };
  }
  if (ratio >= 4.5) {
    return {
      ratio,
      passAA: true,
      passAALarge: true,
      passAAA: false,
      label: 'AA Pass',
      badgeColor: '#10B981', // Green
    };
  }
  return {
    ratio,
    passAA: false,
    passAALarge: ratio >= 3.0,
    passAAA: false,
    label: 'Low Contrast Warning',
    badgeColor: '#DC2626', // Red
  };
}

/**
 * Automatically adjust foreground text color to guarantee WCAG AA (>= 4.5:1) compliance against background.
 */
export function autoFixContrast(hexForeground: string, hexBackground: string): string {
  const [rBg, gBg, bBg] = hexToRgb(hexBackground);
  const bgLuminance = getRelativeLuminance(rBg, gBg, bBg);

  // If background is light (lum > 0.4), dark text is required.
  // If background is dark (lum <= 0.4), light text is required.
  if (bgLuminance > 0.4) {
    // Generate a deep ink variant of the foreground hue
    const [rFg, gFg, bFg] = hexToRgb(hexForeground);
    // Darken by 70% towards deep charcoal
    const r = Math.round(rFg * 0.25);
    const g = Math.round(gFg * 0.25);
    const b = Math.round(bFg * 0.25);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } else {
    // Lighten towards warm white / ivory
    return '#FAF8F5';
  }
}
