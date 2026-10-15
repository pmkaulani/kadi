import { useReducedMotion } from 'framer-motion';

/** Framer Motion's SSR-safe reduced-motion preference hook. */
export function useReducedMotionPreference(): boolean {
  return useReducedMotion() === true;
}
