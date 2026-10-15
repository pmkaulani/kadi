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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {validImages.map((src, idx) => {
              // Asymmetric editorial mosaic styling
              const isHero = idx === 0 && validImages.length >= 4;
              return (
                <motion.div
                  key={`${src}-${idx}`}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (idx % 3) * 0.12 }}
                  className={`overflow-hidden rounded-sm border border-[rgba(39,38,32,0.12)] bg-[#DDD0BE] shadow-sm relative group cursor-pointer ${
                    isHero ? 'sm:col-span-2 aspect-[16/10]' : idx % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'
                  }`}
                  onClick={() => setSelectedPhotoIndex(idx)}
                >
                  <Image
                    src={src}
                    alt={celebrants ? `${celebrants} memory ${idx + 1}` : `Photograph ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181312]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                    <span className="text-white text-xs font-serif italic tracking-wide">
                      {idx === 0 ? 'Featured' : `Memory ${idx + 1}`}
                    </span>
                    <span className="p-1.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                      <Maximize2 size={13} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
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
