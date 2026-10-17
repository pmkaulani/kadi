const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const STICKERS_DIR = path.join(__dirname, '..', 'public', 'stickers');
if (!fs.existsSync(STICKERS_DIR)) {
  fs.mkdirSync(STICKERS_DIR, { recursive: true });
}

async function renderSvgToPng(svgString, targetName, width = 450, height = 450) {
  const targetPath = path.join(STICKERS_DIR, `${targetName}.png`);
  const buf = Buffer.from(svgString);
  await sharp(buf)
    .resize(width, height, { fit: 'inside' })
    .png()
    .toFile(targetPath);
  console.log('✓ Generated decorative sticker:', targetName);
}

async function main() {
  console.log('=== BUILDING COMPLETE DECORATIVE STICKERS SUITE ===');

  // ═════════════════════════════════════════════════════════════════════════
  // 1. STATIONERY, WASHI TAPE & SEALS
  // ═════════════════════════════════════════════════════════════════════════

  // Gold Foil Geometric Washi Tape
  await renderSvgToPng(`
    <svg width="480" height="150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
        <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DFBA73" />
          <stop offset="25%" stop-color="#FDF3E3" />
          <stop offset="50%" stop-color="#C29B38" />
          <stop offset="75%" stop-color="#FFF0D4" />
          <stop offset="100%" stop-color="#9C7723" />
        </linearGradient>
        <pattern id="washiPattern" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 0 15 L 15 0 L 30 15 L 15 30 Z" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
          <circle cx="15" cy="15" r="3" fill="#ffffff" opacity="0.8"/>
        </pattern>
      </defs>
      <g filter="url(#drop)" transform="rotate(-2 240 75)">
        <path d="M 20,40 L 460,35 L 455,43 L 462,52 L 454,61 L 461,72 L 453,82 L 460,93 L 452,103 L 458,110 L 20,115 L 26,105 L 18,95 L 25,83 L 17,73 L 26,62 L 19,51 Z" 
              fill="url(#goldSheen)" opacity="0.94" stroke="#ffffff" stroke-width="2"/>
        <path d="M 20,40 L 460,35 L 455,43 L 462,52 L 454,61 L 461,72 L 453,82 L 460,93 L 452,103 L 458,110 L 20,115 L 26,105 L 18,95 L 25,83 L 17,73 L 26,62 L 19,51 Z" 
              fill="url(#washiPattern)"/>
      </g>
    </svg>
  `, 'stationery-washi-gold', 480, 150);

  // Floral Botanical Washi Tape
  await renderSvgToPng(`
    <svg width="480" height="150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(3 240 75)">
        <path d="M 22,40 L 458,35 L 452,44 L 460,53 L 453,63 L 461,75 L 452,85 L 459,96 L 451,105 L 457,112 L 22,118 L 28,107 L 19,97 L 27,84 L 18,74 L 27,63 L 20,52 Z" 
              fill="#F1F5F9" opacity="0.92" stroke="#ffffff" stroke-width="2"/>
        <g stroke="#0F766E" stroke-width="2" fill="none">
          <path d="M 40,75 Q 140,55 240,75 T 440,75" stroke-width="2.5"/>
          <ellipse cx="80" cy="65" rx="10" ry="5" transform="rotate(-30 80 65)" fill="#14B8A6" opacity="0.7"/>
          <ellipse cx="110" cy="85" rx="10" ry="5" transform="rotate(30 110 85)" fill="#14B8A6" opacity="0.7"/>
          <ellipse cx="160" cy="65" rx="10" ry="5" transform="rotate(-25 160 65)" fill="#14B8A6" opacity="0.7"/>
          <ellipse cx="190" cy="85" rx="10" ry="5" transform="rotate(25 190 85)" fill="#14B8A6" opacity="0.7"/>
          <ellipse cx="240" cy="65" rx="10" ry="5" transform="rotate(-30 240 65)" fill="#14B8A6" opacity="0.7"/>
          <ellipse cx="270" cy="85" rx="10" ry="5" transform="rotate(30 270 85)" fill="#14B8A6" opacity="0.7"/>
          <ellipse cx="320" cy="65" rx="10" ry="5" transform="rotate(-25 320 65)" fill="#14B8A6" opacity="0.7"/>
          <ellipse cx="350" cy="85" rx="10" ry="5" transform="rotate(25 350 85)" fill="#14B8A6" opacity="0.7"/>
          <ellipse cx="400" cy="65" rx="10" ry="5" transform="rotate(-30 400 65)" fill="#14B8A6" opacity="0.7"/>
        </g>
      </g>
    </svg>
  `, 'stationery-washi-floral', 480, 150);

  // Rose Gold Shimmer Washi Tape
  await renderSvgToPng(`
    <svg width="480" height="150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
        <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F43F5E" />
          <stop offset="30%" stop-color="#FDA4AF" />
          <stop offset="70%" stop-color="#FB7185" />
          <stop offset="100%" stop-color="#E11D48" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-1.5 240 75)">
        <path d="M 22,40 L 458,35 L 451,44 L 460,55 L 452,65 L 459,76 L 450,86 L 457,98 L 449,108 L 456,115 L 22,120 L 29,109 L 20,98 L 28,86 L 19,75 L 27,64 L 20,53 Z" 
              fill="url(#roseGold)" opacity="0.9" stroke="#ffffff" stroke-width="2"/>
        <line x1="40" y1="60" x2="440" y2="60" stroke="#FFE4E6" stroke-width="2" stroke-dasharray="8,8"/>
        <line x1="40" y1="95" x2="440" y2="95" stroke="#FFE4E6" stroke-width="2" stroke-dasharray="8,8"/>
      </g>
    </svg>
  `, 'stationery-washi-rose-gold', 480, 150);

  // Vintage Postage Stamp
  await renderSvgToPng(`
    <svg width="360" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(-3 180 210)">
        <rect x="25" y="25" width="310" height="370" rx="6" fill="#FAF5EE" stroke="#ffffff" stroke-width="8"/>
        <rect x="35" y="35" width="290" height="350" fill="none" stroke="#E2D4C0" stroke-width="3"/>
        <rect x="50" y="50" width="260" height="320" fill="#112327"/>
        <circle cx="180" cy="170" r="70" fill="none" stroke="#B99A62" stroke-width="2"/>
        <circle cx="180" cy="170" r="64" fill="none" stroke="#B99A62" stroke-width="1" stroke-dasharray="3,3"/>
        <text x="180" y="155" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="42" fill="#B99A62" text-anchor="middle">KADI</text>
        <text x="180" y="185" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="14" fill="#FCE0AD" letter-spacing="5" text-anchor="middle">ROYAL POST</text>
        <text x="180" y="240" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#ffffff" letter-spacing="4" text-anchor="middle">AIR MAIL • NAIROBI</text>
        <text x="180" y="265" font-family="'Courier New', monospace" font-size="14" font-weight="bold" fill="#B99A62" letter-spacing="3" text-anchor="middle">2026 SPECIAL ISSUE</text>
        <text x="180" y="330" font-family="Impact, Arial Black, sans-serif" font-size="36" fill="#FCE0AD" text-anchor="middle">50¢</text>
        <g stroke="#ffffff" stroke-width="2.5" opacity="0.65" fill="none" transform="rotate(-15 220 180)">
          <path d="M 60,180 Q 90,165 120,180 T 180,180 T 240,180 T 300,180"/>
          <path d="M 60,195 Q 90,180 120,195 T 180,195 T 240,195 T 300,195"/>
          <path d="M 60,210 Q 90,195 120,210 T 180,210 T 240,210 T 300,210"/>
        </g>
      </g>
    </svg>
  `, 'stationery-postage-stamp-vintage', 360, 420);

  // Royal Crimson Wax Seal with Ribbon
  await renderSvgToPng(`
    <svg width="360" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="rgba(0,0,0,0.55)"/>
        </filter>
        <linearGradient id="waxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#991B1B" />
          <stop offset="40%" stop-color="#7F1D1D" />
          <stop offset="100%" stop-color="#450A0A" />
        </linearGradient>
        <linearGradient id="goldEmboss" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="50%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#B45309" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-2 180 210)">
        <polygon points="150,220 120,380 150,360 170,385 170,220" fill="#991B1B" opacity="0.95"/>
        <polygon points="170,220 190,385 210,360 240,380 210,220" fill="#7F1D1D" opacity="0.95"/>
        <circle cx="180" cy="180" r="148" fill="#ffffff" />
        <path d="M 180,36 C 225,32 260,50 285,80 C 315,115 324,155 315,195 C 305,240 275,280 235,305 C 190,328 145,320 105,298 C 65,270 42,225 40,180 C 38,135 60,88 95,60 C 125,38 150,38 180,36 Z" fill="url(#waxGrad)"/>
        <circle cx="180" cy="180" r="105" fill="#7F1D1D" stroke="#450A0A" stroke-width="4"/>
        <circle cx="180" cy="180" r="95" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="6,4"/>
        <text x="180" y="165" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="52" fill="url(#goldEmboss)" text-anchor="middle">K</text>
        <text x="180" y="205" font-family="'Cinzel', Georgia, serif" font-size="14" font-weight="bold" fill="#FDE68A" letter-spacing="4" text-anchor="middle">SEAL OF LOVE</text>
        <circle cx="180" cy="225" r="4" fill="#FDE68A"/>
      </g>
    </svg>
  `, 'stationery-wax-seal-crimson', 360, 420);

  // Antique Gilded Gold Wax Seal
  await renderSvgToPng(`
    <svg width="360" height="360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
        <linearGradient id="goldWax" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="40%" stop-color="#D97706" />
          <stop offset="100%" stop-color="#78350F" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(3 180 180)">
        <circle cx="180" cy="180" r="160" fill="#ffffff" />
        <circle cx="180" cy="180" r="148" fill="url(#goldWax)" />
        <circle cx="180" cy="180" r="120" fill="#B45309" stroke="#FDE68A" stroke-width="3"/>
        <circle cx="180" cy="180" r="110" fill="none" stroke="#FDE68A" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="180" y="165" font-size="44" text-anchor="middle">🌿</text>
        <text x="180" y="215" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="16" fill="#FEF3C7" letter-spacing="4" text-anchor="middle">FOREVER</text>
      </g>
    </svg>
  `, 'stationery-wax-seal-gold', 360, 360);

  // Dusty Sage Green Botanical Wax Seal
  await renderSvgToPng(`
    <svg width="360" height="360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="sageWax" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6EE7B7" />
          <stop offset="50%" stop-color="#059669" />
          <stop offset="100%" stop-color="#064E3B" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-3 180 180)">
        <circle cx="180" cy="180" r="160" fill="#ffffff" />
        <path d="M 180,34 C 228,30 265,52 288,82 C 318,118 326,158 316,198 C 304,242 274,282 232,308 C 188,330 142,322 102,298 C 62,270 38,225 36,180 C 34,135 56,88 92,60 C 122,38 148,36 180,34 Z" fill="url(#sageWax)"/>
        <circle cx="180" cy="180" r="105" fill="#064E3B" stroke="#047857" stroke-width="4"/>
        <circle cx="180" cy="180" r="95" fill="none" stroke="#A7F3D0" stroke-width="2" stroke-dasharray="6,4"/>
        <text x="180" y="165" font-size="44" text-anchor="middle">🕊️</text>
        <text x="180" y="210" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="15" fill="#A7F3D0" letter-spacing="4" text-anchor="middle">PEACE &amp; JOY</text>
      </g>
    </svg>
  `, 'stationery-wax-seal-sage', 360, 360);

  // Polaroid Frame with Tape
  await renderSvgToPng(`
    <svg width="340" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(-4 170 200)">
        <rect x="20" y="30" width="300" height="340" rx="8" fill="#ffffff" stroke="#E2E8F0" stroke-width="2"/>
        <rect x="35" y="45" width="270" height="250" rx="4" fill="#0F172A" />
        <circle cx="170" cy="170" r="40" fill="none" stroke="#38BDF8" stroke-width="2"/>
        <text x="170" y="180" font-size="36" text-anchor="middle">📸</text>
        <text x="170" y="335" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="24" fill="#1E293B" text-anchor="middle">Forever &amp; Always ♡</text>
        <rect x="120" y="15" width="100" height="30" fill="#FEF08A" opacity="0.65" transform="rotate(-2 170 30)"/>
      </g>
    </svg>
  `, 'stationery-polaroid-frame', 340, 400);

  // Vintage Brass Paperclip Cutout
  await renderSvgToPng(`
    <svg width="240" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="40%" stop-color="#D97706" />
          <stop offset="80%" stop-color="#B45309" />
          <stop offset="100%" stop-color="#78350F" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(12 120 200)">
        <!-- Outer white die-cut stroke -->
        <path d="M 80,100 L 80,310 C 80,350 160,350 160,310 L 160,70 C 160,30 60,30 60,70 L 60,330 C 60,390 180,390 180,330 L 180,120" 
              fill="none" stroke="#ffffff" stroke-width="26" stroke-linecap="round"/>
        <!-- Inner metal stroke -->
        <path d="M 80,100 L 80,310 C 80,350 160,350 160,310 L 160,70 C 160,30 60,30 60,70 L 60,330 C 60,390 180,390 180,330 L 180,120" 
              fill="none" stroke="url(#brassGrad)" stroke-width="14" stroke-linecap="round"/>
      </g>
    </svg>
  `, 'stationery-brass-clip', 240, 400);

  // ═════════════════════════════════════════════════════════════════════════
  // 2. BOTANICALS & FLORALS
  // ═════════════════════════════════════════════════════════════════════════

  // English White Garden Rose Cutout
  await renderSvgToPng(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
        <radialGradient id="roseWhite" cx="45%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="50%" stop-color="#FAF5EE" />
          <stop offset="85%" stop-color="#EADBC8" />
          <stop offset="100%" stop-color="#D5C0A7" />
        </radialGradient>
      </defs>
      <g filter="url(#drop)">
        <!-- White die-cut contour -->
        <circle cx="200" cy="200" r="175" fill="#ffffff"/>
        <!-- Stem & leaves -->
        <path d="M 120,290 C 80,320 60,370 60,370 C 100,360 140,330 140,290 Z" fill="#2D6A4F" stroke="#ffffff" stroke-width="3"/>
        <path d="M 280,290 C 320,320 340,370 340,370 C 300,360 260,330 260,290 Z" fill="#40916C" stroke="#ffffff" stroke-width="3"/>
        <!-- Flower petals -->
        <circle cx="200" cy="200" r="150" fill="url(#roseWhite)"/>
        <!-- Concentric delicate petal layers -->
        <circle cx="200" cy="190" r="120" fill="#FAF5EE" stroke="#E2D4C0" stroke-width="3"/>
        <circle cx="205" cy="185" r="95" fill="#FFFFFF" stroke="#D5C0A7" stroke-width="3"/>
        <circle cx="195" cy="180" r="70" fill="#FDFBF7" stroke="#C8B39B" stroke-width="3"/>
        <circle cx="200" cy="180" r="45" fill="#FAF5EE" stroke="#BFA88D" stroke-width="3"/>
        <circle cx="200" cy="178" r="22" fill="#EADBC8" stroke="#A89075" stroke-width="2"/>
        <text x="200" y="345" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="15" fill="#1B4332" letter-spacing="4" text-anchor="middle">WHITE ROSE</text>
      </g>
    </svg>
  `, 'botanical-white-rose', 400, 400);

  // Lush Pink Peony Cutout
  await renderSvgToPng(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
        <radialGradient id="peonyGrad" cx="45%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#FFF1F2" />
          <stop offset="40%" stop-color="#FECDD3" />
          <stop offset="75%" stop-color="#FB7185" />
          <stop offset="100%" stop-color="#E11D48" />
        </radialGradient>
      </defs>
      <g filter="url(#drop)">
        <circle cx="200" cy="200" r="175" fill="#ffffff"/>
        <!-- Leaves -->
        <path d="M 100,280 C 60,310 40,360 40,360 C 80,350 120,320 120,280 Z" fill="#15803D"/>
        <path d="M 300,280 C 340,310 360,360 360,360 C 320,350 280,320 280,280 Z" fill="#166534"/>
        <!-- Peony petals -->
        <circle cx="200" cy="190" r="145" fill="url(#peonyGrad)"/>
        <circle cx="195" cy="185" r="115" fill="#FDA4AF" stroke="#F43F5E" stroke-width="2.5"/>
        <circle cx="205" cy="180" r="85" fill="#FECDD3" stroke="#E11D48" stroke-width="2.5"/>
        <circle cx="200" cy="175" r="55" fill="#FFE4E6" stroke="#BE123C" stroke-width="2"/>
        <circle cx="200" cy="172" r="28" fill="#F43F5E" stroke="#9F1239" stroke-width="2"/>
        <text x="200" y="345" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="15" fill="#881337" letter-spacing="4" text-anchor="middle">BLOOMING PEONY</text>
      </g>
    </svg>
  `, 'botanical-pink-peony', 400, 400);

  // Silver Dollar Eucalyptus Garland
  await renderSvgToPng(`
    <svg width="420" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(-15 210 210)">
        <!-- Thick white die-cut contour -->
        <path d="M 80,380 Q 210,210 340,40" stroke="#ffffff" stroke-width="38" stroke-linecap="round" fill="none"/>
        <!-- Main Stem -->
        <path d="M 80,380 Q 210,210 340,40" stroke="#475569" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Eucalyptus leaves with white outline -->
        <g stroke="#ffffff" stroke-width="5">
          <circle cx="120" cy="330" r="32" fill="#64748B"/>
          <circle cx="160" cy="270" r="38" fill="#94A3B8"/>
          <circle cx="210" cy="210" r="42" fill="#64748B"/>
          <circle cx="260" cy="150" r="38" fill="#94A3B8"/>
          <circle cx="300" cy="90" r="32" fill="#64748B"/>
          <!-- Inner veins -->
          <circle cx="120" cy="330" r="28" fill="#94A3B8" stroke="none"/>
          <circle cx="210" cy="210" r="36" fill="#94A3B8" stroke="none"/>
        </g>
      </g>
    </svg>
  `, 'botanical-eucalyptus-garland', 420, 420);

  // Mediterranean Olive Branch
  await renderSvgToPng(`
    <svg width="420" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(10 210 210)">
        <path d="M 60,360 Q 200,240 360,70" stroke="#ffffff" stroke-width="32" stroke-linecap="round" fill="none"/>
        <path d="M 60,360 Q 200,240 360,70" stroke="#713F12" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Olive leaves -->
        <g fill="#4D7C0F" stroke="#ffffff" stroke-width="4">
          <ellipse cx="120" cy="310" rx="30" ry="12" transform="rotate(-40 120 310)"/>
          <ellipse cx="160" cy="260" rx="34" ry="13" transform="rotate(30 160 260)"/>
          <ellipse cx="210" cy="210" rx="36" ry="14" transform="rotate(-45 210 210)"/>
          <ellipse cx="260" cy="160" rx="34" ry="13" transform="rotate(35 260 160)"/>
          <ellipse cx="310" cy="110" rx="30" ry="12" transform="rotate(-30 310 110)"/>
          <!-- Ripe dark olives -->
          <ellipse cx="140" cy="290" rx="14" ry="19" fill="#1C1917" transform="rotate(15 140 290)"/>
          <ellipse cx="240" cy="190" rx="14" ry="19" fill="#1C1917" transform="rotate(-20 240 190)"/>
        </g>
      </g>
    </svg>
  `, 'botanical-olive-branch', 420, 420);

  // Bohemian Pampas Grass
  await renderSvgToPng(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
        <linearGradient id="pampasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FAF5EE" />
          <stop offset="50%" stop-color="#D5C0A7" />
          <stop offset="100%" stop-color="#A89075" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-5 200 200)">
        <!-- Plume with white die-cut contour -->
        <path d="M 200,380 L 200,240 C 130,220 100,160 120,80 C 160,50 200,30 200,30 C 200,30 240,50 280,80 C 300,160 270,220 200,240 Z" fill="#ffffff" stroke="#ffffff" stroke-width="16" stroke-linejoin="round"/>
        <path d="M 200,380 L 200,240 C 130,220 100,160 120,80 C 160,50 200,30 200,30 C 200,30 240,50 280,80 C 300,160 270,220 200,240 Z" fill="url(#pampasGrad)"/>
        <line x1="200" y1="380" x2="200" y2="40" stroke="#8C7040" stroke-width="4"/>
        <text x="200" y="340" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="14" fill="#78350F" letter-spacing="4" text-anchor="middle">PAMPAS PLUME</text>
      </g>
    </svg>
  `, 'botanical-pampas-grass', 400, 400);

  // Tropical Monstera Leaf Cutout
  await renderSvgToPng(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
        <linearGradient id="monsteraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#15803D" />
          <stop offset="60%" stop-color="#14532D" />
          <stop offset="100%" stop-color="#052E16" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(8 200 200)">
        <path d="M 200,380 C 120,340 50,260 50,170 C 50,80 140,30 200,30 C 260,30 350,80 350,170 C 350,260 280,340 200,380 Z" fill="#ffffff" stroke="#ffffff" stroke-width="16"/>
        <path d="M 200,370 C 130,330 65,255 65,170 C 65,90 145,45 200,45 C 255,45 335,90 335,170 C 335,255 270,330 200,370 Z" fill="url(#monsteraGrad)"/>
        <!-- Monstera slits / fenestrations -->
        <g fill="#ffffff">
          <ellipse cx="140" cy="140" rx="12" ry="32" transform="rotate(-35 140 140)"/>
          <ellipse cx="120" cy="210" rx="10" ry="30" transform="rotate(-55 120 210)"/>
          <ellipse cx="140" cy="275" rx="8" ry="24" transform="rotate(-65 140 275)"/>
          <ellipse cx="260" cy="140" rx="12" ry="32" transform="rotate(35 260 140)"/>
          <ellipse cx="280" cy="210" rx="10" ry="30" transform="rotate(55 280 210)"/>
          <ellipse cx="260" cy="275" rx="8" ry="24" transform="rotate(65 260 275)"/>
        </g>
        <line x1="200" y1="370" x2="200" y2="45" stroke="#15803D" stroke-width="4"/>
      </g>
    </svg>
  `, 'botanical-monstera-leaf', 400, 400);

  // ═════════════════════════════════════════════════════════════════════════
  // 3. CELEBRATION, TOAST & NIGHTLIFE
  // ═════════════════════════════════════════════════════════════════════════

  // Champagne Popping Cork with Explosive Foam Stream
  await renderSvgToPng(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="bottleGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064E3B" />
          <stop offset="50%" stop-color="#022C22" />
          <stop offset="100%" stop-color="#064E3B" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-15 200 200)">
        <path d="M 120,380 L 200,380 L 200,240 C 200,210 175,180 175,140 L 175,110 L 145,110 L 145,140 C 145,180 120,210 120,240 Z" fill="#ffffff" stroke="#ffffff" stroke-width="16" stroke-linejoin="round"/>
        <path d="M 120,380 L 200,380 L 200,240 C 200,210 175,180 175,140 L 175,110 L 145,110 L 145,140 C 145,180 120,210 120,240 Z" fill="url(#bottleGreen)"/>
        <rect x="145" y="110" width="30" height="40" fill="#F59E0B"/>
        <rect x="125" y="240" width="70" height="90" rx="4" fill="#FAF5EE" stroke="#B99A62" stroke-width="2"/>
        <text x="160" y="275" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="12" fill="#112327" text-anchor="middle">CUVÉE</text>
        <text x="160" y="295" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="16" fill="#B99A62" text-anchor="middle">BRUT</text>
        <rect x="175" y="20" width="22" height="28" rx="4" fill="#D97706" stroke="#ffffff" stroke-width="4" transform="rotate(25 186 34)"/>
        <g fill="#ffffff">
          <ellipse cx="160" cy="85" rx="35" ry="20" fill="#ffffff"/>
          <circle cx="140" cy="60" r="18" fill="#ffffff"/>
          <circle cx="180" cy="55" r="22" fill="#ffffff"/>
          <circle cx="210" cy="40" r="14" fill="#ffffff"/>
          <circle cx="120" cy="45" r="12" fill="#ffffff"/>
          <circle cx="155" cy="30" r="16" fill="#ffffff"/>
          <circle cx="230" cy="20" r="9" fill="#ffffff"/>
          <circle cx="100" cy="30" r="8" fill="#ffffff"/>
          <text x="210" y="80" font-size="20">✨</text>
          <text x="90" y="60" font-size="18">✨</text>
          <text x="140" y="15" font-size="16">⭐</text>
        </g>
      </g>
    </svg>
  `, 'party-champagne-pop', 400, 400);

  // Clinking Crystal Champagne Flutes
  await renderSvgToPng(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="champGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A" />
          <stop offset="100%" stop-color="#F59E0B" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)">
        <!-- Left Flute -->
        <g transform="rotate(-15 150 250)">
          <!-- White die-cut outline -->
          <path d="M 120,80 C 120,180 145,210 145,210 L 145,330 L 120,350 L 170,350 L 145,330 L 145,210 C 145,210 170,180 170,80 Z" fill="#ffffff" stroke="#ffffff" stroke-width="14" stroke-linejoin="round"/>
          <path d="M 125,85 C 125,180 145,205 145,205 C 145,205 165,180 165,85 Z" fill="url(#champGrad2)"/>
          <line x1="145" y1="205" x2="145" y2="335" stroke="#94A3B8" stroke-width="5"/>
          <line x1="125" y1="345" x2="165" y2="345" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        </g>
        <!-- Right Flute -->
        <g transform="rotate(15 250 250)">
          <path d="M 220,80 C 220,180 245,210 245,210 L 245,330 L 220,350 L 270,350 L 245,330 L 245,210 C 245,210 270,180 270,80 Z" fill="#ffffff" stroke="#ffffff" stroke-width="14" stroke-linejoin="round"/>
          <path d="M 225,85 C 225,180 245,205 245,205 C 245,205 265,180 265,85 Z" fill="url(#champGrad2)"/>
          <line x1="245" y1="205" x2="245" y2="335" stroke="#94A3B8" stroke-width="5"/>
          <line x1="225" y1="345" x2="265" y2="345" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        </g>
        <!-- Sparkle clink at center -->
        <circle cx="200" cy="110" r="16" fill="#ffffff" stroke="#FEF08A" stroke-width="4"/>
        <text x="200" y="80" font-size="28" text-anchor="middle">✨</text>
        <text x="200" y="385" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="16" fill="#B45309" letter-spacing="4" text-anchor="middle">CHEERS! 🥂</text>
      </g>
    </svg>
  `, 'party-crystal-flutes', 400, 400);

  // Disco Mirror Ball with Lens Flares
  await renderSvgToPng(`
    <svg width="380" height="380" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
        <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="30%" stop-color="#E2E8F0" />
          <stop offset="70%" stop-color="#94A3B8" />
          <stop offset="100%" stop-color="#475569" />
        </radialGradient>
      </defs>
      <g filter="url(#drop)">
        <circle cx="190" cy="190" r="165" fill="#ffffff" />
        <circle cx="190" cy="190" r="150" fill="url(#sphereGrad)" />
        <g stroke="#ffffff" stroke-width="1.5" opacity="0.6">
          <ellipse cx="190" cy="190" rx="150" ry="30" fill="none"/>
          <ellipse cx="190" cy="190" rx="150" ry="70" fill="none"/>
          <ellipse cx="190" cy="190" rx="150" ry="110" fill="none"/>
          <line x1="190" y1="40" x2="190" y2="340" />
          <line x1="130" y1="52" x2="130" y2="328" />
          <line x1="250" y1="52" x2="250" y2="328" />
          <line x1="80" y1="90" x2="80" y2="290" />
          <line x1="300" y1="90" x2="300" y2="290" />
        </g>
        <line x1="190" y1="0" x2="190" y2="40" stroke="#94A3B8" stroke-width="3"/>
        <polygon points="120,110 135,120 120,130 105,120" fill="#ffffff"/>
        <polygon points="260,150 272,160 260,170 248,160" fill="#ffffff"/>
        <polygon points="180,240 190,250 180,260 170,250" fill="#ffffff"/>
        <text x="210" y="100" font-size="28">✨</text>
        <text x="60" y="210" font-size="24">✨</text>
        <text x="270" y="260" font-size="24">🪩</text>
      </g>
    </svg>
  `, 'party-disco-ball', 380, 380);

  // Golden Sparkler Wand
  await renderSvgToPng(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(-30 200 200)">
        <line x1="200" y1="380" x2="200" y2="120" stroke="#ffffff" stroke-width="18" stroke-linecap="round"/>
        <line x1="200" y1="380" x2="200" y2="120" stroke="#71717A" stroke-width="8" stroke-linecap="round"/>
        <!-- Burning sparkler sparks -->
        <circle cx="200" cy="120" r="30" fill="#ffffff"/>
        <circle cx="200" cy="120" r="22" fill="#FEF08A"/>
        <g stroke="#F59E0B" stroke-width="4" stroke-linecap="round">
          <line x1="200" y1="120" x2="200" y2="40" stroke-width="6" stroke="#ffffff"/>
          <line x1="200" y1="120" x2="140" y2="60"/>
          <line x1="200" y1="120" x2="260" y2="60"/>
          <line x1="200" y1="120" x2="120" y2="120"/>
          <line x1="200" y1="120" x2="280" y2="120"/>
          <line x1="200" y1="120" x2="140" y2="180"/>
          <line x1="200" y1="120" x2="260" y2="180"/>
        </g>
        <circle cx="130" cy="50" r="4" fill="#ffffff"/>
        <circle cx="270" cy="50" r="5" fill="#FEF08A"/>
        <circle cx="100" cy="120" r="4" fill="#FEF08A"/>
        <circle cx="300" cy="120" r="4" fill="#ffffff"/>
      </g>
    </svg>
  `, 'party-sparkler-wand', 400, 400);

  // Multi-tier Floral Wedding Cake Cutout
  await renderSvgToPng(`
    <svg width="400" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
        <linearGradient id="cakeCream" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="50%" stop-color="#FAF5EE" />
          <stop offset="100%" stop-color="#F1E7D8" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)">
        <!-- Pedestal -->
        <ellipse cx="200" cy="385" rx="140" ry="15" fill="#ffffff" stroke="#E2D4C0" stroke-width="4"/>
        <path d="M 180,385 L 220,385 L 210,350 L 190,350 Z" fill="#D5C0A7"/>
        <!-- Bottom Tier -->
        <rect x="90" y="270" width="220" height="85" rx="8" fill="#ffffff" stroke="#ffffff" stroke-width="12"/>
        <rect x="90" y="270" width="220" height="85" rx="8" fill="url(#cakeCream)"/>
        <line x1="90" y1="350" x2="310" y2="350" stroke="#B99A62" stroke-width="4"/>
        <!-- Middle Tier -->
        <rect x="125" y="190" width="150" height="80" rx="6" fill="#ffffff" stroke="#ffffff" stroke-width="12"/>
        <rect x="125" y="190" width="150" height="80" rx="6" fill="url(#cakeCream)"/>
        <line x1="125" y1="265" x2="275" y2="265" stroke="#B99A62" stroke-width="4"/>
        <!-- Top Tier -->
        <rect x="155" y="120" width="90" height="70" rx="5" fill="#ffffff" stroke="#ffffff" stroke-width="12"/>
        <rect x="155" y="120" width="90" height="70" rx="5" fill="url(#cakeCream)"/>
        <line x1="155" y1="185" x2="245" y2="185" stroke="#B99A62" stroke-width="4"/>
        <!-- Cake Topper -->
        <text x="200" y="105" font-size="28" text-anchor="middle">👑</text>
        <!-- Rose cascading down -->
        <circle cx="160" cy="185" r="14" fill="#FDA4AF" stroke="#fff" stroke-width="2"/>
        <circle cx="130" cy="265" r="16" fill="#FB7185" stroke="#fff" stroke-width="2"/>
        <circle cx="100" cy="345" r="18" fill="#E11D48" stroke="#fff" stroke-width="2"/>
      </g>
    </svg>
  `, 'party-wedding-cake', 400, 420);

  // Mylar Gold Star Foil Balloon
  await renderSvgToPng(`
    <svg width="380" height="380" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
        <radialGradient id="foilGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFFBEB" />
          <stop offset="30%" stop-color="#FDE68A" />
          <stop offset="70%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#B45309" />
        </radialGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-6 190 190)">
        <polygon points="190,20 235,130 355,140 265,220 295,340 190,275 85,340 115,220 25,140 145,130" 
                 fill="#ffffff" stroke="#ffffff" stroke-width="16" stroke-linejoin="round"/>
        <polygon points="190,20 235,130 355,140 265,220 295,340 190,275 85,340 115,220 25,140 145,130" 
                 fill="url(#foilGrad)"/>
        <polygon points="190,45 225,135 320,145 250,210 270,305 190,255 110,305 130,210 60,145 155,135" 
                 fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="4"/>
        <polygon points="160,100 170,120 190,125 175,140 180,160 160,150 140,160 145,140 130,125 150,120" fill="#ffffff" opacity="0.8"/>
      </g>
    </svg>
  `, 'party-gold-balloon-star', 380, 380);

  // ═════════════════════════════════════════════════════════════════════════
  // 4. BADGES, TICKET STUBS & SLOGANS
  // ═════════════════════════════════════════════════════════════════════════

  // Save The Date Ticket Stub
  await renderSvgToPng(`
    <svg width="480" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="ticketGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FAF5EE" />
          <stop offset="100%" stop-color="#EEDCC5" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-3 240 120)">
        <rect x="14" y="24" width="452" height="192" rx="20" fill="#ffffff" />
        <rect x="20" y="30" width="440" height="180" rx="16" fill="url(#ticketGold)" stroke="#B99A62" stroke-width="2"/>
        <circle cx="320" cy="30" r="16" fill="#ffffff" />
        <circle cx="320" cy="210" r="16" fill="#ffffff" />
        <line x1="320" y1="52" x2="320" y2="188" stroke="#B99A62" stroke-width="2" stroke-dasharray="6,6" />
        <text x="45" y="70" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="28" fill="#112327" letter-spacing="4">SAVE THE DATE</text>
        <text x="45" y="100" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#8C7040" letter-spacing="3">BOARDING PASS • VIP ACCESS</text>
        <text x="45" y="140" font-family="'Cinzel', Georgia, serif" font-size="18" font-weight="700" fill="#112327">SATURDAY • THE WEDDING OF THE YEAR</text>
        <g transform="translate(45, 155)">
          <rect x="0" y="0" width="3" height="35" fill="#112327"/>
          <rect x="6" y="0" width="6" height="35" fill="#112327"/>
          <rect x="16" y="0" width="2" height="35" fill="#112327"/>
          <rect x="22" y="0" width="8" height="35" fill="#112327"/>
          <rect x="34" y="0" width="4" height="35" fill="#112327"/>
          <rect x="42" y="0" width="3" height="35" fill="#112327"/>
          <rect x="49" y="0" width="7" height="35" fill="#112327"/>
          <rect x="60" y="0" width="2" height="35" fill="#112327"/>
          <rect x="66" y="0" width="5" height="35" fill="#112327"/>
          <rect x="75" y="0" width="8" height="35" fill="#112327"/>
          <rect x="87" y="0" width="3" height="35" fill="#112327"/>
          <rect x="94" y="0" width="6" height="35" fill="#112327"/>
          <rect x="104" y="0" width="4" height="35" fill="#112327"/>
          <rect x="112" y="0" width="8" height="35" fill="#112327"/>
          <rect x="124" y="0" width="2" height="35" fill="#112327"/>
          <rect x="130" y="0" width="6" height="35" fill="#112327"/>
          <rect x="140" y="0" width="3" height="35" fill="#112327"/>
          <text x="160" y="24" font-family="'Courier New', monospace" font-size="14" font-weight="bold" fill="#112327">№ 0824-2026</text>
        </g>
        <text x="390" y="70" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#B99A62" text-anchor="middle">ADMIT ONE</text>
        <text x="390" y="115" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="36" fill="#112327" text-anchor="middle">VIP</text>
        <text x="390" y="160" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#8C7040" text-anchor="middle">GATE OPEN</text>
        <text x="390" y="180" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#16A34A" text-anchor="middle">★ CONFIRMED ★</text>
      </g>
    </svg>
  `, 'badge-save-the-date', 480, 240);

  // VIP Access Wristband
  await renderSvgToPng(`
    <svg width="450" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
        <linearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF6B95" />
          <stop offset="35%" stop-color="#FFD166" />
          <stop offset="70%" stop-color="#06D6A0" />
          <stop offset="100%" stop-color="#118AB2" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(2 225 100)">
        <rect x="15" y="25" width="420" height="150" rx="30" fill="#ffffff" />
        <rect x="22" y="32" width="406" height="136" rx="24" fill="url(#holo)" stroke="#ffffff" stroke-width="2"/>
        <rect x="35" y="45" width="380" height="110" rx="18" fill="#112327" />
        <text x="225" y="85" font-family="Impact, Arial Black, sans-serif" font-size="32" fill="#FFD166" letter-spacing="3" text-anchor="middle">★ VIP ALL ACCESS ★</text>
        <text x="225" y="125" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#ffffff" letter-spacing="3" text-anchor="middle">NO WAITING • TABLE RESERVED</text>
        <circle cx="65" cy="100" r="14" fill="#06D6A0" stroke="#fff" stroke-width="3" />
        <circle cx="385" cy="100" r="14" fill="#FF6B95" stroke="#fff" stroke-width="3" />
      </g>
    </svg>
  `, 'badge-vip-access', 450, 200);

  // Calligraphic Ribbon: You're Cordially Invited
  await renderSvgToPng(`
    <svg width="460" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="invGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#112327" />
          <stop offset="100%" stop-color="#1E3A40" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-2 230 100)">
        <polygon points="20,100 45,40 415,40 440,100 415,160 45,160" fill="#ffffff" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
        <polygon points="20,100 45,40 415,40 440,100 415,160 45,160" fill="url(#invGold)" stroke="#B99A62" stroke-width="3"/>
        <text x="230" y="85" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="15" fill="#B99A62" letter-spacing="6" text-anchor="middle">YOU ARE CORDIALLY</text>
        <text x="230" y="130" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="34" fill="#FCE0AD" letter-spacing="4" text-anchor="middle">INVITED</text>
        <text x="80" y="105" font-size="18">✨</text>
        <text x="380" y="105" font-size="18">✨</text>
      </g>
    </svg>
  `, 'badge-youre-invited', 460, 200);

  // Best Day Ever Arch Badge
  await renderSvgToPng(`
    <svg width="360" height="360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
        <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F43F5E" />
          <stop offset="50%" stop-color="#FB923C" />
          <stop offset="100%" stop-color="#FBBF24" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(3 180 180)">
        <!-- Arch shape with white die-cut border -->
        <path d="M 50,320 L 50,170 C 50,80 108,30 180,30 C 252,30 310,80 310,170 L 310,320 Z" fill="#ffffff" stroke="#ffffff" stroke-width="14" stroke-linejoin="round"/>
        <path d="M 55,315 L 55,170 C 55,85 110,40 180,40 C 250,40 305,85 305,170 L 305,315 Z" fill="url(#sunsetGrad)"/>
        <text x="180" y="120" font-size="36" text-anchor="middle">☀️</text>
        <text x="180" y="175" font-family="Impact, Arial Black, sans-serif" font-size="40" fill="#ffffff" letter-spacing="3" text-anchor="middle">BEST</text>
        <text x="180" y="220" font-family="Impact, Arial Black, sans-serif" font-size="40" fill="#ffffff" letter-spacing="3" text-anchor="middle">DAY</text>
        <text x="180" y="265" font-family="Impact, Arial Black, sans-serif" font-size="40" fill="#112327" letter-spacing="3" text-anchor="middle">EVER</text>
        <text x="180" y="300" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#ffffff" letter-spacing="4" text-anchor="middle">★ CELEBRATE ★</text>
      </g>
    </svg>
  `, 'badge-best-day-ever', 360, 360);

  // It's Giving Luxury
  await renderSvgToPng(`
    <svg width="400" height="260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
        <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFDFD6" />
          <stop offset="50%" stop-color="#FFEAD2" />
          <stop offset="100%" stop-color="#E8D5F5" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-4 200 130)">
        <rect x="15" y="35" width="370" height="190" rx="95" fill="#ffffff" />
        <rect x="23" y="43" width="354" height="174" rx="87" fill="url(#pillGrad)" stroke="#E07A5F" stroke-width="4"/>
        <text x="200" y="105" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="28" fill="#112327" text-anchor="middle">✨ it's giving ✨</text>
        <text x="200" y="165" font-family="Impact, Arial Black, sans-serif" font-size="46" fill="#81171B" letter-spacing="3" text-anchor="middle">LUXURY</text>
        <text x="75" y="160" font-size="24">💎</text>
        <text x="325" y="160" font-size="24">🥂</text>
      </g>
    </svg>
  `, 'badge-its-giving-luxury', 400, 260);

  // Dress To Impress
  await renderSvgToPng(`
    <svg width="340" height="340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(-3 170 170)">
        <polygon points="170,10 320,170 170,330 20,170" fill="#ffffff"/>
        <polygon points="170,22 308,170 170,318 32,170" fill="#09090B" stroke="#B99A62" stroke-width="3"/>
        <text x="170" y="115" font-family="'Cinzel', Georgia, serif" font-size="16" font-weight="bold" fill="#B99A62" letter-spacing="4" text-anchor="middle">DRESS CODE</text>
        <text x="170" y="160" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="3" text-anchor="middle">BLACK</text>
        <text x="170" y="195" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="3" text-anchor="middle">TIE</text>
        <text x="170" y="240" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#B99A62" letter-spacing="3" text-anchor="middle">DRESS TO IMPRESS</text>
        <line x1="80" y1="210" x2="260" y2="210" stroke="#B99A62" stroke-width="1"/>
      </g>
    </svg>
  `, 'badge-dress-to-impress', 340, 340);

  // Champagne Showers
  await renderSvgToPng(`
    <svg width="420" height="280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="champGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E1B4B" />
          <stop offset="100%" stop-color="#312E81" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-2 210 140)">
        <rect x="15" y="25" width="390" height="230" rx="35" fill="#ffffff" />
        <rect x="23" y="33" width="374" height="214" rx="27" fill="url(#champGrad)" stroke="#F59E0B" stroke-width="3"/>
        <circle cx="70" cy="80" r="10" fill="#FCD34D" opacity="0.6"/>
        <circle cx="110" cy="55" r="6" fill="#FCD34D" opacity="0.4"/>
        <circle cx="340" cy="70" r="14" fill="#FCD34D" opacity="0.5"/>
        <circle cx="365" cy="110" r="8" fill="#FCD34D" opacity="0.7"/>
        <text x="210" y="100" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="22" fill="#FCD34D" letter-spacing="4" text-anchor="middle">POUR THE BUBBLY 🥂</text>
        <text x="210" y="155" font-family="Impact, Arial Black, sans-serif" font-size="44" fill="#ffffff" letter-spacing="3" text-anchor="middle">CHAMPAGNE</text>
        <text x="210" y="195" font-family="Impact, Arial Black, sans-serif" font-size="38" fill="#F59E0B" letter-spacing="4" text-anchor="middle">SHOWERS</text>
        <text x="210" y="228" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#E0E7FF" letter-spacing="3" text-anchor="middle">SIP • DANCE • CELEBRATE</text>
      </g>
    </svg>
  `, 'badge-champagne-showers', 420, 280);

  // Mr & Mrs Die-Cut Ribbon
  await renderSvgToPng(`
    <svg width="440" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="mrsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#112327" />
          <stop offset="100%" stop-color="#022C22" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-3 220 120)">
        <rect x="20" y="30" width="400" height="180" rx="30" fill="#ffffff" stroke="#ffffff" stroke-width="8"/>
        <rect x="26" y="36" width="388" height="168" rx="24" fill="url(#mrsGrad)" stroke="#B99A62" stroke-width="3"/>
        <text x="220" y="85" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="14" fill="#B99A62" letter-spacing="5" text-anchor="middle">JUST MARRIED</text>
        <text x="220" y="145" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="46" fill="#FCE0AD" letter-spacing="4" text-anchor="middle">MR &amp; MRS</text>
        <text x="220" y="180" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#ffffff" letter-spacing="4" text-anchor="middle">FOREVER &amp; ALWAYS ♡</text>
      </g>
    </svg>
  `, 'badge-mr-and-mrs', 440, 240);

  // ═════════════════════════════════════════════════════════════════════════
  // 5. CULTURAL & HERITAGE CELEBRATIONS
  // ═════════════════════════════════════════════════════════════════════════

  // HARUSI TUNAYO!
  await renderSvgToPng(`
    <svg width="450" height="280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
        <linearGradient id="kangaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C2410C" />
          <stop offset="50%" stop-color="#EA580C" />
          <stop offset="100%" stop-color="#CA8A04" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-2 225 140)">
        <rect x="15" y="25" width="420" height="230" rx="35" fill="#ffffff" />
        <rect x="23" y="33" width="404" height="214" rx="27" fill="url(#kangaGrad)" stroke="#FEF08A" stroke-width="4"/>
        <rect x="33" y="43" width="384" height="194" rx="20" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="8,6"/>
        <text x="225" y="85" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="18" fill="#FEF08A" letter-spacing="4" text-anchor="middle">🎉 HONGERA SANA! 🎉</text>
        <text x="225" y="145" font-family="Impact, Arial Black, sans-serif" font-size="52" fill="#ffffff" letter-spacing="3" text-anchor="middle" stroke="#7C2D12" stroke-width="3">HARUSI TUNAYO!</text>
        <text x="225" y="195" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#FEF08A" letter-spacing="3" text-anchor="middle">HATUNA? TUNAYO SANA!</text>
        <text x="225" y="225" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#ffffff" letter-spacing="2" text-anchor="middle">🥁 ULULATIONS • DANCING • FEASTING 🥁</text>
      </g>
    </svg>
  `, 'cultural-harusi-tunayo', 450, 280);

  // RURACIO VIBES
  await renderSvgToPng(`
    <svg width="420" height="320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
        <linearGradient id="ochreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7C2D12" />
          <stop offset="100%" stop-color="#451A03" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(3 210 160)">
        <rect x="15" y="25" width="390" height="270" rx="40" fill="#ffffff" />
        <rect x="23" y="33" width="374" height="254" rx="32" fill="url(#ochreGrad)" stroke="#F59E0B" stroke-width="4"/>
        <circle cx="50" cy="55" r="6" fill="#DC2626"/><circle cx="70" cy="55" r="6" fill="#F59E0B"/><circle cx="90" cy="55" r="6" fill="#16A34A"/><circle cx="110" cy="55" r="6" fill="#ffffff"/>
        <circle cx="310" cy="55" r="6" fill="#ffffff"/><circle cx="330" cy="55" r="6" fill="#16A34A"/><circle cx="350" cy="55" r="6" fill="#F59E0B"/><circle cx="370" cy="55" r="6" fill="#DC2626"/>
        <text x="210" y="85" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="16" fill="#FDE68A" letter-spacing="4" text-anchor="middle">TRADITIONAL DOWRY</text>
        <text x="210" y="145" font-family="Impact, Arial Black, sans-serif" font-size="48" fill="#F59E0B" letter-spacing="4" text-anchor="middle">RURACIO</text>
        <text x="210" y="195" font-family="Impact, Arial Black, sans-serif" font-size="44" fill="#ffffff" letter-spacing="4" text-anchor="middle">VIBES 🌿</text>
        <text x="210" y="240" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#FDE68A" letter-spacing="3" text-anchor="middle">MUTHETHU • NJOHI • UHONI</text>
        <text x="210" y="265" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#ffffff" letter-spacing="2" text-anchor="middle">TWO FAMILIES BECOME ONE</text>
      </g>
    </svg>
  `, 'cultural-ruracio-vibes', 420, 320);

  // SHEREHE HAITAKI HASIRA
  await renderSvgToPng(`
    <svg width="450" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
        <linearGradient id="partyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#047857" />
          <stop offset="100%" stop-color="#0F766E" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-3 225 120)">
        <rect x="15" y="25" width="420" height="190" rx="35" fill="#ffffff"/>
        <rect x="23" y="33" width="404" height="174" rx="27" fill="url(#partyGrad)" stroke="#34D399" stroke-width="4"/>
        <text x="225" y="90" font-family="Impact, Arial Black, sans-serif" font-size="38" fill="#FDE047" letter-spacing="2" text-anchor="middle">SHEREHE HAITAKI</text>
        <text x="225" y="145" font-family="Impact, Arial Black, sans-serif" font-size="52" fill="#ffffff" letter-spacing="4" text-anchor="middle">HASIRA! 💃🔥</text>
        <text x="225" y="185" font-family="Arial, sans-serif" font-weight="900" font-size="15" fill="#A7F3D0" letter-spacing="3" text-anchor="middle">TUKO SHANGWE • FULL ENERGY</text>
      </g>
    </svg>
  `, 'cultural-sherehe-haitaki', 450, 240);

  // KUMEPAMBANA!
  await renderSvgToPng(`
    <svg width="360" height="360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(4 180 180)">
        <circle cx="180" cy="180" r="165" fill="#ffffff"/>
        <circle cx="180" cy="180" r="155" fill="#B91C1C" stroke="#FEF08A" stroke-width="6"/>
        <text x="180" y="105" font-family="Arial Black, Impact, sans-serif" font-size="28" fill="#FEF08A" letter-spacing="3" text-anchor="middle">🔥🔥🔥</text>
        <text x="180" y="165" font-family="Impact, Arial Black, sans-serif" font-size="38" fill="#ffffff" letter-spacing="2" text-anchor="middle">KUMEPAMBANA!</text>
        <rect x="45" y="200" width="270" height="50" rx="25" fill="#7F1D1D" stroke="#ffffff" stroke-width="3"/>
        <text x="180" y="233" font-family="Arial, sans-serif" font-weight="900" font-size="17" fill="#FEF08A" letter-spacing="2" text-anchor="middle">VIBES ARE HIGH</text>
        <text x="180" y="285" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#ffffff" letter-spacing="2" text-anchor="middle">HAKUNA KULALA 🕺</text>
      </g>
    </svg>
  `, 'cultural-kumepambana', 360, 360);

  // KARIBU SANA
  await renderSvgToPng(`
    <svg width="340" height="340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="warmGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#112327" />
          <stop offset="100%" stop-color="#1C383E" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-2 170 170)">
        <circle cx="170" cy="170" r="155" fill="#ffffff"/>
        <circle cx="170" cy="170" r="145" fill="url(#warmGold)" stroke="#B99A62" stroke-width="5"/>
        <circle cx="170" cy="170" r="135" fill="none" stroke="#B99A62" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="170" y="110" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="16" fill="#B99A62" letter-spacing="6" text-anchor="middle">SWAHILI WELCOME</text>
        <text x="170" y="165" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="34" fill="#F5EBE1" letter-spacing="4" text-anchor="middle">KARIBU</text>
        <text x="170" y="210" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="34" fill="#B99A62" letter-spacing="4" text-anchor="middle">SANA</text>
        <text x="170" y="255" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#F5EBE1" letter-spacing="3" text-anchor="middle">YOU ARE WARMLY WELCOME</text>
      </g>
    </svg>
  `, 'cultural-karibu-sana', 340, 340);

  // CHAI & GOSSIP
  await renderSvgToPng(`
    <svg width="340" height="340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(3 170 170)">
        <rect x="20" y="20" width="300" height="300" rx="60" fill="#ffffff" />
        <rect x="28" y="28" width="284" height="284" rx="52" fill="#78350F" stroke="#FDE68A" stroke-width="4"/>
        <text x="170" y="115" font-size="64" text-anchor="middle">☕</text>
        <text x="170" y="175" font-family="Impact, Arial Black, sans-serif" font-size="34" fill="#FDE68A" letter-spacing="3" text-anchor="middle">CHAI &amp; GOSSIP</text>
        <rect x="60" y="205" width="220" height="42" rx="21" fill="#451A03" stroke="#fff" stroke-width="2"/>
        <text x="170" y="233" font-family="Arial, sans-serif" font-weight="900" font-size="14" fill="#ffffff" letter-spacing="2" text-anchor="middle">LETS SPILL THE TEA 🫖</text>
        <text x="170" y="280" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#FDE68A" text-anchor="middle">SPICED KENYAN CHAI</text>
      </g>
    </svg>
  `, 'cultural-chai-gossip', 340, 340);

  // TUKUTANE SHEREHE
  await renderSvgToPng(`
    <svg width="420" height="260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="tukutaneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4F46E5" />
          <stop offset="100%" stop-color="#7C3AED" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-3 210 130)">
        <rect x="15" y="25" width="390" height="210" rx="35" fill="#ffffff" />
        <rect x="23" y="33" width="374" height="194" rx="27" fill="url(#tukutaneGrad)" stroke="#A78BFA" stroke-width="3"/>
        <text x="210" y="90" font-family="'Cinzel', Georgia, serif" font-weight="bold" font-size="18" fill="#FDE047" letter-spacing="4" text-anchor="middle">SEE YOU AT THE TURN UP!</text>
        <text x="210" y="145" font-family="Impact, Arial Black, sans-serif" font-size="44" fill="#ffffff" letter-spacing="3" text-anchor="middle">TUKUTANE</text>
        <text x="210" y="195" font-family="Impact, Arial Black, sans-serif" font-size="48" fill="#FDE047" letter-spacing="4" text-anchor="middle">SHEREHE! 🎉</text>
      </g>
    </svg>
  `, 'cultural-tukutane-sherehe', 420, 260);

  // ASANTE SANA
  await renderSvgToPng(`
    <svg width="340" height="340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(2 170 170)">
        <circle cx="170" cy="170" r="155" fill="#ffffff" />
        <circle cx="170" cy="170" r="145" fill="#FDF2F8" stroke="#DB2777" stroke-width="4"/>
        <circle cx="170" cy="170" r="135" fill="none" stroke="#F472B6" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="170" y="110" font-size="34" text-anchor="middle">🌸</text>
        <text x="170" y="160" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="28" fill="#831843" letter-spacing="3" text-anchor="middle">ASANTE</text>
        <text x="170" y="200" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="28" fill="#DB2777" letter-spacing="3" text-anchor="middle">SANA</text>
        <text x="170" y="240" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#831843" letter-spacing="2" text-anchor="middle">WITH GRATITUDE &amp; LOVE</text>
      </g>
    </svg>
  `, 'cultural-asante-sana', 340, 340);

  // ═════════════════════════════════════════════════════════════════════════
  // 6. ROMANCE & MILESTONES
  // ═════════════════════════════════════════════════════════════════════════

  // Solitaire Diamond Ring Cutout
  await renderSvgToPng(`
    <svg width="360" height="380" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="40%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#B45309" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-6 180 190)">
        <!-- Ring Band with white outline -->
        <circle cx="180" cy="240" r="105" fill="none" stroke="#ffffff" stroke-width="36"/>
        <circle cx="180" cy="240" r="105" fill="none" stroke="url(#ringGold)" stroke-width="20"/>
        <!-- Prongs holding diamond -->
        <polygon points="140,110 180,60 220,110" fill="#ffffff" stroke="#ffffff" stroke-width="12"/>
        <!-- Diamond gem facets -->
        <polygon points="135,110 225,110 250,75 110,75" fill="#E0F2FE" stroke="#38BDF8" stroke-width="3"/>
        <polygon points="135,110 225,110 180,165" fill="#BAE6FD" stroke="#0284C7" stroke-width="3"/>
        <polygon points="110,75 250,75 180,40" fill="#F0F9FF" stroke="#38BDF8" stroke-width="3"/>
        <!-- Prism sparkles -->
        <polygon points="180,20 185,35 200,40 185,45 180,60 175,45 160,40 175,35" fill="#ffffff"/>
        <text x="245" y="65" font-size="28">✨</text>
        <text x="90" y="85" font-size="24">✨</text>
        <text x="180" y="360" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="14" fill="#B45309" letter-spacing="4" text-anchor="middle">DIAMOND FOREVER</text>
      </g>
    </svg>
  `, 'romance-solitaire-diamond', 360, 380);

  // Dual Interlocking Wedding Bands
  await renderSvgToPng(`
    <svg width="400" height="340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="band1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="50%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#B45309" />
        </linearGradient>
        <linearGradient id="band2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F1F5F9" />
          <stop offset="50%" stop-color="#CBD5E1" />
          <stop offset="100%" stop-color="#64748B" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)">
        <!-- Left Gold Ring -->
        <circle cx="155" cy="160" r="90" fill="none" stroke="#ffffff" stroke-width="36"/>
        <circle cx="155" cy="160" r="90" fill="none" stroke="url(#band1)" stroke-width="20"/>
        <!-- Right Platinum Ring interlocking -->
        <circle cx="245" cy="160" r="90" fill="none" stroke="#ffffff" stroke-width="36"/>
        <circle cx="245" cy="160" r="90" fill="none" stroke="url(#band2)" stroke-width="20"/>
        <!-- Front overlap -->
        <path d="M 180,105 A 90 90 0 0 1 200,160" stroke="url(#band1)" stroke-width="20" fill="none"/>
        <text x="200" y="295" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="16" fill="#112327" letter-spacing="4" text-anchor="middle">TWO SOULS • ONE LOVE</text>
        <text x="200" y="85" font-size="28" text-anchor="middle">✨</text>
      </g>
    </svg>
  `, 'romance-interlocking-rings', 400, 340);

  // Flying White Doves with Olive Sprig
  await renderSvgToPng(`
    <svg width="400" height="360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(-6 200 180)">
        <!-- White dove body with crisp sticker die-cut contour -->
        <path d="M 140,240 C 100,240 60,200 40,160 C 60,170 90,175 110,170 C 80,130 90,60 170,40 C 180,80 190,130 180,170 C 230,120 300,90 350,90 C 330,130 290,170 240,190 C 260,210 270,250 250,280 C 210,250 180,240 140,240 Z" fill="#ffffff" stroke="#ffffff" stroke-width="16" stroke-linejoin="round"/>
        <path d="M 140,240 C 100,240 60,200 40,160 C 60,170 90,175 110,170 C 80,130 90,60 170,40 C 180,80 190,130 180,170 C 230,120 300,90 350,90 C 330,130 290,170 240,190 C 260,210 270,250 250,280 C 210,250 180,240 140,240 Z" fill="#FAF5EE"/>
        <!-- Feather accents -->
        <path d="M 150,70 Q 170,120 160,160" stroke="#CBD5E1" stroke-width="3" fill="none"/>
        <path d="M 280,120 Q 250,155 220,180" stroke="#CBD5E1" stroke-width="3" fill="none"/>
        <!-- Golden olive sprig in beak -->
        <path d="M 345,90 Q 370,80 385,85" stroke="#B45309" stroke-width="3" fill="none"/>
        <ellipse cx="370" cy="80" rx="8" ry="4" transform="rotate(-30 370 80)" fill="#16A34A"/>
        <ellipse cx="380" cy="90" rx="8" ry="4" transform="rotate(20 380 90)" fill="#16A34A"/>
        <text x="200" y="325" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="15" fill="#047857" letter-spacing="4" text-anchor="middle">PEACE &amp; DEVOTION 🕊️</text>
      </g>
    </svg>
  `, 'romance-white-doves', 400, 360);

  // Antique Golden Key
  await renderSvgToPng(`
    <svg width="400" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.45)"/>
        </filter>
        <linearGradient id="keyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A" />
          <stop offset="40%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#B45309" />
        </linearGradient>
      </defs>
      <g filter="url(#drop)" transform="rotate(-5 200 120)">
        <g stroke="#ffffff" stroke-width="16" fill="none" stroke-linejoin="round" stroke-linecap="round">
          <circle cx="100" cy="120" r="45"/>
          <line x1="145" y1="120" x2="330" y2="120"/>
          <line x1="280" y1="120" x2="280" y2="155"/>
          <line x1="310" y1="120" x2="310" y2="165"/>
        </g>
        <g stroke="url(#keyGold)" stroke-width="10" fill="none" stroke-linejoin="round" stroke-linecap="round">
          <circle cx="100" cy="120" r="45"/>
          <circle cx="100" cy="120" r="28" fill="#ffffff" stroke="none"/>
          <circle cx="100" cy="120" r="24" fill="none" stroke="url(#keyGold)" stroke-width="4"/>
          <line x1="145" y1="120" x2="330" y2="120"/>
          <line x1="280" y1="120" x2="280" y2="155"/>
          <line x1="310" y1="120" x2="310" y2="165"/>
        </g>
        <text x="235" y="85" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="14" fill="#B45309" letter-spacing="4">KEY TO MY HEART</text>
      </g>
    </svg>
  `, 'romance-vintage-key', 400, 240);

  // Deckle-edge Sealed Love Letter
  await renderSvgToPng(`
    <svg width="400" height="340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <g filter="url(#drop)" transform="rotate(-3 200 170)">
        <rect x="30" y="40" width="340" height="240" rx="14" fill="#ffffff" stroke="#ffffff" stroke-width="8"/>
        <rect x="35" y="45" width="330" height="230" rx="10" fill="#FAF5EE" stroke="#E2D4C0" stroke-width="2"/>
        <!-- Envelope flap fold lines -->
        <polygon points="35,45 200,165 365,45" fill="#F4EAE0" stroke="#D5C0A7" stroke-width="2"/>
        <line x1="35" y1="275" x2="150" y2="160" stroke="#D5C0A7" stroke-width="2"/>
        <line x1="365" y1="275" x2="250" y2="160" stroke="#D5C0A7" stroke-width="2"/>
        <!-- Crimson wax heart seal at flap intersection -->
        <circle cx="200" cy="165" r="28" fill="#991B1B" stroke="#ffffff" stroke-width="4"/>
        <text x="200" y="174" font-size="22" fill="#ffffff" text-anchor="middle">♥</text>
        <text x="200" y="315" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="18" fill="#78350F" text-anchor="middle">With All My Love ♡</text>
      </g>
    </svg>
  `, 'romance-love-letter', 400, 340);

  console.log('=== ALL DECORATIVE STICKERS GENERATED SUCCESSFULLY! ===');
}

main();
