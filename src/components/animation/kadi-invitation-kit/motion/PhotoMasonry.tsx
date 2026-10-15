'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { GalleryImage } from '../types';
import { MaskReveal } from './MaskReveal';

type Props = {
  images: GalleryImage[];
  className?: string;
  onImageClick?: (image: GalleryImage, index: number) => void;
  /** Use a real event gallery; do not substitute stock photos for a published invite. */
  interactive?: boolean;
};

const rotation = [-2.1, 1.4, -0.8, 2.2, -1.2, 0.7, 1.7, -1.5];

export function PhotoMasonry({ images, className, onImageClick, interactive = false }: Props) {
  const reduced = useReducedMotion() === true;
  return (
    <div className={`ke-photo-masonry ${className ?? ''}`}>
      {images.map((image, index) => {
        const Wrapper = interactive ? motion.button : motion.figure;
        const clickProps = interactive ? { type: 'button' as const, onClick: () => onImageClick?.(image, index), 'aria-label': image.caption ? `Open photo: ${image.caption}` : `Open photo ${index + 1}` } : {};
        return (
          <Wrapper
            key={`${image.src}-${index}`}
            className={`ke-photo-masonry__item ke-photo-masonry__item--${image.shape ?? (index % 3 === 0 ? 'portrait' : index % 3 === 1 ? 'landscape' : 'square')} ke-photo-masonry__item--n${index % 4}`}
            style={{ rotate: reduced ? 0 : rotation[index % rotation.length] }}
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={reduced ? { duration: 0 } : { duration: 0.7, delay: Math.min(index * 0.055, 0.33), ease: [0.22, 1, 0.36, 1] }}
            {...(clickProps as object)}
          >
            <MaskReveal direction={index % 2 ? 'up' : 'diagonal'} duration={0.8}>
              <div className="relative w-full h-full min-h-[220px] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt || 'Event gallery photo'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </MaskReveal>
            {image.caption && (interactive ? <span className="ke-photo-masonry__caption">{image.caption}</span> : <figcaption>{image.caption}</figcaption>)}
          </Wrapper>
        );
      })}
    </div>
  );
}

export default PhotoMasonry;
