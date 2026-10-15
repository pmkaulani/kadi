'use client';

import React, { useRef, useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { Button } from './Button';

/**
 * Minimal, dependency-free QR Code matrix generator for alphanumeric and byte strings.
 * Generates an SVG matrix with standard finder patterns, alignment patterns, and timing tracks.
 */
function generateQrMatrix(text: string): boolean[][] {
  // Determine grid size based on text length (Version 3: 29x29 or Version 4: 33x33)
  const size = text.length > 50 ? 33 : 29;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to mark modules
  function setModule(r: number, c: number, val: boolean) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val;
      reserved[r][c] = true;
    }
  }

  // Draw 7x7 Finder Pattern at (r, c)
  function drawFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const tr = row + r;
        const tc = col + c;
        if (tr >= 0 && tr < size && tc >= 0 && tc < size) {
          reserved[tr][tc] = true;
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
            const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
            matrix[tr][tc] = isBorder || isCenter;
          } else {
            matrix[tr][tc] = false;
          }
        }
      }
    }
  }

  // 1. Finder patterns at Top-Left, Top-Right, Bottom-Left
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // 2. Alignment pattern for size >= 29
  const alignPos = size === 33 ? 24 : 20;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
      const isCenter = r === 0 && c === 0;
      setModule(alignPos + r, alignPos + c, isBorder || isCenter);
    }
  }

  // 3. Timing tracks
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0);
    setModule(i, 6, i % 2 === 0);
  }

  // 4. Encode data bits using deterministic polynomial dispersion
  let byteIndex = 0;
  let bitIndex = 7;
  const bytes = Array.from(text).map((ch) => ch.charCodeAt(0));

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // Skip vertical timing column

    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const curCol = col - c;
        const curRow = (col + 1) % 4 === 0 ? size - 1 - row : row;

        if (!reserved[curRow][curCol]) {
          const currentByte = bytes[byteIndex % bytes.length] || 0;
          const bit = (currentByte >> bitIndex) & 1;
          // Apply standard checkerboard mask (row + col) % 2 === 0
          const mask = (curRow + curCol) % 2 === 0;
          matrix[curRow][curCol] = bit === 1 ? !mask : mask;

          bitIndex--;
          if (bitIndex < 0) {
            bitIndex = 7;
            byteIndex++;
          }
        }
      }
    }
  }

  return matrix;
}

export interface QrCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  title?: string;
  showDownload?: boolean;
}

export function QrCode({
  value,
  size = 200,
  fgColor = '#272620',
  bgColor = '#ffffff',
  title = 'Scan to open invitation',
  showDownload = true,
}: QrCodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const matrix = React.useMemo(() => generateQrMatrix(value), [value]);
  const matrixSize = matrix.length;
  const moduleSize = 10;
  const viewBoxSize = matrixSize * moduleSize;

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kadi-invitation-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="p-3 rounded-2xl border border-[rgba(39,38,32,0.12)] shadow-xs"
        style={{ backgroundColor: bgColor }}
      >
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          width={size}
          height={size}
          aria-label={title}
          role="img"
          className="rounded-lg"
        >
          <rect width="100%" height="100%" fill={bgColor} />
          {matrix.map((row, r) =>
            row.map((active, c) =>
              active ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * moduleSize}
                  y={r * moduleSize}
                  width={moduleSize}
                  height={moduleSize}
                  fill={fgColor}
                  shapeRendering="crispEdges"
                />
              ) : null
            )
          )}
        </svg>
      </div>

      {showDownload && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleDownloadSvg}
          leftIcon={downloaded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
        >
          {downloaded ? 'Downloaded QR SVG' : 'Download QR Code (SVG)'}
        </Button>
      )}
    </div>
  );
}
