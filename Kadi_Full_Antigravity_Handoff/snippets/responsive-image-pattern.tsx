import Image from 'next/image';

type ResponsiveEventImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  position?: string;
  sizes?: string;
  className?: string;
};

/** Example only: remote image domains must be allowlisted in next.config.js. */
export function ResponsiveEventImage({
  src, alt, priority = false,
  position = '50% 50%',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw',
  className = '',
}: ResponsiveEventImageProps) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`} style={{ aspectRatio: '4 / 5' }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
