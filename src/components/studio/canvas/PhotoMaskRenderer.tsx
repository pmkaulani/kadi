'use client';

import React from 'react';
import type { MaskShape } from '@/types/canvas';

interface PhotoMaskRendererProps {
  id: string;
  src: string;
  alt?: string;
  maskShape?: MaskShape;
  stickerEffect?: boolean;
  stickerBorderWidth?: number;
  stickerBorderColor?: string;
  className?: string;
}

export function PhotoMaskRenderer({
  id,
  src,
  alt = 'Photo',
  maskShape = 'none',
  stickerEffect = false,
  stickerBorderWidth = 8,
  stickerBorderColor = '#FFFFFF',
  className = '',
}: PhotoMaskRendererProps) {
  const clipId = `photo-clip-${id}`;
  const strokeW = stickerBorderWidth * 2;

  // Filter for authentic 3D vinyl sticker peel-and-stick look
  const stickerFilter = stickerEffect
    ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.32)) drop-shadow(0 2px 4px rgba(0,0,0,0.18))'
    : undefined;

  // 1. HEART SHAPE (The couple heart die-cut sticker look)
  if (maskShape === 'heart') {
    const heartPath =
      'M 100,175 C 20,120 10,75 10,48 C 10,22 30,12 55,12 C 75,12 90,24 100,38 C 110,24 125,12 145,12 C 170,12 190,22 190,48 C 190,75 180,120 100,175 Z';

    return (
      <div
        className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
        style={{ filter: stickerFilter }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id={clipId}>
              <path d={heartPath} />
            </clipPath>
          </defs>

          {/* White Vinyl Die-Cut Sticker Outline */}
          {stickerEffect && (
            <path
              d={heartPath}
              fill={stickerBorderColor}
              stroke={stickerBorderColor}
              strokeWidth={strokeW}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* User Photo clipped to Heart */}
          <image
            href={src}
            x="0"
            y="0"
            width="200"
            height="200"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />

          {/* Clean inner hairline edge */}
          <path
            d={heartPath}
            fill="none"
            stroke={stickerEffect ? stickerBorderColor : 'rgba(0,0,0,0.06)'}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  // 2. ARCH SHAPE (Architectural curved window)
  if (maskShape === 'arch') {
    const archPath =
      'M 15,190 L 15,90 C 15,40 50,15 100,15 C 150,15 185,40 185,90 L 185,190 Z';

    return (
      <div
        className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
        style={{ filter: stickerFilter }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id={clipId}>
              <path d={archPath} />
            </clipPath>
          </defs>

          {stickerEffect && (
            <path
              d={archPath}
              fill={stickerBorderColor}
              stroke={stickerBorderColor}
              strokeWidth={strokeW}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          <image
            href={src}
            x="0"
            y="0"
            width="200"
            height="200"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />

          <path
            d={archPath}
            fill="none"
            stroke={stickerEffect ? stickerBorderColor : 'rgba(0,0,0,0.06)'}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  // 3. POLAROID FRAME (Instant Photo Keepsake)
  if (maskShape === 'polaroid') {
    return (
      <div
        className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
        style={{
          filter: stickerFilter || 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))',
        }}
      >
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="14" y="14" width="172" height="160" rx="3" />
            </clipPath>
          </defs>

          {/* Polaroid Card Base */}
          <rect
            x="6"
            y="6"
            width="188"
            height="228"
            rx="6"
            fill={stickerBorderColor}
            stroke={stickerEffect ? stickerBorderColor : '#E5E7EB'}
            strokeWidth={stickerEffect ? strokeW / 2 : 1}
          />

          {/* Photo inside frame */}
          <image
            href={src}
            x="14"
            y="14"
            width="172"
            height="160"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />

          {/* Subtle inner photo border */}
          <rect
            x="14"
            y="14"
            width="172"
            height="160"
            rx="3"
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
          />

          {/* Subtle bottom caption rule */}
          <line
            x1="35"
            y1="205"
            x2="165"
            y2="205"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
    );
  }

  // 4. POSTAGE STAMP (Perforated scalloped edges)
  if (maskShape === 'stamp') {
    const stampPath = generatePostageStampPath();

    return (
      <div
        className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
        style={{ filter: stickerFilter || 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="20" y="20" width="160" height="160" rx="2" />
            </clipPath>
          </defs>

          {/* Perforated stamp background */}
          <path
            d={stampPath}
            fill={stickerBorderColor}
            stroke={stickerEffect ? stickerBorderColor : '#E5E7EB'}
            strokeWidth={stickerEffect ? strokeW / 2 : 1.5}
            strokeLinejoin="round"
          />

          {/* Photo */}
          <image
            href={src}
            x="20"
            y="20"
            width="160"
            height="160"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />

          <rect
            x="20"
            y="20"
            width="160"
            height="160"
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1"
          />
        </svg>
      </div>
    );
  }

  // 5. STAR SHAPE
  if (maskShape === 'star') {
    const starPoints =
      '100,12 126,68 188,72 140,114 156,175 100,140 44,175 60,114 12,72 74,68';

    return (
      <div
        className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
        style={{ filter: stickerFilter }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id={clipId}>
              <polygon points={starPoints} />
            </clipPath>
          </defs>

          {stickerEffect && (
            <polygon
              points={starPoints}
              fill={stickerBorderColor}
              stroke={stickerBorderColor}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          )}

          <image
            href={src}
            x="0"
            y="0"
            width="200"
            height="200"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />

          <polygon
            points={starPoints}
            fill="none"
            stroke={stickerEffect ? stickerBorderColor : 'rgba(0,0,0,0.06)'}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  // 6. SCALLOPED FLOWER / MEDAL BADGE
  if (maskShape === 'flower') {
    const flowerPath = generateScallopedFlowerPath();

    return (
      <div
        className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
        style={{ filter: stickerFilter }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id={clipId}>
              <path d={flowerPath} />
            </clipPath>
          </defs>

          {stickerEffect && (
            <path
              d={flowerPath}
              fill={stickerBorderColor}
              stroke={stickerBorderColor}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          )}

          <image
            href={src}
            x="0"
            y="0"
            width="200"
            height="200"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />

          <path
            d={flowerPath}
            fill="none"
            stroke={stickerEffect ? stickerBorderColor : 'rgba(0,0,0,0.06)'}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  // 7. CIRCLE SHAPE
  if (maskShape === 'circle') {
    return (
      <div
        className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
        style={{ filter: stickerFilter }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id={clipId}>
              <circle cx="100" cy="100" r="90" />
            </clipPath>
          </defs>

          {stickerEffect && (
            <circle
              cx="100"
              cy="100"
              r="90"
              fill={stickerBorderColor}
              stroke={stickerBorderColor}
              strokeWidth={strokeW}
            />
          )}

          <image
            href={src}
            x="10"
            y="10"
            width="180"
            height="180"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />

          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={stickerEffect ? stickerBorderColor : 'rgba(0,0,0,0.06)'}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  // 8. OVAL PORTRAIT
  if (maskShape === 'oval') {
    return (
      <div
        className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
        style={{ filter: stickerFilter }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <clipPath id={clipId}>
              <ellipse cx="100" cy="100" rx="78" ry="92" />
            </clipPath>
          </defs>

          {stickerEffect && (
            <ellipse
              cx="100"
              cy="100"
              rx="78"
              ry="92"
              fill={stickerBorderColor}
              stroke={stickerBorderColor}
              strokeWidth={strokeW}
            />
          )}

          <image
            href={src}
            x="22"
            y="8"
            width="156"
            height="184"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
          />

          <ellipse
            cx="100"
            cy="100"
            rx="78"
            ry="92"
            fill="none"
            stroke={stickerEffect ? stickerBorderColor : 'rgba(0,0,0,0.06)'}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  // 9. SOFT ROUNDED OR FULL RECTANGLE
  const radius = maskShape === 'rounded' ? 24 : 0;
  return (
    <div
      className={`w-full h-full relative select-none flex items-center justify-center ${className}`}
      style={{ filter: stickerFilter }}
    >
      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: `${radius}px`,
          border: stickerEffect ? `${stickerBorderWidth}px solid ${stickerBorderColor}` : undefined,
          boxShadow: stickerEffect ? undefined : '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>
    </div>
  );
}

// Generates smooth perforated edges for postage stamp
function generatePostageStampPath(): string {
  // Rectangle 16 to 184 with scallops on each side
  return `
    M 20,20
    Q 20,26 14,26 Q 20,26 20,32
    L 20,45 Q 20,51 14,51 Q 20,51 20,57
    L 20,70 Q 20,76 14,76 Q 20,76 20,82
    L 20,95 Q 20,101 14,101 Q 20,101 20,107
    L 20,120 Q 20,126 14,126 Q 20,126 20,132
    L 20,145 Q 20,151 14,151 Q 20,151 20,157
    L 20,170 Q 20,176 14,176 Q 20,176 20,182
    L 20,185
    L 32,185 Q 32,191 38,191 Q 38,185 44,185
    L 57,185 Q 57,191 63,191 Q 63,185 69,185
    L 82,185 Q 82,191 88,191 Q 88,185 94,185
    L 107,185 Q 107,191 113,191 Q 113,185 119,185
    L 132,185 Q 132,191 138,191 Q 138,185 144,185
    L 157,185 Q 157,191 163,191 Q 163,185 169,185
    L 182,185
    L 185,182 Q 185,176 191,176 Q 185,176 185,170
    L 185,157 Q 185,151 191,151 Q 185,151 185,145
    L 185,132 Q 185,126 191,126 Q 185,126 185,120
    L 185,107 Q 185,101 191,101 Q 185,101 185,95
    L 185,82 Q 185,76 191,76 Q 185,76 185,70
    L 185,57 Q 185,51 191,51 Q 185,51 185,45
    L 185,32 Q 185,26 191,26 Q 185,26 185,20
    L 182,15
    L 169,15 Q 169,9 163,9 Q 163,15 157,15
    L 144,15 Q 144,9 138,9 Q 138,15 132,15
    L 119,15 Q 119,9 113,9 Q 113,15 107,15
    L 94,15 Q 94,9 88,9 Q 88,15 82,15
    L 69,15 Q 69,9 63,9 Q 63,15 57,15
    L 44,15 Q 44,9 38,9 Q 38,15 32,15
    L 20,15 Z
  `;
}

// Generates smooth 12-lobed flower badge
function generateScallopedFlowerPath(): string {
  const lobes = 12;
  const cx = 100;
  const cy = 100;
  const rBase = 84;
  const rLobe = 10;
  let d = '';

  for (let i = 0; i < lobes; i++) {
    const angle1 = (i / lobes) * Math.PI * 2;
    const angle2 = ((i + 1) / lobes) * Math.PI * 2;
    const midAngle = (angle1 + angle2) / 2;

    const x1 = cx + Math.cos(angle1) * (rBase - 4);
    const y1 = cy + Math.sin(angle1) * (rBase - 4);
    const xMid = cx + Math.cos(midAngle) * (rBase + rLobe);
    const yMid = cy + Math.sin(midAngle) * (rBase + rLobe);
    const x2 = cx + Math.cos(angle2) * (rBase - 4);
    const y2 = cy + Math.sin(angle2) * (rBase - 4);

    if (i === 0) {
      d += `M ${x1},${y1} Q ${xMid},${yMid} ${x2},${y2} `;
    } else {
      d += `Q ${xMid},${yMid} ${x2},${y2} `;
    }
  }
  return d + 'Z';
}
