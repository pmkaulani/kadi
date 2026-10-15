import type { AnimationControls, Transition } from 'framer-motion';
import type { LetterFormat } from '../types';

export const PHYSICAL_EASE = [0.22, 1, 0.36, 1] as const;
export const WEIGHTED_EASE = [0.7, 0, 0.2, 1] as const;

const beat = (duration: number, ease: any = PHYSICAL_EASE): Transition => ({ duration, ease });

/** Beat 1: the wax compresses, catches the light, then rebounds into tension. */
export async function pressWaxSeal(seal: AnimationControls, envelope: AnimationControls) {
  await Promise.all([
    seal.start({ scale: 0.79, y: 2, rotate: -3, filter: 'brightness(0.88)', transition: beat(0.22, WEIGHTED_EASE) }),
    envelope.start({ y: 2, scale: 0.995, transition: beat(0.22, WEIGHTED_EASE) }),
  ]);
  await Promise.all([
    seal.start({ scale: 1.08, y: -1, rotate: 2, filter: 'brightness(1.07)', transition: beat(0.19) }),
    envelope.start({ y: 0, scale: 1, transition: beat(0.28) }),
  ]);
}

/** Beat 2: seal-release highlight and lift; avoid generic confetti. */
export async function breakWaxSeal(seal: AnimationControls) {
  await seal.start({ scale: 0.62, rotate: -9, y: -7, opacity: 0, filter: 'brightness(1.3)', transition: beat(0.26, WEIGHTED_EASE) });
}

/** Beat 3: rotate about the upper hinge so the inside flap face becomes visible. */
export async function openHingedFlap(flap: AnimationControls) {
  await flap.start({ rotateX: -178, z: -6, transition: { duration: 0.72, ease: WEIGHTED_EASE } });
}

/** Beat 4a: make the liner readable before the inserts begin moving. */
export async function revealEnvelopeLiner(liner: AnimationControls) {
  await liner.start({ opacity: 1, y: 0, transition: beat(0.28) });
}

/** Beat 4b: the two inserts travel with different angles, delays and travel distances. */
export async function raisePaperInserts(first: AnimationControls, second: AnimationControls) {
  await Promise.all([
    first.start({ y: '-14%', rotate: -5.2, opacity: 1, transition: { duration: 0.44, ease: PHYSICAL_EASE } }),
    second.start({ y: '-23%', rotate: 4.1, opacity: 1, transition: { duration: 0.58, delay: 0.08, ease: PHYSICAL_EASE } }),
  ]);
}

/** Beat 5: lift the main invitation while its lower edge stays nested in the pocket. */
export async function raiseInvitationCard(letter: AnimationControls) {
  await letter.start({ y: '-37%', rotate: -1.1, scale: 1.015, opacity: 1, transition: { duration: 0.66, ease: PHYSICAL_EASE } });
}

/** Beat 6: folded cards get a visible crease movement; flat sheets settle instead. */
export async function unfoldInvitationCard(letter: AnimationControls, inner: AnimationControls, format: LetterFormat) {
  if (format === 'folded-card') {
    await inner.start({ rotateY: -170, scaleX: 0.99, transition: { duration: 0.62, ease: PHYSICAL_EASE } });
  } else {
    await letter.start({ y: '-40%', rotate: 0, scale: 1.02, transition: beat(0.24) });
  }
}

/** Beat 7: the envelope world dims and scales slightly into the real invitation page. */
export async function handoffToInvitation(stage: AnimationControls) {
  await stage.start({ opacity: 0, scale: 1.025, y: -8, transition: { duration: 0.42, ease: WEIGHTED_EASE } });
}

/** Reduced motion / skip action: stop movement and reveal all useful content immediately. */
export function skipPhysicalOpening(controls: AnimationControls[]) {
  controls.forEach((control) => control.stop());
}

export type PhysicalOpeningControls = {
  stage: AnimationControls;
  envelope: AnimationControls;
  seal: AnimationControls;
  flap: AnimationControls;
  liner: AnimationControls;
  firstInsert: AnimationControls;
  secondInsert: AnimationControls;
  letter: AnimationControls;
  innerLetter: AnimationControls;
};

/** Reset targets after replay so a completed fade/flap cannot leak into the next run. */
export function resetPhysicalOpening(controls: PhysicalOpeningControls, format: LetterFormat = 'printed') {
  skipPhysicalOpening(Object.values(controls));
  controls.stage.set({ opacity: 1, scale: 1, y: 0 });
  controls.envelope.set({ y: 0, scale: 1 });
  controls.seal.set({ scale: 1, opacity: 1, rotate: 0, y: 0, filter: 'brightness(1)' });
  controls.flap.set({ rotateX: 0, z: 0 });
  controls.liner.set({ opacity: 0, y: 6 });
  controls.firstInsert.set({ y: '3%', rotate: -2, opacity: 0 });
  controls.secondInsert.set({ y: '5%', rotate: 2, opacity: 0 });
  controls.letter.set({ y: '7%', rotate: 0, scale: 0.97, opacity: 0 });
  controls.innerLetter.set({ rotateY: 0, scaleX: format === 'folded-card' ? 0.97 : 1 });
}
