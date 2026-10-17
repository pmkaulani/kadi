export interface StickerAsset {
  id: string;
  name: string;
  category:
    | 'stationery'
    | 'botanical'
    | 'party'
    | 'badges'
    | 'cultural'
    | 'romance';
  tags: string[];
  // Genuine decorative image sticker URL (WhatsApp & TikTok style PNG cutouts)
  imageUrl: string;
  // Backward-compatible image markup
  svgContent: string;
  defaultWidth: number;
  defaultHeight: number;
  aspectRatio: number;
}

function createSticker(
  id: string,
  name: string,
  category: StickerAsset['category'],
  tags: string[],
  width = 130,
  height = 130
): StickerAsset {
  const imageUrl = `/stickers/${id}.png`;
  return {
    id,
    name,
    category,
    tags,
    imageUrl,
    svgContent: `<img src="${imageUrl}" alt="${name}" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />`,
    defaultWidth: width,
    defaultHeight: height,
    aspectRatio: width / height,
  };
}

export const STICKER_ASSETS: StickerAsset[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // 1. STATIONERY, WASHI TAPE & WAX SEALS
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'stationery-washi-gold',
    'Gold Foil Washi Tape',
    'stationery',
    ['washi', 'tape', 'gold', 'foil', 'scrapbook', 'stationery', 'paper', 'torn', 'decorative'],
    200,
    62
  ),
  createSticker(
    'stationery-washi-floral',
    'Botanical Eucalyptus Washi Tape',
    'stationery',
    ['washi', 'tape', 'eucalyptus', 'leaves', 'greenery', 'masking', 'scrapbook', 'botanical'],
    200,
    62
  ),
  createSticker(
    'stationery-washi-rose-gold',
    'Rose Gold Shimmer Washi Tape',
    'stationery',
    ['washi', 'tape', 'rose gold', 'pink', 'shimmer', 'glitter', 'tape', 'stationery'],
    200,
    62
  ),
  createSticker(
    'stationery-postage-stamp-vintage',
    'Vintage Airmail Stamp 50¢',
    'stationery',
    ['stamp', 'postage', 'airmail', 'vintage', 'royal post', 'mail', 'envelope', 'perforated'],
    120,
    140
  ),
  createSticker(
    'stationery-wax-seal-crimson',
    'Royal Crimson Wax Seal with Ribbon',
    'stationery',
    ['wax', 'seal', 'crimson', 'red', 'ribbon', 'monogram', 'royal', 'wedding', 'envelope'],
    130,
    150
  ),
  createSticker(
    'stationery-wax-seal-gold',
    'Antique Gilded Gold Wax Seal',
    'stationery',
    ['wax', 'seal', 'gold', 'gilded', 'embossed', 'botanical', 'olive', 'forever'],
    130,
    130
  ),
  createSticker(
    'stationery-wax-seal-sage',
    'Dusty Sage Green Wax Seal',
    'stationery',
    ['wax', 'seal', 'sage', 'green', 'dove', 'botanical', 'peace', 'luxury'],
    130,
    130
  ),
  createSticker(
    'stationery-polaroid-frame',
    'Polaroid Instant Photo Frame',
    'stationery',
    ['polaroid', 'photo', 'frame', 'tape', 'camera', 'memories', 'instant', 'scrapbook'],
    130,
    150
  ),
  createSticker(
    'stationery-brass-clip',
    'Vintage Brass Paperclip',
    'stationery',
    ['paperclip', 'clip', 'brass', 'gold', 'metal', 'scrapbook', 'stationery'],
    80,
    135
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 2. FLORALS & BOTANICALS
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'botanical-white-rose',
    'English Garden White Rose',
    'botanical',
    ['rose', 'white rose', 'flower', 'floral', 'botanical', 'wedding', 'bloom', 'petal'],
    130,
    130
  ),
  createSticker(
    'botanical-pink-peony',
    'Blooming Pink Peony',
    'botanical',
    ['peony', 'pink', 'flower', 'floral', 'botanical', 'bloom', 'spring', 'garden'],
    130,
    130
  ),
  createSticker(
    'botanical-eucalyptus-garland',
    'Silver Dollar Eucalyptus Sprig',
    'botanical',
    ['eucalyptus', 'leaves', 'greenery', 'foliage', 'silver dollar', 'garland', 'botanical'],
    130,
    130
  ),
  createSticker(
    'botanical-olive-branch',
    'Mediterranean Olive Branch',
    'botanical',
    ['olive', 'branch', 'olives', 'mediterranean', 'peace', 'leaves', 'greenery', 'tuscany'],
    130,
    130
  ),
  createSticker(
    'botanical-pampas-grass',
    'Bohemian Pampas Grass Plume',
    'botanical',
    ['pampas', 'grass', 'boho', 'bohemian', 'plume', 'dried floral', 'neutral', 'aesthetic'],
    130,
    130
  ),
  createSticker(
    'botanical-monstera-leaf',
    'Tropical Monstera Leaf',
    'botanical',
    ['monstera', 'leaf', 'tropical', 'greenery', 'palm', 'foliage', 'safari'],
    130,
    130
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 3. TOAST & CELEBRATION
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'party-champagne-pop',
    'Exploding Champagne Bottle',
    'party',
    ['champagne', 'pop', 'bottle', 'foam', 'bubbly', 'celebrate', 'toast', 'sparkles'],
    130,
    130
  ),
  createSticker(
    'party-crystal-flutes',
    'Crystal Champagne Toast Flutes',
    'party',
    ['champagne', 'flutes', 'glasses', 'toast', 'cheers', 'bubbly', 'wedding', 'party'],
    130,
    130
  ),
  createSticker(
    'party-disco-ball',
    'Holographic Disco Mirror Ball',
    'party',
    ['disco', 'ball', 'mirror', 'retro', 'party', 'nightlife', 'sparkles', 'dance'],
    130,
    130
  ),
  createSticker(
    'party-sparkler-wand',
    'Golden Sparkler Fireworks Wand',
    'party',
    ['sparkler', 'fireworks', 'fire', 'golden', 'sparks', 'sendoff', 'celebration'],
    130,
    130
  ),
  createSticker(
    'party-wedding-cake',
    'Floral Cascade Wedding Cake',
    'party',
    ['cake', 'wedding cake', 'tiers', 'floral', 'roses', 'dessert', 'slice', 'confection'],
    130,
    136
  ),
  createSticker(
    'party-gold-balloon-star',
    'Mylar Gold Star Foil Balloon',
    'party',
    ['balloon', 'star', 'gold', 'foil', 'mylar', 'metallic', 'party', 'celebrate'],
    130,
    130
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 4. SLOGANS, BADGES & EVENT RIBBONS
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'badge-save-the-date',
    'Save The Date Boarding Pass',
    'badges',
    ['save the date', 'boarding pass', 'ticket', 'stub', 'barcode', 'admit one', 'vip'],
    190,
    95
  ),
  createSticker(
    'badge-vip-access',
    'VIP All-Access Pass Wristband',
    'badges',
    ['vip', 'access', 'wristband', 'holographic', 'badge', 'pass', 'all access', 'party'],
    190,
    85
  ),
  createSticker(
    'badge-youre-invited',
    'Cordially Invited Emerald Ribbon',
    'badges',
    ['invited', 'cordially invited', 'invitation', 'ribbon', 'gold', 'emerald', 'luxury'],
    190,
    82
  ),
  createSticker(
    'badge-best-day-ever',
    'Best Day Ever Sunset Arch Badge',
    'badges',
    ['best day ever', 'sunset', 'arch', 'retro', 'badge', 'celebrate', 'happy', 'party'],
    130,
    130
  ),
  createSticker(
    'badge-its-giving-luxury',
    "It's Giving Luxury Pastel Badge",
    'badges',
    ['its giving', 'luxury', 'pastel', 'aesthetic', 'pill', 'tiktok', 'vibe', 'chic'],
    170,
    110
  ),
  createSticker(
    'badge-dress-to-impress',
    'Black Tie Dress Code Badge',
    'badges',
    ['dress code', 'black tie', 'dress to impress', 'formal', 'tuxedo', 'diamond', 'badge'],
    130,
    130
  ),
  createSticker(
    'badge-champagne-showers',
    'Champagne Showers Retro Badge',
    'badges',
    ['champagne showers', 'bubbly', 'showers', 'disco', 'nightlife', 'party', 'badge'],
    170,
    115
  ),
  createSticker(
    'badge-mr-and-mrs',
    'Just Married Mr & Mrs Ribbon',
    'badges',
    ['mr and mrs', 'just married', 'couple', 'wedding', 'bride', 'groom', 'ribbon'],
    180,
    98
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 5. HERITAGE, SWAHILI & CULTURAL CELEBRATIONS
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'cultural-harusi-tunayo',
    'Harusi Tunayo! Wedding Celebration Banner',
    'cultural',
    ['harusi', 'tunayo', 'swahili', 'wedding', 'kanga', 'drums', 'celebration', 'kenya', 'africa'],
    185,
    115
  ),
  createSticker(
    'cultural-ruracio-vibes',
    'Ruracio Traditional Dowry Badge',
    'cultural',
    ['ruracio', 'traditional', 'dowry', 'kikuyu', 'beads', 'ochre', 'african wedding', 'culture'],
    170,
    130
  ),
  createSticker(
    'cultural-sherehe-haitaki',
    'Sherehe Haitaki Hasira! Party Banner',
    'cultural',
    ['sherehe', 'haitaki hasira', 'party', 'kenya', 'swahili', 'energy', 'turnup', 'celebrate'],
    185,
    100
  ),
  createSticker(
    'cultural-kumepambana',
    'Kumepambana! High Energy Badge',
    'cultural',
    ['kumepambana', 'fire', 'party', 'swahili', 'high energy', 'shangwe', 'vibes'],
    130,
    130
  ),
  createSticker(
    'cultural-karibu-sana',
    'Karibu Sana Swahili Welcome Seal',
    'cultural',
    ['karibu sana', 'welcome', 'swahili', 'seal', 'gold', 'reception', 'guest'],
    130,
    130
  ),
  createSticker(
    'cultural-chai-gossip',
    'Chai & Gossip Spiced Tea Mug',
    'cultural',
    ['chai', 'tea', 'spiced', 'gossip', 'tea mug', 'kenyan chai', 'warm', 'friends'],
    130,
    130
  ),
  createSticker(
    'cultural-tukutane-sherehe',
    'Tukutane Sherehe Turn-Up Badge',
    'cultural',
    ['tukutane', 'sherehe', 'party', 'turnup', 'african party', 'dance', 'invitation'],
    180,
    110
  ),
  createSticker(
    'cultural-asante-sana',
    'Asante Sana Gratitude Seal',
    'cultural',
    ['asante sana', 'thank you', 'gratitude', 'swahili', 'pink', 'floral', 'love'],
    130,
    130
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 6. ROMANCE, LOVE & MILESTONES
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'romance-solitaire-diamond',
    'Solitaire Diamond Engagement Ring',
    'romance',
    ['diamond', 'ring', 'solitaire', 'engagement', 'proposal', 'gold', 'sparkle', 'forever'],
    130,
    136
  ),
  createSticker(
    'romance-interlocking-rings',
    'Interlocking Gold & Platinum Rings',
    'romance',
    ['rings', 'wedding bands', 'interlocking', 'platinum', 'gold', 'marriage', 'two souls'],
    140,
    120
  ),
  createSticker(
    'romance-white-doves',
    'Flying White Doves of Devotion',
    'romance',
    ['doves', 'dove', 'white', 'olive branch', 'peace', 'devotion', 'wedding', 'flying'],
    140,
    126
  ),
  createSticker(
    'romance-vintage-key',
    'Antique Golden Key to My Heart',
    'romance',
    ['key', 'golden key', 'antique', 'vintage', 'heart', 'love', 'skeleton key'],
    170,
    102
  ),
  createSticker(
    'romance-love-letter',
    'Deckle-Edge Sealed Love Letter',
    'romance',
    ['love letter', 'envelope', 'wax seal', 'sealed', 'heart', 'romance', 'deckle edge'],
    150,
    128
  ),
];
