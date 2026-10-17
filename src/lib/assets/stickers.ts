export interface StickerAsset {
  id: string;
  name: string;
  category:
    | 'tiktok'
    | 'party'
    | 'wedding'
    | 'heritage'
    | 'botanical'
    | 'milestone'
    | 'baby'
    | 'memorial';
  tags: string[];
  // Genuine transparent 3D PNG image sticker URL (WhatsApp / TikTok style)
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
  width = 120,
  height = 120
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
  // 1. TIKTOK & WHATSAPP VIRAL REACTIONS & VIBES
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'tiktok-party-popper',
    'Party Popper Explosion',
    'tiktok',
    ['party', 'popper', 'confetti', 'yay', 'celebration', 'tiktok', 'whatsapp', 'surprise'],
    130,
    130
  ),
  createSticker(
    'tiktok-fire',
    'Fire Reaction 🔥',
    'tiktok',
    ['fire', 'flame', 'lit', 'hot', 'viral', 'energy', 'slay', 'tiktok', 'whatsapp'],
    110,
    110
  ),
  createSticker(
    'tiktok-hundred',
    '100% Points 💯',
    'tiktok',
    ['hundred', '100', 'perfect', 'score', 'facts', 'vibe', 'tiktok', 'whatsapp'],
    110,
    110
  ),
  createSticker(
    'tiktok-partying-face',
    'Partying Smiley 🥳',
    'tiktok',
    ['party', 'smiley', 'face', 'celebrate', 'horn', 'confetti', 'happy', 'birthday'],
    115,
    115
  ),
  createSticker(
    'tiktok-heart-eyes',
    'Love Heart Eyes 😍',
    'tiktok',
    ['heart', 'eyes', 'love', 'in love', 'gorgeous', 'adoring', 'crush', 'reaction'],
    115,
    115
  ),
  createSticker(
    'tiktok-sparkling-heart',
    'Sparkling Pink Heart 💖',
    'tiktok',
    ['sparkling', 'heart', 'pink', 'sparkles', 'love', 'aesthetic', 'sweet'],
    115,
    115
  ),
  createSticker(
    'tiktok-heart-fire',
    'Heart on Fire ❤️‍🔥',
    'tiktok',
    ['heart', 'fire', 'passion', 'flame', 'burning', 'love', 'wild'],
    115,
    115
  ),
  createSticker(
    'tiktok-camera-flash',
    'Camera with Flash 📸',
    'tiktok',
    ['camera', 'photo', 'polaroid', 'flash', 'memories', 'aesthetic', 'shoot'],
    110,
    110
  ),
  createSticker(
    'tiktok-sparkles',
    'Gleaming Gold Sparkles ✨',
    'tiktok',
    ['sparkles', 'glitter', 'gold', 'stars', 'magic', 'shine', 'clean'],
    110,
    110
  ),
  createSticker(
    'tiktok-eyes',
    'Shifty Eyes 👀',
    'tiktok',
    ['eyes', 'look', 'attention', 'tea', 'spill', 'peeking', 'reaction'],
    110,
    110
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 2. NIGHTLIFE, CELEBRATION & COCKTAILS
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'party-disco-ball',
    '3D Faceted Mirror Disco Ball 🪩',
    'party',
    ['disco', 'ball', 'mirror', 'nightlife', 'party', 'dance', '70s', 'club', 'glam'],
    125,
    125
  ),
  createSticker(
    'party-champagne-pop',
    'Popping Champagne Bottle 🍾',
    'party',
    ['champagne', 'bottle', 'pop', 'cork', 'celebrate', 'toast', 'bubbly', 'vip'],
    120,
    140
  ),
  createSticker(
    'party-cheers-glasses',
    'Clinking Champagne Coupes 🥂',
    'party',
    ['cheers', 'toast', 'glasses', 'champagne', 'wedding', 'reception', 'drinks'],
    125,
    125
  ),
  createSticker(
    'party-cocktail',
    'Martini Cocktail with Olive 🍸',
    'party',
    ['cocktail', 'martini', 'olive', 'bar', 'drinks', 'speakeasy', 'noir', 'classy'],
    110,
    130
  ),
  createSticker(
    'party-tropical-drink',
    'Tropical Tiki Cocktail 🍹',
    'party',
    ['tropical', 'tiki', 'drink', 'umbrella', 'summer', 'beach', 'pool party'],
    115,
    135
  ),
  createSticker(
    'party-birthday-cake',
    'Celebration Birthday Cake 🎂',
    'party',
    ['cake', 'birthday', 'candles', 'frosting', 'sweet', 'party', 'anniversary'],
    125,
    125
  ),
  createSticker(
    'party-balloon',
    'Festive Party Balloon 🎈',
    'party',
    ['balloon', 'red', 'party', 'birthday', 'celebration', 'fun'],
    110,
    135
  ),
  createSticker(
    'party-confetti-ball',
    'Exploding Confetti Ball 🎊',
    'party',
    ['confetti', 'ball', 'burst', 'celebration', 'festive', 'carnival'],
    120,
    120
  ),
  createSticker(
    'party-sparkler',
    'Burning Golden Sparkler 🎇',
    'party',
    ['sparkler', 'fireworks', 'golden', 'sparks', 'night', 'new year', 'festive'],
    115,
    135
  ),
  createSticker(
    'party-wrapped-gift',
    'Wrapped Gift with Ribbon 🎁',
    'party',
    ['gift', 'present', 'box', 'ribbon', 'surprise', 'birthday', 'christmas'],
    115,
    115
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 3. WEDDINGS, ROMANCE & ELEGANCE
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'wedding-diamond-ring',
    'Solitaire Diamond Gold Ring 💍',
    'wedding',
    ['ring', 'diamond', 'gold', 'wedding', 'proposal', 'engagement', 'marriage'],
    115,
    115
  ),
  createSticker(
    'wedding-red-rose',
    'Velvet Red Rose Bloom 🌹',
    'wedding',
    ['rose', 'flower', 'red', 'romance', 'love', 'blush', 'bloom', 'petal'],
    115,
    115
  ),
  createSticker(
    'wedding-flower-bouquet',
    'Wedding Floral Bouquet 💐',
    'wedding',
    ['bouquet', 'flowers', 'wedding', 'bridal', 'spring', 'blooms'],
    125,
    125
  ),
  createSticker(
    'wedding-two-hearts',
    'Two Entwined Hearts 💕',
    'wedding',
    ['hearts', 'two hearts', 'pink', 'romance', 'couple', 'together'],
    115,
    115
  ),
  createSticker(
    'wedding-white-heart',
    'Pure White Heart 🤍',
    'wedding',
    ['heart', 'white', 'pure', 'minimal', 'clean', 'peace', 'modern'],
    110,
    110
  ),
  createSticker(
    'wedding-red-heart',
    'Classic Glossy Red Heart ❤️',
    'wedding',
    ['heart', 'red', 'classic', 'love', 'valentines', 'romance'],
    110,
    110
  ),
  createSticker(
    'wedding-heart-ribbon',
    'Gift Heart with Ribbon 💝',
    'wedding',
    ['heart', 'ribbon', 'gift', 'gold ribbon', 'romance', 'precious'],
    115,
    115
  ),
  createSticker(
    'wedding-heart-arrow',
    'Cupid Heart with Arrow 💘',
    'wedding',
    ['heart', 'arrow', 'cupid', 'smitten', 'shot', 'love'],
    115,
    115
  ),
  createSticker(
    'wedding-gem-stone',
    'Brilliant Cut Diamond Gem 💎',
    'wedding',
    ['gem', 'diamond', 'jewel', 'crystal', 'luxury', 'precious', 'shine'],
    110,
    110
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 4. HERITAGE, SAFARI & EAST AFRICAN CULTURE
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'heritage-ceremonial-drum',
    'Ceremonial African Drum 🪘',
    'heritage',
    ['drum', 'djembe', 'african', 'music', 'rhythm', 'ruracio', 'traditional', 'harambee'],
    120,
    130
  ),
  createSticker(
    'heritage-warrior-shield',
    'Warrior Ceremonial Shield 🛡️',
    'heritage',
    ['shield', 'african', 'warrior', 'protection', 'crest', 'heritage', 'traditional'],
    115,
    125
  ),
  createSticker(
    'heritage-safari-lion',
    'Regal African Lion 🦁',
    'heritage',
    ['lion', 'king', 'safari', 'wildlife', 'kenya', 'brave', 'serengeti', 'mara'],
    120,
    120
  ),
  createSticker(
    'heritage-safari-elephant',
    'Majestic Safari Elephant 🐘',
    'heritage',
    ['elephant', 'safari', 'wildlife', 'amboseli', 'kenya', 'wisdom', 'nature'],
    125,
    115
  ),
  createSticker(
    'heritage-safari-giraffe',
    'Tall Safari Giraffe 🦒',
    'heritage',
    ['giraffe', 'safari', 'wildlife', 'giraffe manor', 'kenya', 'gentle'],
    115,
    140
  ),
  createSticker(
    'heritage-safari-zebra',
    'Plains African Zebra 🦓',
    'heritage',
    ['zebra', 'stripes', 'safari', 'wildlife', 'maasai mara', 'kenya'],
    120,
    120
  ),
  createSticker(
    'heritage-hot-chai',
    'Steaming Chai / Dawa ☕',
    'heritage',
    ['chai', 'tea', 'dawa', 'coffee', 'hot', 'kenyan chai', 'breakfast', 'karibu'],
    115,
    115
  ),
  createSticker(
    'heritage-travel-plane',
    'Destination Travel Airplane ✈️',
    'heritage',
    ['plane', 'airplane', 'travel', 'destination', 'flight', 'honeymoon', 'mombasa'],
    125,
    115
  ),
  createSticker(
    'heritage-luggage',
    'Safari Travel Suitcase 🧳',
    'heritage',
    ['luggage', 'suitcase', 'travel', 'vacation', 'safari', 'trip', 'journey'],
    115,
    120
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 5. BOTANICALS & FLORALS
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'botanical-palm-tree',
    'Coastal Island Palm Tree 🌴',
    'botanical',
    ['palm', 'tree', 'coastal', 'beach', 'tropical', 'diani', 'mombasa', 'island'],
    120,
    135
  ),
  createSticker(
    'botanical-hibiscus',
    'Tropical Hibiscus Bloom 🌺',
    'botanical',
    ['hibiscus', 'flower', 'pink', 'tropical', 'bloom', 'exotic'],
    115,
    115
  ),
  createSticker(
    'botanical-cherry-blossom',
    'Sakura Cherry Blossom 🌸',
    'botanical',
    ['cherry blossom', 'sakura', 'pink', 'spring', 'floral', 'delicate'],
    115,
    115
  ),
  createSticker(
    'botanical-sunflower',
    'Radiant Golden Sunflower 🌻',
    'botanical',
    ['sunflower', 'golden', 'yellow', 'flower', 'sunny', 'summer'],
    115,
    115
  ),
  createSticker(
    'botanical-tulip',
    'Fresh Garden Tulip 🌷',
    'botanical',
    ['tulip', 'flower', 'spring', 'garden', 'pink', 'blossom'],
    110,
    130
  ),
  createSticker(
    'botanical-clover',
    'Lucky Four-Leaf Clover 🍀',
    'botanical',
    ['clover', 'lucky', 'four leaf', 'green', 'fortune', 'irish'],
    110,
    110
  ),
  createSticker(
    'botanical-seedling',
    'Fresh Green Sprout 🌱',
    'botanical',
    ['seedling', 'sprout', 'leaf', 'green', 'growth', 'new beginning', 'eco'],
    110,
    115
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 6. HONOURS & MILESTONES
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'milestone-graduation-cap',
    'Mortarboard Graduation Cap 🎓',
    'milestone',
    ['graduation', 'cap', 'mortarboard', 'degree', 'diploma', 'class of', 'scholar'],
    130,
    110
  ),
  createSticker(
    'milestone-trophy',
    'Gold Championship Trophy 🏆',
    'milestone',
    ['trophy', 'champion', 'gold', 'award', 'winner', 'cup', 'honour'],
    115,
    135
  ),
  createSticker(
    'milestone-medal',
    '1st Place Distinction Medal 🥇',
    'milestone',
    ['medal', 'gold medal', 'first place', 'award', 'honour', 'ribbon'],
    110,
    130
  ),
  createSticker(
    'milestone-royal-crown',
    'Gilded Imperial Crown 👑',
    'milestone',
    ['crown', 'royal', 'queen', 'king', 'gold', 'regal', 'princess'],
    125,
    110
  ),
  createSticker(
    'milestone-diploma-scroll',
    'Honour Diploma Scroll 📜',
    'milestone',
    ['scroll', 'diploma', 'degree', 'certificate', 'parchment', 'graduation'],
    120,
    120
  ),
  createSticker(
    'milestone-fountain-pen',
    'Gold Nib Scholar Pen 🖋️',
    'milestone',
    ['pen', 'fountain pen', 'ink', 'signature', 'author', 'scholar', 'write'],
    110,
    130
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 7. BABY & FAMILY
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'baby-teddy-bear',
    'Vintage Plush Teddy Bear 🧸',
    'baby',
    ['teddy', 'bear', 'plush', 'toy', 'cute', 'baby', 'shower', 'nursery'],
    120,
    125
  ),
  createSticker(
    'baby-bottle',
    'Pastel Nursery Milk Bottle 🍼',
    'baby',
    ['bottle', 'baby', 'milk', 'shower', 'newborn', 'nursery'],
    110,
    135
  ),
  createSticker(
    'baby-crescent-moon',
    'Golden Lullaby Crescent Moon 🌙',
    'baby',
    ['moon', 'crescent', 'night', 'lullaby', 'stars', 'sweet dreams', 'gold'],
    115,
    115
  ),
  createSticker(
    'baby-sun-face',
    'Smiling Warm Sunshine 🌞',
    'baby',
    ['sun', 'sunshine', 'smiling', 'face', 'warm', 'morning', 'happy'],
    120,
    120
  ),
  createSticker(
    'baby-glowing-star',
    'Cute Glowing Star 🌟',
    'baby',
    ['star', 'glowing', 'shine', 'twinkle', 'yellow', 'gold'],
    115,
    115
  ),

  // ═════════════════════════════════════════════════════════════════════════
  // 8. MEMORIAL & SOLEMN TRIBUTES
  // ═════════════════════════════════════════════════════════════════════════
  createSticker(
    'memorial-dove',
    'Peace Dove in Flight 🕊️',
    'memorial',
    ['dove', 'peace', 'olive', 'wings', 'tribute', 'memorial', 'rest in peace'],
    125,
    115
  ),
  createSticker(
    'memorial-candle',
    'Candle of Remembrance 🕯️',
    'memorial',
    ['candle', 'flame', 'light', 'remembrance', 'vigil', 'memorial', 'peace'],
    100,
    135
  ),
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
