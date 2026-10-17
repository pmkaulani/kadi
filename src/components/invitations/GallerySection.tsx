'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SectionIntro, GalleryLightbox } from '@/components/animation/MotionToolkit';
import { motion, useReducedMotion } from 'framer-motion';
import { Camera, Maximize2 } from 'lucide-react';

interface GallerySectionProps {
  images?: string[];
  title?: string;
  subtitle?: string;
  celebrants?: string;
}

export function GallerySection({
  images = [],
  title = 'Moments in Time',
  subtitle = 'A glimpse into the chapters and smiles that brought us here.',
  celebrants,
}: GallerySectionProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const validImages = images.filter((img): img is string => Boolean(img && img.trim()));
  if (validImages.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#FAF7F2] border-t border-[rgba(39,38,32,0.08)]">
      <div className="max-w-6xl mx-auto">
        <SectionIntro
          eyebrow="Photographs"
          title={title}
          subtitle={subtitle}
          accentColor="#934638"
        />

        {/* Dynamic mosaic layout based on image count */}
        {validImages.length === 1 && (
          <div className="max-w-3xl mx-auto overflow-hidden rounded-sm border border-[rgba(39,38,32,0.12)] shadow-md group relative aspect-[16/10] bg-[#DDD0BE]">
            <Image
              src={validImages[0]}
              alt={celebrants ? `${celebrants} portrait` : 'Gallery photograph'}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] cursor-pointer"
              onClick={() => setSelectedPhotoIndex(0)}
            />
            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(0)}
              aria-label="Enlarge photograph"
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-[#181312]/70 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        )}

        {validImages.length === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {validImages.map((src, idx) => (
              <motion.div
                key={src}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="overflow-hidden rounded-sm border border-[rgba(39,38,32,0.12)] bg-[#DDD0BE] shadow-sm relative group cursor-pointer aspect-[4/5]"
                onClick={() => setSelectedPhotoIndex(idx)}
              >
                <Image
                  src={src}
                  alt={celebrants ? `${celebrants} frame ${idx + 1}` : `Photograph ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181312]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-serif italic flex items-center gap-1.5">
                    <Camera size={13} /> Frame {idx + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {validImages.length >= 3 && (
          <div className="space-y-3 sm:space-y-4">
            {/* Grand Hero Photograph (Full Width, Cinematic & High-Impact) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-white p-2 border border-[#B99A62]/35 shadow-md group relative cursor-pointer"
              onClick={() => setSelectedPhotoIndex(0)}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#DDD0BE]">
                <Image
                  src={validImages[0].replace('photo-1586075010923-2dd4570fb338', 'photo-1519741497674-611481863552')}
                  alt={celebrants ? `${celebrants} featured photograph` : 'Featured celebration photo'}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 960px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-widest text-white font-medium flex items-center gap-1.5">
                  <Camera size={12} className="text-[#B99A62]" />
                  <span>Featured Moment</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#181312]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <span className="text-white text-xs font-serif italic tracking-wide">
                    {celebrants ? `Celebration with ${celebrants}` : 'Featured Moment'}
                  </span>
                  <span className="p-1.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                    <Maximize2 size={14} />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Paired Curated Duo Grid (Side-by-Side with Elegant White Matting & Subtle Tilt) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {validImages.slice(1).map((src, idx) => {
                const actualIdx = idx + 1;
                const tiltClass = idx % 2 === 0 ? '-rotate-1 hover:rotate-0' : 'rotate-1 hover:rotate-0';
                const cleanSrc = src.replace('photo-1586075010923-2dd4570fb338', 'photo-1519741497674-611481863552');
                return (
                  <motion.div
                    key={`${src}-${actualIdx}`}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: actualIdx * 0.1 }}
                    className={`group cursor-pointer transition-all duration-300 transform ${tiltClass} bg-white p-2 rounded-2xl border border-[rgba(185,154,98,0.3)] shadow-xs hover:shadow-md hover:scale-[1.02]`}
                    onClick={() => setSelectedPhotoIndex(actualIdx)}
                  >
                    <div className="relative aspect-[4/5] sm:aspect-square rounded-xl overflow-hidden bg-[#FAF8F5]">
                      <Image
                        src={cleanSrc}
                        alt={celebrants ? `${celebrants} memory ${actualIdx + 1}` : `Photograph ${actualIdx + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 360px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={12} />
                      </div>
                    </div>
                    <p className="mt-2 text-center text-[11px] font-serif italic text-[#756F64] truncate px-1">
                      Frame {actualIdx + 1}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery Lightbox */}
        {selectedPhotoIndex !== null && (
          <GalleryLightbox
            photos={validImages}
            selectedIndex={selectedPhotoIndex}
            onClose={() => setSelectedPhotoIndex(null)}
            onSelectIndex={(idx) => setSelectedPhotoIndex(idx)}
          />
        )}
      </div>
    </section>
  );
}

export default GallerySection;
