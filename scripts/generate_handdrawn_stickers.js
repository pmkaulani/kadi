const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const STICKERS_DIR = path.join(__dirname, '..', 'public', 'stickers');
if (!fs.existsSync(STICKERS_DIR)) {
  fs.mkdirSync(STICKERS_DIR, { recursive: true });
}

// Helper to wrap SVG in sharp and save as crisp PNG
async function renderSvgToPng(filename, svgString, width = 400, height = 400) {
  const destPath = path.join(STICKERS_DIR, filename);
  await sharp(Buffer.from(svgString))
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(destPath);
  console.log(`Generated: ${filename}`);
}

const fontCommon = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&amp;family=Playfair+Display:ital,wght@1,600&amp;family=Great+Vibes&amp;family=Sacramento&amp;display=swap');
      .hand-script { font-family: 'Great Vibes', 'Sacramento', 'Brush Script MT', cursive; }
      .hand-casual { font-family: 'Caveat', 'Comic Sans MS', cursive; }
      .serif-caps { font-family: 'Playfair Display', Georgia, serif; letter-spacing: 0.15em; font-weight: 700; }
    </style>
  </defs>
`;

async function main() {
  console.log('Starting handdrawn sticker suite generation...');

  // 1. wedding-day-wreath
  const wreathSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    ${fontCommon}
    <g transform="translate(250,250)">
      <!-- Leaf wreath circle -->
      <!-- Left branch -->
      <path d="M 0,-190 C -110,-190 -195,-105 -195,0 C -195,105 -110,190 0,190" fill="none" stroke="#2D2D2D" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Right branch -->
      <path d="M 0,-190 C 110,-190 195,-105 195,0 C 195,105 110,190 0,190" fill="none" stroke="#2D2D2D" stroke-width="4.5" stroke-linecap="round"/>
      
      <!-- Wreath Leaves - alternating sage green (#A3BE8C / #98B68E) and white outline -->
      ${generateWreathLeaves()}

      <!-- Top swirl ornament -->
      <path d="M -45,-95 C -25,-115 -10,-85 0,-105 C 10,-85 25,-115 45,-95" fill="none" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round"/>
      <circle cx="-45" cy="-95" r="3" fill="#2D2D2D" />
      <circle cx="45" cy="-95" r="3" fill="#2D2D2D" />

      <!-- Center Text: WEDDING DAY -->
      <text x="0" y="-20" text-anchor="middle" font-size="44" class="hand-casual" font-weight="700" fill="#2D2D2D" letter-spacing="3">WEDDING</text>
      
      <g transform="translate(0, 45)">
        <!-- Small flower left -->
        <path d="M -75,-15 C -82,-22 -90,-12 -82,-5 C -75,-15 -85,-18 -75,-15 Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2"/>
        <circle cx="-75" cy="-10" r="3" fill="#2D2D2D"/>
        <path d="M -90,-8 C -80,-10 -70,-8 -60,-10" fill="none" stroke="#2D2D2D" stroke-width="2"/>
        
        <text x="0" y="5" text-anchor="middle" font-size="52" class="hand-casual" font-weight="700" fill="#2D2D2D" letter-spacing="4">DAY</text>
        
        <!-- Small flower right -->
        <path d="M 75,-15 C 82,-22 90,-12 82,-5 C 75,-15 85,-18 75,-15 Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2"/>
        <circle cx="75" cy="-10" r="3" fill="#2D2D2D"/>
        <path d="M 60,-10 C 70,-8 80,-10 90,-8" fill="none" stroke="#2D2D2D" stroke-width="2"/>
      </g>

      <!-- Bottom flourish -->
      <path d="M -30,85 C -15,100 0,75 0,90 C 0,75 15,100 30,85" fill="none" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-wedding-day-wreath.png', wreathSvg, 500, 500);

  // 2. bride and groom illustration
  const brideGroomSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="500" height="650">
    ${fontCommon}
    <g transform="translate(250, 40)">
      <!-- GROOM (Standing behind & slightly right) -->
      <g transform="translate(20, 40)">
        <!-- Groom Hair -->
        <path d="M -10,35 C -15,15 15,5 30,20 C 35,28 32,45 25,50 C 20,40 10,40 -10,35 Z" fill="#5A3D28" stroke="#2D2D2D" stroke-width="3"/>
        <!-- Groom Face / Ear -->
        <path d="M 0,35 C 5,55 25,55 25,35" fill="#FADBC8" stroke="#2D2D2D" stroke-width="2.5"/>
        <path d="M 22,35 C 26,35 26,42 22,44" fill="#FADBC8" stroke="#2D2D2D" stroke-width="2"/>
        <!-- Facial features: eye, smile -->
        <circle cx="12" cy="36" r="2.5" fill="#2D2D2D"/>
        <path d="M 8,46 Q 14,50 18,46" fill="none" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
        <!-- Groom Collar & Tie -->
        <path d="M -5,55 L 30,55 L 25,75 L 0,75 Z" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="2"/>
        <polygon points="10,55 16,55 18,110 13,118 8,110" fill="#7FA07B" stroke="#2D2D2D" stroke-width="2.5"/>
        <!-- Groom Suit Jacket -->
        <path d="M -15,65 Q 12,60 38,65 L 45,210 L -10,210 Z" fill="#3D4035" stroke="#2D2D2D" stroke-width="3.5"/>
        <path d="M 38,65 L 60,180 L 45,190 L 35,85" fill="#3D4035" stroke="#2D2D2D" stroke-width="3"/>
      </g>

      <!-- BRIDE (Front Center) -->
      <g transform="translate(-15, 60)">
        <!-- Veil flowing behind -->
        <path d="M -25,20 C -60,60 -65,160 -50,220 C -35,170 -30,70 -15,30 Z" fill="#F4F8FB" opacity="0.75" stroke="#90A4AE" stroke-width="2" stroke-dasharray="4 3"/>
        
        <!-- Bride Updo / Bun Hair -->
        <ellipse cx="2" cy="18" rx="22" ry="18" fill="#C99355" stroke="#2D2D2D" stroke-width="3"/>
        <circle cx="2" cy="0" r="14" fill="#C99355" stroke="#2D2D2D" stroke-width="2.5"/>
        <!-- Tiara / Headband -->
        <path d="M -10,10 Q 2,2 14,10" fill="none" stroke="#D4AF37" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="2" cy="4" r="3" fill="#FFF" stroke="#D4AF37" stroke-width="1.5"/>
        
        <!-- Face & Shoulders -->
        <path d="M -10,18 C -15,42 18,42 14,18" fill="#FCE1D4" stroke="#2D2D2D" stroke-width="2.5"/>
        <!-- Closed smiling eyes / eyelashes -->
        <path d="M -4,26 Q -1,29 2,26" fill="none" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
        <path d="M 6,26 Q 9,29 12,26" fill="none" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
        <!-- Blush -->
        <circle cx="-3" cy="31" r="3.5" fill="#F4ACB7" opacity="0.6"/>
        <circle cx="11" cy="31" r="3.5" fill="#F4ACB7" opacity="0.6"/>
        <!-- Soft smile -->
        <path d="M 1,35 Q 4,38 7,35" fill="none" stroke="#D9534F" stroke-width="2" stroke-linecap="round"/>

        <!-- Bare Shoulders & Sweetheart Neckline -->
        <path d="M -20,48 C -12,46 -4,52 2,52 C 8,52 16,46 24,48 L 26,72 C 14,75 8,76 2,75 C -4,76 -10,75 -22,72 Z" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="3"/>
        <path d="M -20,48 C -26,48 -35,58 -32,75 L -20,72" fill="#FCE1D4" stroke="#2D2D2D" stroke-width="2.5"/>
        
        <!-- Flowing White Wedding Ballgown Skirt -->
        <path d="M -22,72 C -30,120 -85,280 -120,440 C -40,460 60,460 140,440 C 105,280 50,120 26,72 Z" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="4"/>
        
        <!-- Skirt Pleats / Drapes (Hand-drawn charcoal lines) -->
        <path d="M -15,80 C -35,180 -70,320 -85,435" fill="none" stroke="#2D2D2D" stroke-width="2.5"/>
        <path d="M -5,82 C -15,190 -25,330 -30,442" fill="none" stroke="#2D2D2D" stroke-width="2"/>
        <path d="M 8,82 C 18,190 28,330 35,442" fill="none" stroke="#2D2D2D" stroke-width="2"/>
        <path d="M 20,80 C 40,180 75,320 90,435" fill="none" stroke="#2D2D2D" stroke-width="2.5"/>

        <!-- Bridal Floral Bouquet held at waist -->
        <g transform="translate(-18, 70)">
          <!-- Foliage leaves -->
          <path d="M -10,5 Q -25,-5 -15,-15 Q 0,-5 -10,5 Z" fill="#8FA988" stroke="#2D2D2D" stroke-width="2"/>
          <path d="M 25,5 Q 40,-5 30,-15 Q 15,-5 25,5 Z" fill="#8FA988" stroke="#2D2D2D" stroke-width="2"/>
          <!-- Pastel pink roses -->
          <circle cx="0" cy="-5" r="9" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2"/>
          <circle cx="12" cy="-10" r="10" fill="#F7CAD0" stroke="#2D2D2D" stroke-width="2"/>
          <circle cx="22" cy="-2" r="8" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2"/>
          <circle cx="10" cy="5" r="8" fill="#FFE5EC" stroke="#2D2D2D" stroke-width="2"/>
          <!-- Trailing ribbon -->
          <path d="M 10,12 C 5,25 -5,35 -12,45" fill="none" stroke="#F4ACB7" stroke-width="3" stroke-linecap="round"/>
          <path d="M 12,12 C 18,25 25,35 22,48" fill="none" stroke="#F4ACB7" stroke-width="3" stroke-linecap="round"/>
        </g>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-bride-and-groom.png', brideGroomSvg, 500, 650);

  // 3. save-the-date script
  const saveDateSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 240" width="500" height="240">
    ${fontCommon}
    <g transform="translate(250, 110)">
      <!-- Main calligraphy text -->
      <text x="-65" y="0" text-anchor="middle" font-size="78" class="hand-script" fill="#2D2D2D">Save</text>
      <text x="3" y="-12" text-anchor="middle" font-size="22" class="serif-caps" fill="#2D2D2D">THE</text>
      <text x="75" y="0" text-anchor="middle" font-size="82" class="hand-script" fill="#2D2D2D">Date</text>

      <!-- Leafy branch accents flanking bottom -->
      <g transform="translate(-85, 45)">
        <path d="M 50,0 C 0,-5 -50,-10 -90,0" fill="none" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Berries / leaves -->
        <circle cx="-20" cy="-12" r="4.5" fill="#2D2D2D"/>
        <circle cx="-45" cy="1" r="4.5" fill="#2D2D2D"/>
        <circle cx="-70" cy="-10" r="4.5" fill="#2D2D2D"/>
        <circle cx="-32" cy="7" r="3.5" fill="#2D2D2D"/>
        <circle cx="-60" cy="9" r="3.5" fill="#2D2D2D"/>
      </g>
      <g transform="translate(85, 45) scale(-1, 1)">
        <path d="M 50,0 C 0,-5 -50,-10 -90,0" fill="none" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="-20" cy="-12" r="4.5" fill="#2D2D2D"/>
        <circle cx="-45" cy="1" r="4.5" fill="#2D2D2D"/>
        <circle cx="-70" cy="-10" r="4.5" fill="#2D2D2D"/>
        <circle cx="-32" cy="7" r="3.5" fill="#2D2D2D"/>
        <circle cx="-60" cy="9" r="3.5" fill="#2D2D2D"/>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-save-the-date.png', saveDateSvg, 500, 240);

  // 4. champagne-toast (bottle + 2 clinking flutes)
  const champagneSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" width="450" height="450">
    ${fontCommon}
    <g transform="translate(225, 230)">
      <!-- Champagne Bottle on the left -->
      <g transform="translate(-105, 10)">
        <!-- Cork -->
        <path d="M -10,-175 L 10,-175 L 8,-155 L -8,-155 Z" fill="#D4A373" stroke="#2D2D2D" stroke-width="3"/>
        <!-- Gold/Pink foil neck wrapper -->
        <path d="M -12,-155 L 12,-155 L 14,-100 L -14,-100 Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="3"/>
        <!-- Slender Bottle Body in Sage Green -->
        <path d="M -14,-100 C -15,-60 -45,-30 -45,30 L -45,140 C -45,152 -35,160 -20,160 L 20,160 C 35,160 45,152 45,140 L 45,30 C 45,-30 15,-60 14,-100 Z" fill="#A7C4A0" stroke="#2D2D2D" stroke-width="3.5"/>
        <!-- Soft White Label -->
        <rect x="-30" y="20" width="60" height="75" rx="5" fill="#FFFDF9" stroke="#2D2D2D" stroke-width="2.5"/>
        <!-- Label stripes & detail -->
        <line x1="-22" y1="42" x2="22" y2="42" stroke="#F4ACB7" stroke-width="3"/>
        <line x1="-22" y1="52" x2="22" y2="52" stroke="#F4ACB7" stroke-width="3"/>
        <line x1="-22" y1="62" x2="22" y2="62" stroke="#F4ACB7" stroke-width="3"/>
        <circle cx="0" cy="78" r="4" fill="#D4AF37"/>
      </g>

      <!-- Clinking Flutes on the right -->
      <g transform="translate(65, 0)">
        <!-- Flute 1 (Left tilted) -->
        <g transform="translate(-25, 10) rotate(-12)">
          <!-- Glass bowl -->
          <path d="M -15,-90 L 15,-90 C 15,-40 8,0 0,0 C -8,0 -15,-40 -15,-90 Z" fill="#F0F8FF" opacity="0.85" stroke="#2D2D2D" stroke-width="3"/>
          <!-- Bubbly Champagne liquid -->
          <path d="M -13,-65 L 13,-65 C 13,-35 7,-5 0,-5 C -7,-5 -13,-35 -13,-65 Z" fill="#FFEAA7" opacity="0.9"/>
          <!-- Stem -->
          <line x1="0" y1="0" x2="0" y2="100" stroke="#2D2D2D" stroke-width="3.5"/>
          <!-- Base -->
          <ellipse cx="0" cy="100" rx="22" ry="5" fill="#F0F8FF" stroke="#2D2D2D" stroke-width="3"/>
        </g>

        <!-- Flute 2 (Right tilted) -->
        <g transform="translate(25, 10) rotate(12)">
          <path d="M -15,-90 L 15,-90 C 15,-40 8,0 0,0 C -8,0 -15,-40 -15,-90 Z" fill="#F0F8FF" opacity="0.85" stroke="#2D2D2D" stroke-width="3"/>
          <path d="M -13,-65 L 13,-65 C 13,-35 7,-5 0,-5 C -7,-5 -13,-35 -13,-65 Z" fill="#FFEAA7" opacity="0.9"/>
          <line x1="0" y1="0" x2="0" y2="100" stroke="#2D2D2D" stroke-width="3.5"/>
          <ellipse cx="0" cy="100" rx="22" ry="5" fill="#F0F8FF" stroke="#2D2D2D" stroke-width="3"/>
        </g>

        <!-- Clink Bubbles / Fizz dots -->
        <circle cx="0" cy="-90" r="3.5" fill="#2D2D2D"/>
        <circle cx="-12" cy="-105" r="2.5" fill="#2D2D2D"/>
        <circle cx="10" cy="-110" r="2.5" fill="#2D2D2D"/>
        <circle cx="2" cy="-125" r="3" fill="#2D2D2D"/>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-champagne-toast.png', champagneSvg, 450, 450);

  // 5. wedding bells with ribbon bow
  const bellsSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350" width="400" height="350">
    <g transform="translate(200, 160)">
      <!-- Big ribbon bow on top -->
      <g transform="translate(0, -75)">
        <path d="M 0,0 C -25,-30 -60,-25 -55,5 C -50,25 -15,10 0,5 Z" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="3"/>
        <path d="M 0,0 C 25,-30 60,-25 55,5 C 50,25 15,10 0,5 Z" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="3"/>
        <circle cx="0" cy="5" r="8" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="3"/>
        <!-- Ribbon tails -->
        <path d="M -5,12 C -20,35 -35,50 -45,65" fill="none" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round"/>
        <path d="M 5,12 C 20,35 35,50 45,65" fill="none" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round"/>
      </g>

      <!-- Bell 1 (Left tilted) -->
      <g transform="translate(-40, 20) rotate(-15)">
        <path d="M -8,-60 C -12,-35 -35,-10 -40,30 C -42,42 42,42 40,30 C 35,-10 12,-35 8,-60 Z" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="3.5"/>
        <ellipse cx="0" cy="30" rx="40" ry="10" fill="#FFF8F0" stroke="#2D2D2D" stroke-width="3"/>
        <!-- Clapper inside bell with hatch marks -->
        <circle cx="0" cy="32" r="8" fill="#EAD7C3" stroke="#2D2D2D" stroke-width="2.5"/>
        <line x1="-15" y1="0" x2="-15" y2="20" stroke="#2D2D2D" stroke-width="2"/>
        <line x1="-5" y1="-5" x2="-5" y2="20" stroke="#2D2D2D" stroke-width="2"/>
        <line x1="5" y1="-5" x2="5" y2="20" stroke="#2D2D2D" stroke-width="2"/>
        <line x1="15" y1="0" x2="15" y2="20" stroke="#2D2D2D" stroke-width="2"/>
      </g>

      <!-- Bell 2 (Right tilted) -->
      <g transform="translate(40, 20) rotate(15)">
        <path d="M -8,-60 C -12,-35 -35,-10 -40,30 C -42,42 42,42 40,30 C 35,-10 12,-35 8,-60 Z" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="3.5"/>
        <ellipse cx="0" cy="30" rx="40" ry="10" fill="#FFF8F0" stroke="#2D2D2D" stroke-width="3"/>
        <circle cx="0" cy="32" r="8" fill="#EAD7C3" stroke="#2D2D2D" stroke-width="2.5"/>
        <line x1="-15" y1="0" x2="-15" y2="20" stroke="#2D2D2D" stroke-width="2"/>
        <line x1="-5" y1="-5" x2="-5" y2="20" stroke="#2D2D2D" stroke-width="2"/>
        <line x1="5" y1="-5" x2="5" y2="20" stroke="#2D2D2D" stroke-width="2"/>
        <line x1="15" y1="0" x2="15" y2="20" stroke="#2D2D2D" stroke-width="2"/>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-wedding-bells.png', bellsSvg, 400, 350);

  // 6. washi-pink-stripes
  const washiStripesSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" width="500" height="130">
    <defs>
      <pattern id="pinkStripes" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="12" height="24" fill="#FFFFFF" opacity="0.85"/>
        <rect x="12" width="12" height="24" fill="#F4ACB7" opacity="0.6"/>
      </pattern>
    </defs>
    <g transform="translate(10, 15)">
      <!-- Jagged torn washi tape edge -->
      <path d="M 10,15 
               L 460,15 
               L 475,25 L 465,35 L 478,50 L 462,65 L 475,80 L 460,95
               L 10,95
               L -2,80 L 12,65 L -4,50 L 10,35 L -2,25 Z" 
            fill="url(#pinkStripes)" 
            stroke="#F4ACB7" 
            stroke-width="1.5"
            stroke-dasharray="1 0"
            opacity="0.95"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-washi-pink-stripes.png', washiStripesSvg, 500, 130);

  // 7. washi-dusty-rose
  const washiRoseSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" width="500" height="130">
    <g transform="translate(10, 15)">
      <!-- Jagged torn solid dusty rose washi tape -->
      <path d="M 12,15 
               L 462,15 
               L 476,26 L 464,38 L 477,52 L 463,66 L 474,82 L 460,95
               L 10,95
               L -1,82 L 11,66 L -3,52 L 12,38 L -1,26 Z" 
            fill="#E5B2B9" 
            opacity="0.88"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-washi-dusty-rose.png', washiRoseSvg, 500, 130);

  // 8. hair-appointment (text + scissors, bobby pin, comb)
  const hairSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 360" width="450" height="360">
    ${fontCommon}
    <g transform="translate(40, 60)">
      <!-- Text: Hair Appointment -->
      <text x="70" y="70" text-anchor="middle" font-size="64" class="hand-script" fill="#2D2D2D">Hair</text>
      <text x="70" y="105" text-anchor="middle" font-size="20" class="hand-casual" font-weight="700" fill="#2D2D2D">Appointment</text>

      <!-- Stylist Scissors on Right -->
      <g transform="translate(230, 20) rotate(15)">
        <!-- Left Blade & Handle -->
        <circle cx="0" cy="110" r="16" fill="none" stroke="#2D2D2D" stroke-width="3"/>
        <line x1="0" y1="94" x2="35" y2="40" stroke="#2D2D2D" stroke-width="4"/>
        <path d="M 35,40 L 70,-40 L 73,-40 L 40,40 Z" fill="#E0E0E0" stroke="#2D2D2D" stroke-width="2"/>
        
        <!-- Right Blade & Handle -->
        <circle cx="50" cy="110" r="16" fill="none" stroke="#2D2D2D" stroke-width="3"/>
        <line x1="50" y1="94" x2="15" y2="40" stroke="#2D2D2D" stroke-width="4"/>
        <path d="M 15,40 L -20,-40 L -23,-40 L 10,40 Z" fill="#E0E0E0" stroke="#2D2D2D" stroke-width="2"/>
        
        <!-- Pivot Screw -->
        <circle cx="25" cy="40" r="3.5" fill="#2D2D2D"/>
      </g>

      <!-- Bobby Pin below text -->
      <g transform="translate(130, 140) rotate(45)">
        <path d="M 0,0 C -5,0 -5,8 0,8 L 40,8 Q 45,8 50,6 Q 55,8 60,6 Q 65,8 70,6 L 80,6" fill="none" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round"/>
        <line x1="0" y1="0" x2="80" y2="0" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round"/>
      </g>

      <!-- Styling Comb on right bottom -->
      <g transform="translate(230, 150) rotate(35)">
        <path d="M 0,0 Q 15,20 20,80 Q 22,100 20,130" fill="none" stroke="#2D2D2D" stroke-width="4" stroke-linecap="round"/>
        ${generateCombTeeth()}
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-hair-appointment.png', hairSvg, 450, 360);

  // 9. makeup (text + lashes + mascara)
  const makeupSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 320" width="450" height="320">
    ${fontCommon}
    <g transform="translate(225, 90)">
      <!-- Text: makeup -->
      <text x="0" y="0" text-anchor="middle" font-size="64" class="hand-script" fill="#2D2D2D">makeup</text>

      <!-- Closed Eyelashes Doodles -->
      <g transform="translate(0, 45)">
        <!-- Left eye -->
        <g transform="translate(-50, 0)">
          <path d="M -25,0 Q 0,15 25,0" fill="none" stroke="#2D2D2D" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="-20" y1="5" x2="-26" y2="16" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="-10" y1="10" x2="-12" y2="24" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="0" y1="12" x2="0" y2="27" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="10" y1="10" x2="12" y2="24" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="20" y1="5" x2="26" y2="16" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <!-- Right eye -->
        <g transform="translate(50, 0)">
          <path d="M -25,0 Q 0,15 25,0" fill="none" stroke="#2D2D2D" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="-20" y1="5" x2="-26" y2="16" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="-10" y1="10" x2="-12" y2="24" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="0" y1="12" x2="0" y2="27" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="10" y1="10" x2="12" y2="24" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="20" y1="5" x2="26" y2="16" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </g>

      <!-- Mascara Tube & Wand -->
      <g transform="translate(0, 130)">
        <!-- Mascara Wand (Horizontal) -->
        <line x1="-70" y1="-8" x2="10" y2="-8" stroke="#2D2D2D" stroke-width="3"/>
        <!-- Wand Bristles -->
        <rect x="-65" y="-13" width="30" height="10" rx="3" fill="#2D2D2D"/>
        <!-- Wand handle -->
        <rect x="10" y="-14" width="45" height="12" rx="2" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2.5"/>
        
        <!-- Mascara Bottle -->
        <rect x="-15" y="6" width="60" height="18" rx="3" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="2.5"/>
        <rect x="-25" y="7" width="10" height="16" rx="2" fill="#D4AF37" stroke="#2D2D2D" stroke-width="2"/>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-makeup-lashes.png', makeupSvg, 450, 320);

  // 10. order-flowers (text + rose bouquet)
  const orderFlowersSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 480" width="450" height="480">
    ${fontCommon}
    <g transform="translate(180, 70)">
      <!-- Text: order flowers -->
      <text x="0" y="0" text-anchor="middle" font-size="64" class="hand-script" fill="#2D2D2D">order</text>
      <text x="0" y="55" text-anchor="middle" font-size="64" class="hand-script" fill="#2D2D2D">flowers</text>

      <!-- Bouquet below text -->
      <g transform="translate(10, 160)">
        <!-- Green stems tied together -->
        <line x1="-15" y1="50" x2="25" y2="150" stroke="#588157" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="0" y1="50" x2="10" y2="150" stroke="#588157" stroke-width="4" stroke-linecap="round"/>
        <line x1="15" y1="50" x2="-5" y2="150" stroke="#588157" stroke-width="4.5" stroke-linecap="round"/>

        <!-- Stems ribbon wrapping -->
        <polygon points="-12,65 18,75 14,105 -16,95" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2.5"/>
        <line x1="-15" y1="75" x2="16" y2="95" stroke="#FFFFFF" stroke-width="2"/>
        <line x1="-13" y1="90" x2="18" y2="80" stroke="#FFFFFF" stroke-width="2"/>

        <!-- Flowing ribbon loops and tails -->
        <path d="M -15,70 C -45,55 -60,85 -30,95 C -15,100 -12,80 -15,70 Z" fill="#F7CAD0" stroke="#2D2D2D" stroke-width="2.5"/>
        <path d="M -30,95 C -60,115 -75,150 -55,165" fill="none" stroke="#F4ACB7" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M -25,95 C -45,130 -35,160 -40,175" fill="none" stroke="#F4ACB7" stroke-width="3.5" stroke-linecap="round"/>

        <!-- Green leaves framing blooms -->
        <path d="M -60,0 Q -40,-35 0,-20 Q -20,20 -60,0 Z" fill="#8FA988" stroke="#2D2D2D" stroke-width="2.5"/>
        <path d="M 60,0 Q 40,-35 0,-20 Q 20,20 60,0 Z" fill="#8FA988" stroke="#2D2D2D" stroke-width="2.5"/>
        <path d="M 0,-40 Q 30,-60 5,-20 Z" fill="#8FA988" stroke="#2D2D2D" stroke-width="2"/>

        <!-- Hand-drawn pink roses cluster -->
        ${generateRoseDoodle(-35, 10, 22, '#F4ACB7')}
        ${generateRoseDoodle(25, 15, 20, '#F7CAD0')}
        ${generateRoseDoodle(0, -15, 25, '#F4ACB7')}
        ${generateRoseDoodle(-25, -20, 18, '#FFE5EC')}
        ${generateRoseDoodle(30, -15, 19, '#F4ACB7')}
        ${generateRoseDoodle(5, 20, 22, '#F7CAD0')}
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-order-flowers.png', orderFlowersSvg, 450, 480);

  // 11. book-photographer (text + vintage camera)
  const cameraSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 380" width="450" height="380">
    ${fontCommon}
    <g transform="translate(225, 280)">
      <!-- Text: Book Photographer -->
      <text x="0" y="30" text-anchor="middle" font-size="54" class="hand-script" fill="#2D2D2D">Book</text>
      <text x="0" y="80" text-anchor="middle" font-size="52" class="hand-script" fill="#2D2D2D">Photographer</text>

      <!-- Vintage Camera Doodle on Top -->
      <g transform="translate(0, -150)">
        <!-- Camera Body -->
        <rect x="-105" y="-55" width="210" height="135" rx="14" fill="#6C757D" stroke="#2D2D2D" stroke-width="4"/>
        <!-- Camera Top Grip / plate -->
        <rect x="-105" y="-55" width="210" height="35" rx="5" fill="#ADB5BD" stroke="#2D2D2D" stroke-width="3"/>
        
        <!-- Viewfinder & Flash -->
        <rect x="-80" y="-45" width="28" height="18" rx="3" fill="#343A40" stroke="#2D2D2D" stroke-width="2"/>
        <rect x="50" y="-45" width="35" height="18" rx="3" fill="#E9ECEF" stroke="#2D2D2D" stroke-width="2.5"/>
        <line x1="58" y1="-45" x2="58" y2="-27" stroke="#2D2D2D" stroke-width="1.5"/>
        <line x1="68" y1="-45" x2="68" y2="-27" stroke="#2D2D2D" stroke-width="1.5"/>

        <!-- Shutter Button -->
        <rect x="-60" y="-68" width="20" height="13" rx="2" fill="#2D2D2D"/>
        <!-- Mode dial -->
        <rect x="40" y="-65" width="18" height="10" rx="2" fill="#2D2D2D"/>

        <!-- Large Circular Lens -->
        <circle cx="0" cy="18" r="48" fill="#495057" stroke="#2D2D2D" stroke-width="4"/>
        <circle cx="0" cy="18" r="38" fill="#D8E2DC" stroke="#2D2D2D" stroke-width="3"/>
        <circle cx="0" cy="18" r="24" fill="#212529" stroke="#2D2D2D" stroke-width="2.5"/>
        <!-- Lens Glint / Reflection -->
        <path d="M -12,8 Q -16,18 -8,26" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-book-photographer.png', cameraSvg, 450, 380);

  // 12. dress fitting (text + ring)
  const fittingSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 240" width="450" height="240">
    ${fontCommon}
    <g transform="translate(160, 120)">
      <!-- Ring on left -->
      <g transform="translate(-60, 0)">
        <circle cx="0" cy="0" r="28" fill="none" stroke="#2D2D2D" stroke-width="4"/>
        <!-- Solitaire diamond on top -->
        <polygon points="-12,-28 12,-28 16,-38 -16,-38" fill="#E8F4F8" stroke="#2D2D2D" stroke-width="2.5"/>
        <polygon points="-16,-38 16,-38 0,-50" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="2.5"/>
        <!-- Sparkle lines -->
        <line x1="-12" y1="-56" x2="-6" y2="-52" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
        <line x1="0" y1="-60" x2="0" y2="-54" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="-56" x2="6" y2="-52" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- Text: fitting -->
      <text x="75" y="15" text-anchor="middle" font-size="82" class="hand-script" fill="#2D2D2D">fitting</text>
    </g>
  </svg>`;
  await renderSvgToPng('planner-dress-fitting.png', fittingSvg, 450, 240);

  // 13. you're invited envelope
  const invitedSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350" width="400" height="350">
    ${fontCommon}
    <g transform="translate(200, 190) rotate(-6)">
      <!-- Note sticking out of envelope -->
      <rect x="-85" y="-120" width="170" height="130" rx="3" fill="#FFFDF9" stroke="#2D2D2D" stroke-width="3"/>
      <!-- Handwritten header on note -->
      <text x="0" y="-85" text-anchor="middle" font-size="28" class="hand-script" fill="#2D2D2D">You're</text>
      <text x="0" y="-60" text-anchor="middle" font-size="24" class="hand-script" fill="#2D2D2D">Invited</text>
      <!-- Note wavy lines -->
      <path d="M -60,-35 Q -30,-38 0,-35 Q 30,-32 60,-35" fill="none" stroke="#9E9E9E" stroke-width="2"/>
      <path d="M -50,-18 Q -20,-21 10,-18 Q 30,-15 50,-18" fill="none" stroke="#9E9E9E" stroke-width="2"/>

      <!-- Envelope Body -->
      <polygon points="-100,50 100,50 100,-40 -100,-40" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="3.5"/>
      <!-- Envelope Bottom Fold Flaps -->
      <polygon points="-100,50 0,-5 100,50" fill="#F8F9FA" stroke="#2D2D2D" stroke-width="2.5"/>
      <line x1="-100" y1="-40" x2="-25" y2="12" stroke="#2D2D2D" stroke-width="2.5"/>
      <line x1="100" y1="-40" x2="25" y2="12" stroke="#2D2D2D" stroke-width="2.5"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-youre-invited.png', invitedSvg, 400, 350);

  // 14. i-do script
  const iDoSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 200" width="350" height="200">
    ${fontCommon}
    <g transform="translate(175, 110)">
      <text x="0" y="0" text-anchor="middle" font-size="95" class="hand-script" fill="#2D2D2D">I do</text>
      <!-- Heart dot for the 'i' -->
      <path d="M -52,-70 C -56,-76 -64,-72 -60,-65 L -52,-56 L -44,-65 C -40,-72 -48,-76 -52,-70 Z" fill="#F4ACB7"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-i-do.png', iDoSvg, 350, 200);

  // 15. bridal-shower script
  const bridalShowerSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 250" width="450" height="250">
    ${fontCommon}
    <g transform="translate(225, 100)">
      <text x="0" y="-10" text-anchor="middle" font-size="78" class="hand-script" fill="#2D2D2D">bridal</text>
      <text x="0" y="60" text-anchor="middle" font-size="78" class="hand-script" fill="#2D2D2D">shower</text>
    </g>
  </svg>`;
  await renderSvgToPng('planner-bridal-shower.png', bridalShowerSvg, 450, 250);

  // 16. scalloped-bunting banner
  const buntingSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" width="500" height="180">
    <g transform="translate(250, 30)">
      <!-- Main hanging string curve -->
      <path d="M -220,10 Q 0,75 220,10" fill="none" stroke="#2D2D2D" stroke-width="3" stroke-linecap="round"/>
      <circle cx="-220" cy="10" r="4.5" fill="#2D2D2D"/>
      <circle cx="220" cy="10" r="4.5" fill="#2D2D2D"/>

      <!-- Hanging Scalloped Bunting loops in soft blush pink -->
      ${generateScallops()}
    </g>
  </svg>`;
  await renderSvgToPng('planner-scalloped-bunting.png', buntingSvg, 500, 180);

  // 17. ribbon-scroll banner
  const ribbonSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" width="500" height="180">
    <g transform="translate(250, 90)">
      <!-- Left ribbon tail fold -->
      <path d="M -150,-15 L -200,-35 L -175,-5 L -200,25 L -150,5 Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="3"/>
      <polygon points="-150,-15 -130,-5 -150,5" fill="#D68C96" stroke="#2D2D2D" stroke-width="2"/>

      <!-- Right ribbon tail fold -->
      <path d="M 150,-15 L 200,-35 L 175,-5 L 200,25 L 150,5 Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="3"/>
      <polygon points="150,-15 130,-5 150,5" fill="#D68C96" stroke="#2D2D2D" stroke-width="2"/>

      <!-- Main Banner Scroll Body in Soft Blush Pink -->
      <path d="M -140,-25 Q 0,-35 140,-25 L 140,25 Q 0,15 -140,25 Z" fill="#FCE1E4" stroke="#2D2D2D" stroke-width="3.5"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-ribbon-scroll.png', ribbonSvg, 500, 180);

  // 18. wedding planner spiral notebook
  const notebookSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 380" width="350" height="380">
    ${fontCommon}
    <g transform="translate(175, 190)">
      <!-- Notebook Cover in Blush Pink -->
      <rect x="-105" y="-140" width="220" height="280" rx="12" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="4"/>
      <!-- Inner card frame -->
      <rect x="-45" y="-70" width="120" height="140" rx="6" fill="#FFFDF9" stroke="#2D2D2D" stroke-width="3"/>
      
      <!-- Heart badge on cover -->
      <path d="M 15,-20 C 10,-32 -5,-30 0,-15 C 5,-30 20,-32 15,-20 Z" transform="translate(0, 10)" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2.5"/>
      <text x="15" y="25" text-anchor="middle" font-size="16" class="serif-caps" fill="#2D2D2D" letter-spacing="1">WEDDING</text>

      <!-- Spiral Binding on Left -->
      ${generateSpiralBinding()}
    </g>
  </svg>`;
  await renderSvgToPng('planner-wedding-journal.png', notebookSvg, 350, 380);

  // 19. bridal high heels stiletto
  const heelsSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="400" height="320">
    <g transform="translate(180, 160)">
      <!-- Elegant pointed-toe stiletto -->
      <path d="M -90,60 
               C -75,60 -50,45 -20,-10 
               C -5,-35 25,-40 55,-35 
               C 65,-30 75,-15 70,5 
               C 65,25 35,40 10,50 
               C -20,58 -65,60 -90,60 Z" 
            fill="#FFFFFF" stroke="#2D2D2D" stroke-width="3.5"/>
      
      <!-- Inner sole curve -->
      <path d="M -70,55 C -45,45 -15,-5 20,-15 C 35,-10 50,0 45,25" fill="none" stroke="#2D2D2D" stroke-width="2"/>
      
      <!-- Thin Stiletto Heel -->
      <path d="M 50,5 L 56,80 L 51,80 L 45,15 Z" fill="#2D2D2D"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-high-heels.png', heelsSvg, 400, 320);

  // 20. gift box with ribbon
  const giftSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 350" width="350" height="350">
    <g transform="translate(175, 180) rotate(-4)">
      <!-- Box base -->
      <rect x="-80" y="-30" width="160" height="150" fill="#F8F9FA" stroke="#2D2D2D" stroke-width="3.5"/>
      <!-- Box Lid -->
      <rect x="-90" y="-55" width="180" height="30" rx="3" fill="#FFFFFF" stroke="#2D2D2D" stroke-width="3.5"/>

      <!-- Vertical ribbon -->
      <rect x="-12" y="-30" width="24" height="150" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2"/>
      <rect x="-12" y="-55" width="24" height="30" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2"/>

      <!-- Big Ribbon Bow on Lid -->
      <g transform="translate(0, -60)">
        <path d="M 0,5 C -25,-30 -55,-25 -45,5 C -35,25 -10,12 0,5 Z" fill="#FCE1E4" stroke="#2D2D2D" stroke-width="3"/>
        <path d="M 0,5 C 25,-30 55,-25 45,5 C 35,25 10,12 0,5 Z" fill="#FCE1E4" stroke="#2D2D2D" stroke-width="3"/>
        <circle cx="0" cy="5" r="7" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2.5"/>
        <!-- Tails -->
        <path d="M -5,12 C -20,25 -30,40 -35,55" fill="none" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 5,12 C 20,25 30,40 35,55" fill="none" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-gift-box.png', giftSvg, 350, 350);

  // 21. doodle pink heart with spark lines
  const heartSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 300" width="320" height="300">
    <g transform="translate(160, 160) rotate(-8)">
      <!-- Main hand-drawn blush heart -->
      <path d="M 0,45 C -75,-15 -65,-75 0,-40 C 65,-75 75,-15 0,45 Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="4.5" stroke-linejoin="round"/>
      
      <!-- Sketch hatch shading on left lobe -->
      <line x1="-30" y1="-25" x2="-30" y2="0" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="-22" y1="-30" x2="-22" y2="8" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="-14" y1="-28" x2="-14" y2="15" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>

      <!-- Radiating accent spark lines -->
      <line x1="-65" y1="-60" x2="-80" y2="-75" stroke="#2D2D2D" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="0" y1="-75" x2="0" y2="-95" stroke="#2D2D2D" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="65" y1="-60" x2="80" y2="-75" stroke="#2D2D2D" stroke-width="3.5" stroke-linecap="round"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-doodle-heart.png', heartSvg, 320, 300);

  // 22. countdown prompt: "— Days"
  const countdownSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" width="400" height="180">
    ${fontCommon}
    <g transform="translate(200, 105)">
      <!-- Line for blank number -->
      <line x1="-140" y1="0" x2="-35" y2="0" stroke="#2D2D2D" stroke-width="6" stroke-linecap="round"/>
      <!-- Days hand lettering -->
      <text x="50" y="8" text-anchor="middle" font-size="74" class="hand-casual" font-weight="700" fill="#2D2D2D">Days</text>
    </g>
  </svg>`;
  await renderSvgToPng('planner-days-countdown.png', countdownSvg, 400, 180);

  // 23. love love love continuous cursive ribbon
  const loveLineSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 150" width="650" height="150">
    ${fontCommon}
    <g transform="translate(325, 85)">
      <text x="0" y="0" text-anchor="middle" font-size="62" class="hand-script" fill="#2D2D2D" letter-spacing="4">love love love love</text>
    </g>
  </svg>`;
  await renderSvgToPng('planner-love-line.png', loveLineSvg, 650, 150);

  // 24. swirl divider
  const swirlSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 160" width="500" height="160">
    <g transform="translate(250, 80)">
      <!-- Symmetrical top flourish curl -->
      <path d="M -160,25 C -180,0 -150,-35 -120,-10 C -90,15 -60,-20 0,-40 C 60,-20 90,15 120,-10 C 150,-35 180,0 160,25" fill="none" stroke="#2D2D2D" stroke-width="4" stroke-linecap="round"/>
      <!-- Inner curl loops -->
      <path d="M -120,-10 C -105,-2 -115,10 -125,5" fill="none" stroke="#2D2D2D" stroke-width="3"/>
      <path d="M 120,-10 C 105,-2 115,10 125,5" fill="none" stroke="#2D2D2D" stroke-width="3"/>
      <!-- Center top fleur/accent -->
      <circle cx="0" cy="-40" r="4.5" fill="#2D2D2D"/>
      <circle cx="-160" cy="25" r="3.5" fill="#2D2D2D"/>
      <circle cx="160" cy="25" r="3.5" fill="#2D2D2D"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-swirl-divider.png', swirlSvg, 500, 160);

  // 25. 3-tier frosted wedding cake
  const cakeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="400" height="480">
    <g transform="translate(200, 240)">
      <!-- Pedestal Stand -->
      <ellipse cx="0" cy="180" rx="140" ry="16" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="3.5"/>
      <path d="M -35,180 L -15,215 L 15,215 L 35,180 Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="3.5"/>
      <ellipse cx="0" cy="215" rx="70" ry="12" fill="#E8929F" stroke="#2D2D2D" stroke-width="3.5"/>

      <!-- Tier 1 (Bottom) -->
      <rect x="-110" y="85" width="220" height="95" rx="8" fill="#FFFDF9" stroke="#2D2D2D" stroke-width="4"/>
      <!-- Drip frosting -->
      <path d="M -110,110 Q -90,125 -70,110 Q -50,130 -30,110 Q -10,125 10,110 Q 30,130 50,110 Q 70,125 90,110 Q 100,120 110,110" fill="none" stroke="#F4ACB7" stroke-width="5" stroke-linecap="round"/>

      <!-- Tier 2 (Middle) -->
      <rect x="-80" y="0" width="160" height="85" rx="6" fill="#FFFDF9" stroke="#2D2D2D" stroke-width="4"/>
      <path d="M -80,25 Q -60,40 -40,25 Q -20,40 0,25 Q 20,40 40,25 Q 60,40 80,25" fill="none" stroke="#F4ACB7" stroke-width="4.5" stroke-linecap="round"/>

      <!-- Tier 3 (Top) -->
      <rect x="-50" y="-75" width="100" height="75" rx="5" fill="#FFFDF9" stroke="#2D2D2D" stroke-width="4"/>
      <path d="M -50,-55 Q -30,-40 -10,-55 Q 10,-40 30,-55 Q 40,-45 50,-55" fill="none" stroke="#F4ACB7" stroke-width="4" stroke-linecap="round"/>

      <!-- Cake Topper: Flowers & Heart -->
      <g transform="translate(0, -95)">
        <path d="M 0,10 C -15,-10 -30,5 -15,20 L 0,35 L 15,20 C 30,5 15,-10 0,10 Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="2.5"/>
        <circle cx="-15" cy="5" r="7" fill="#8FA988" stroke="#2D2D2D" stroke-width="2"/>
        <circle cx="15" cy="5" r="7" fill="#8FA988" stroke="#2D2D2D" stroke-width="2"/>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-wedding-cake.png', cakeSvg, 400, 480);

  // 26. best-day-ever script
  const bestDaySvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 250" width="450" height="250">
    ${fontCommon}
    <g transform="translate(225, 80)">
      <text x="0" y="0" text-anchor="middle" font-size="76" class="hand-script" fill="#2D2D2D">Best Day</text>
      <text x="0" y="65" text-anchor="middle" font-size="82" class="hand-script" fill="#2D2D2D">Ever</text>
      <!-- Sparkle stars -->
      <path d="M -130,20 L -125,5 L -120,20 L -105,25 L -120,30 L -125,45 L -130,30 L -145,25 Z" fill="#D4AF37"/>
      <path d="M 130,20 L 135,5 L 140,20 L 155,25 L 140,30 L 135,45 L 130,30 L 115,25 Z" fill="#D4AF37"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-best-day-ever.png', bestDaySvg, 450, 250);

  // 27. Swahili: Harusi Yetu calligraphy
  const harusiYetuSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" width="480" height="240">
    ${fontCommon}
    <g transform="translate(240, 110)">
      <text x="0" y="0" text-anchor="middle" font-size="78" class="hand-script" fill="#2D2D2D">Harusi Yetu</text>
      <!-- Leafy branch accent -->
      <g transform="translate(0, 45)">
        <path d="M -120,0 Q 0,-15 120,0" fill="none" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="-60" cy="-6" r="4" fill="#8FA988" stroke="#2D2D2D" stroke-width="1.5"/>
        <circle cx="0" cy="-8" r="4.5" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="1.5"/>
        <circle cx="60" cy="-6" r="4" fill="#8FA988" stroke="#2D2D2D" stroke-width="1.5"/>
      </g>
    </g>
  </svg>`;
  await renderSvgToPng('planner-harusi-yetu.png', harusiYetuSvg, 480, 240);

  // 28. Swahili: Sherehe party script
  const shereheSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 220" width="450" height="220">
    ${fontCommon}
    <g transform="translate(225, 115)">
      <text x="0" y="0" text-anchor="middle" font-size="88" class="hand-script" fill="#2D2D2D">Sherehe</text>
      <!-- Confetti sparks -->
      <circle cx="-130" cy="-20" r="4" fill="#F4ACB7"/>
      <circle cx="-100" cy="-50" r="3" fill="#D4AF37"/>
      <circle cx="110" cy="-40" r="4" fill="#8FA988"/>
      <circle cx="140" cy="-10" r="3.5" fill="#F4ACB7"/>
    </g>
  </svg>`;
  await renderSvgToPng('planner-sherehe.png', shereheSvg, 450, 220);

  console.log('Finished generating handdrawn planner stickers suite!');
}

function generateWreathLeaves() {
  const leaves = [];
  const numLeaves = 36;
  const radius = 192;
  for (let i = 0; i < numLeaves; i++) {
    const angle = (i / numLeaves) * 2 * Math.PI;
    // skip top and bottom openings slightly
    if (Math.abs(Math.sin(angle)) < 0.15 && Math.cos(angle) < 0) continue;
    
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius;
    const rot = (angle * 180) / Math.PI + 90;
    const isGreen = i % 2 === 0;
    const fill = isGreen ? '#98B68E' : '#FFFFFF';
    leaves.push(`
      <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${rot.toFixed(1)})">
        <path d="M 0,0 C 8,-12 18,-14 22,-8 C 26,-2 14,8 0,0 Z" fill="${fill}" stroke="#2D2D2D" stroke-width="2"/>
      </g>
    `);
  }
  return leaves.join('\n');
}

function generateCombTeeth() {
  const teeth = [];
  for (let i = 0; i < 18; i++) {
    const y = 20 + i * 5;
    teeth.push(`<line x1="20" y1="${y}" x2="45" y2="${y}" stroke="#2D2D2D" stroke-width="2"/>`);
  }
  return teeth.join('\n');
}

function generateRoseDoodle(cx, cy, r, color) {
  return `
    <g transform="translate(${cx}, ${cy})">
      <circle cx="0" cy="0" r="${r}" fill="${color}" stroke="#2D2D2D" stroke-width="2.5"/>
      <!-- Inner petal swirls -->
      <path d="M ${-r*0.4},0 C ${-r*0.2},${-r*0.5} ${r*0.3},${-r*0.4} ${r*0.4},0 C ${r*0.2},${r*0.5} ${-r*0.1},${r*0.4} 0,0" fill="none" stroke="#2D2D2D" stroke-width="2"/>
    </g>
  `;
}

function generateScallops() {
  const scallops = [];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = -200 + t * 400;
    // parabolic hanging drop
    const y = 10 + 60 * Math.sin(t * Math.PI);
    scallops.push(`
      <path d="M ${x-18},${y} C ${x-18},${y+25} ${x+18},${y+25} ${x+18},${y} Z" fill="#FCE1E4" stroke="#2D2D2D" stroke-width="2.5"/>
      <path d="M ${x-14},${y} C ${x-14},${y+18} ${x+14},${y+18} ${x+14},${y} Z" fill="#F4ACB7" stroke="#2D2D2D" stroke-width="1.5"/>
    `);
  }
  return scallops.join('\n');
}

function generateSpiralBinding() {
  const loops = [];
  for (let i = 0; i < 14; i++) {
    const y = -120 + i * 18;
    loops.push(`
      <ellipse cx="-105" cy="${y}" rx="12" ry="5" fill="#E9ECEF" stroke="#2D2D2D" stroke-width="3"/>
    `);
  }
  return loops.join('\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
