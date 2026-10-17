'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Plus, Check } from 'lucide-react';
import type { MaskShape } from '@/types/canvas';

interface UploadsPanelProps {
  onInsertPhoto: (photoUrl: string, maskShape: MaskShape) => void;
}

const SAMPLE_PHOTOS = [
  {
    id: 'sample-wedding-couple',
    label: 'Couple Portrait',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-outdoor-ceremony',
    label: 'Romantic Landscape',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-celebration-toast',
    label: 'Celebration Toast',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-birthday-friend',
    label: 'Birthday Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
];

export function UploadsPanel({ onInsertPhoto }: UploadsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMask, setSelectedMask] = useState<MaskShape>('oval');
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
        onInsertPhoto(dataUrl, selectedMask);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] text-white p-4 space-y-4">
      {/* Mask Shape Selector */}
      <div>
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
          Photo Mask &amp; Frame Shape
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'oval' as MaskShape, label: 'Oval' },
            { id: 'circle' as MaskShape, label: 'Circle' },
            { id: 'rounded' as MaskShape, label: 'Rounded' },
            { id: 'none' as MaskShape, label: 'Full' },
          ].map((mask) => (
            <button
              key={mask.id}
              onClick={() => setSelectedMask(mask.id)}
              className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                selectedMask === mask.id
                  ? 'border-[#B99A62] bg-[#B99A62]/20 text-white font-semibold'
                  : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {mask.label}
            </button>
          ))}
        </div>
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
                onClick={() => onInsertPhoto(photo, selectedMask)}
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
              onClick={() => onInsertPhoto(sample.url, selectedMask)}
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
