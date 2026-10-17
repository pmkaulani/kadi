'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Plus, Check } from 'lucide-react';
import type { MaskShape } from '@/types/canvas';

interface UploadsPanelProps {
  onInsertPhoto: (photoUrl: string, maskShape: MaskShape, stickerEffect?: boolean) => void;
}

const MASK_OPTIONS: { id: MaskShape; label: string; icon: string }[] = [
  { id: 'heart', label: 'Heart', icon: '❤️' },
  { id: 'arch', label: 'Arch', icon: '🏛️' },
  { id: 'polaroid', label: 'Polaroid', icon: '📷' },
  { id: 'stamp', label: 'Stamp', icon: '💌' },
  { id: 'circle', label: 'Circle', icon: '⚪' },
  { id: 'oval', label: 'Oval', icon: '🥚' },
  { id: 'star', label: 'Star', icon: '⭐' },
  { id: 'flower', label: 'Badge', icon: '🌸' },
  { id: 'rounded', label: 'Rounded', icon: '🔲' },
  { id: 'none', label: 'Full', icon: '⬛' },
];

const SAMPLE_PHOTOS = [
  {
    id: 'sample-wedding-couple',
    label: 'Romantic Couple',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-outdoor-ceremony',
    label: 'Sunset Portrait',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-celebration-toast',
    label: 'Celebration Toast',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-birthday-friend',
    label: 'Birthday Glow',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
];

export function UploadsPanel({ onInsertPhoto }: UploadsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMask, setSelectedMask] = useState<MaskShape>('heart');
  const [stickerEffect, setStickerEffect] = useState<boolean>(true);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUserPhotos((prev) => [dataUrl, ...prev]);
        onInsertPhoto(dataUrl, selectedMask, stickerEffect);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] text-white p-4 space-y-4">
      {/* Mask Shape Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block">
            Photo Mask &amp; Keepsake Shape
          </label>
          <span className="text-[10px] text-[#B99A62] font-medium">
            {MASK_OPTIONS.find((m) => m.id === selectedMask)?.label}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {MASK_OPTIONS.map((mask) => (
            <button
              key={mask.id}
              onClick={() => setSelectedMask(mask.id)}
              className={`py-2 px-1 rounded-lg text-[11px] font-medium border flex flex-col items-center gap-1 transition-all ${
                selectedMask === mask.id
                  ? 'border-[#B99A62] bg-[#B99A62]/20 text-white font-semibold shadow-xs'
                  : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={mask.label}
            >
              <span className="text-sm">{mask.icon}</span>
              <span className="text-[9px] truncate max-w-full">{mask.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Die-Cut Vinyl Sticker Border Toggle */}
      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
            <span>✨ Vinyl Sticker Border</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#B99A62]/20 text-[#B99A62] font-mono">
              3D DIE-CUT
            </span>
          </span>
          <span className="text-[10px] text-white/50">
            Physical white border + keepsake drop shadow
          </span>
        </div>
        <button
          type="button"
          onClick={() => setStickerEffect(!stickerEffect)}
          className={`w-9 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ${
            stickerEffect ? 'bg-[#B99A62]' : 'bg-white/20'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              stickerEffect ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/20 hover:border-[#B99A62] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.05]"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <UploadCloud size={28} className="mx-auto text-[#B99A62] mb-2" />
        <span className="text-xs font-semibold text-white block">
          {isUploading ? 'Loading photo...' : 'Upload your photo'}
        </span>
        <span className="text-[10px] text-white/40 block mt-1">
          JPG, PNG or WebP · High resolution
        </span>
      </div>

      {/* User Uploads Gallery */}
      {userPhotos.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
            Your Uploads
          </label>
          <div className="grid grid-cols-2 gap-2">
            {userPhotos.map((photo, i) => (
              <div
                key={i}
                onClick={() => onInsertPhoto(photo, selectedMask, stickerEffect)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[#B99A62] cursor-pointer"
              >
                <img src={photo} alt="Upload" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Plus size={18} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Starters */}
      <div className="flex-1 overflow-y-auto">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
          Sample Celebratory Photos
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_PHOTOS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onInsertPhoto(sample.url, selectedMask, stickerEffect)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-[#B99A62] cursor-pointer transition-all hover:scale-[1.02]"
              title={`Click to add ${sample.label}`}
            >
              <img
                src={sample.url}
                alt={sample.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[10px] text-white/90 truncate font-medium">
                  {sample.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
