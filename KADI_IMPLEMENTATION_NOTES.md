# Kadi Implementation & Architecture Baseline Notes (V2 Redesign)

**Document Version:** 2.0.0  
**Date:** October 17, 2026  
**Auditor / Architect:** Antigravity Senior Engineering Team  

---

## 1. Executive Summary & Audit Baseline

Kadi is transitioning from a traditional form-and-accordion builder into a creative **Canva-like digital invitation studio** with interactive guest-facing invitations (stationery envelope reveal, RSVP, and event sections) inspired by `kadi-gallery-reference.png`.

### Verification Status at Baseline
- **Automated Tests:** 133/133 tests passing (`npm test`, 123 subtests across 13 test suites).
- **Type Checking:** 0 errors (`npx tsc --noEmit`).
- **Dev Server:** Active and stable on port 3005.

---

## 2. Capability Inventory

| Capability / Route | Current State | Decision & Target Treatment |
|---|---|---|
| **Public Landing (`/`)** | Traditional SaaS hero slider + 8 marketing sections (`KadiReferenceLanding`) | **Refactor:** Replace first viewport with animated moving invitation gallery on deep teal (`#112327` / `#162E33`). Direct click-to-edit without registration wall. Subtle "Start blank" and quiet "Find my drafts / Sign in". |
| **Studio Editor (`/app/events/new`, `/app/events/[id]`)** | Form accordions + phone frame preview (`KadiStudioEditor`) | **Refactor & Upgrade:** Implement central direct-manipulation canvas with independent Text, Transparent Cutout Stickers, User Photos, and Shapes. Professional selection UX (§5.3.1) with no square bounding tiles, contextual floating toolbars, Layers panel, and undo/redo. |
| **Stationery & Envelope (`EnvelopeRenderer`)** | Opening animation, wax seal, liner, music, closing card | **Preserve & Enhance:** Maintain calibrated physics, fix any flap clipping, preserve monogram stationery closing card and responsive audio toggle. |
| **Guest View (`/e/[slug]`)** | Envelope open + scrolling sections (RSVP, Countdown, Venue, Gallery, Registry) | **Preserve & Ensure Parity:** Must render canvas elements identically to editor preview without editing chrome or handles. Keep frictionless anonymous guest RSVP. |
| **Template Catalogue (`src/lib/templates/catalogue.ts`)** | 23 canonical occasion templates with palettes and section defaults | **Preserve & Enhance:** Retain all 23 templates for test compatibility; enhance each with default structured canvas elements (`elements[]`). |
| **Anonymous Drafts & Claiming** | LocalStorage draft hooks + authenticated `EventService` | **Enhance:** Seamless anonymous session storage with claiming hook on auth so user drafts attach without slug breakage or duplicate records. |
| **Event Management (`/app/events`, RSVP exports)** | Working guest lists, CSV exports, M-Pesa sandbox, status machines | **Preserve:** Keep operational dashboards intact behind login; do not expose SaaS clutter to first-time public creators. |

---

## 3. Keep, Refactor, and Remove Decisions

### A. What We Keep
1. **Database & Services:** `mock-db.ts`, `EventService`, `GuestService`, `RSVPService`, and memory adapters.
2. **Security & Formulas:** CSV formula injection neutralization (`=`, `+`, `-`, `@`), rate limiting, token hashing, and route security.
3. **Kenya-First Integrations:** Kenyan phone number formatting (`+254`), EAT / Africa-Nairobi time zone handling, KES currency formatting, M-Pesa payment validation, and WhatsApp sharing.
4. **All 23 Canonical Templates:** Keep existing IDs, metadata, and test assertions intact.

### B. What We Refactor
1. **Public Landing Experience:** Convert from marketing-first to visual creation-first. The animated gallery is the hero.
2. **Canvas Selection & Manipulation Engine:** Full compliance with §5.3.1:
   - Genuine alpha silhouettes for stickers with no visible square backgrounds.
   - High-contrast 1.5–2px selection outline with no-fill geometric transform frame.
   - 4 corner resize handles + dedicated top rotation handle with connector line.
   - Floating contextual toolbar that repositions dynamically to stay in viewport.
   - Mobile bottom sheet fallback for compact touch editing.
   - Layers / Outline drawer for selecting covered/overlapping objects.
   - Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Delete, Ctrl+D) and non-drag nudging (WCAG 2.2 SC 2.5.7).
3. **Sticker Asset Library:** Curated transparent SVG/PNG elements organized by occasion (Botanicals, Birthday, Wedding, Celebration, Baby Shower, Graduation, Memorial).

### C. What We Avoid / Remove from Primary Surface
1. **Mandatory Setup Wizards:** No long forms or registration popups before seeing the canvas.
2. **Stock Face Templates:** Default templates focus on illustrated botanical, floral, typographic, and celebratory compositions.
3. **Square Art Clipart:** No white or solid background tiles on decorative stickers.

---

## 4. Document Model Evolution (§12)

The `InvitationDesign` and draft state are expanded backward-compatibly:
```ts
export interface CanvasElement {
  id: string;
  type: 'text' | 'sticker' | 'photo' | 'shape';
  content?: string;        // Text content or asset URL
  x: number;               // Normalized 0-100 or canvas px
  y: number;               // Normalized 0-100 or canvas px
  width: number;           // Width in px
  height: number;          // Height in px
  rotation: number;        // Degrees 0-360
  zIndex: number;          // Stacking order
  opacity: number;         // 0 to 1
  isLocked?: boolean;
  styleProps?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
    maskShape?: 'none' | 'circle' | 'oval' | 'rounded';
    borderRadius?: number;
    filter?: string;
  };
  animation?: {
    effect: 'none' | 'fadeIn' | 'rise' | 'gentleScale' | 'drift' | 'sway' | 'sparkle';
    duration?: number;
    delay?: number;
  };
  accessibilityLabel?: string;
}
```

---

## 5. Implementation Roadmap

- **Phase 0:** Audit & baseline notes (Complete).
- **Phase 1:** Moving invitation gallery landing page with direct click-to-create.
- **Phase 2:** Freeform Canvas Studio Editor with professional selection UX (§5.3.1).
- **Phase 3:** Transparent sticker asset library & template composition enrichment.
- **Phase 4:** Photo upload with non-destructive masking/crop.
- **Phase 5:** Guest preview & published slug parity.
- **Phase 6:** Anonymous draft claiming & validation test suite pass.
