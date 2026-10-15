# Kadi design system — implementation spec

## Product-level visual hierarchy

- **Public marketing:** editorial, emotionally resonant, immersive but restrained; full-bleed imagery with clear CTA and high-quality section rhythm.
- **Authenticated workspace:** tool-first clarity, consistent shared shell, neutral surfaces, dense enough to manage events but never cramped.
- **Invitation guest view:** expressive, highly designed page specific to occasion and host; not locked to the workspace's neutral palette.
- **Invitation editor:** functional controls and truthful live preview, no mock poster.

## Tokens

Use CSS custom properties as the source of truth. Existing Kadi accent should be kept/reconciled rather than replaced by separate accent palettes on each route. Suggested base:

```css
:root {
  --kadi-bg: #FAFAF7;
  --kadi-surface: #FFFFFF;
  --kadi-surface-muted: #F2F1EC;
  --kadi-ink: #1D1D1F;
  --kadi-ink-secondary: #6E6E73;
  --kadi-line: rgba(29, 29, 31, .12);
  --kadi-accent: #794A32;
  --kadi-accent-hover: #663C28;
  --kadi-accent-soft: #F3EAE2;
  --kadi-gold: #B99A62;
  --kadi-success: #286A4B;
  --kadi-warning: #8A5A17;
  --kadi-danger: #B3261E;
  --kadi-radius-sm: 12px;
  --kadi-radius-md: 16px;
  --kadi-radius-lg: 24px;
  --kadi-radius-pill: 999px;
  --kadi-shadow-card: 0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.045);
  --kadi-shadow-float: 0 12px 40px rgba(0,0,0,.12);
  --kadi-ease: cubic-bezier(.32,.72,0,1);
  --kadi-fast: 140ms;
  --kadi-medium: 240ms;
  --kadi-slow: 360ms;
}
```

Do not sprinkle hardcoded values into every component once tokens exist. Audit `globals.css` for current tokens and merge thoughtfully. Use four principal radii at most; keep card borders faint and shadows consistent. Don't make every section a card.

## Type scale

- Display hero: `clamp(2.5rem, 5.3vw, 5.4rem)`, compact line-height ~0.98–1.08, tight tracking.
- Page title: `clamp(1.8rem, 3vw, 2.75rem)`.
- Section title: `clamp(1.5rem, 2.5vw, 2.25rem)`.
- Card title: 18–24px.
- Body: 15–17px and 1.55–1.7 line-height.
- Small metadata: 12–14px; never use microtext for essential information.
- Use system font stack and Inter if already local/configured; invitation title fonts are theme-specific and should not leak into the app shell.

## Spacing & controls

Use 4, 8, 12, 16, 24, 32, 48, 64, 80/96 px scale. Buttons and controls minimum 44px high (prefer 48px for primary/touch actions). Strong primary action; secondary outlined/text actions. Visible `:focus-visible`, hover, active (`scale(.98)`/subtle color, not everywhere), disabled, loading, invalid and successful states. Avoid gradients on primary buttons.

## Motion

Motion must communicate cause/effect. UI transitions typically 160–280ms; scene/envelope transitions can be 2–3 seconds when explicitly invoked. Use Framer Motion already installed; avoid adding another competing animation system. Never block page access while decorative animation finishes. `prefers-reduced-motion: reduce` skips or simplifies all motion, and user can skip the envelope.

## App consistency

Same nav height, content max-width, title rows, action alignment, input heights, focus states, tabs, table styling, empty/loading/error patterns throughout `/app/**`. Public page can have its own section art direction but should share logo, type foundation, buttons and accent semantics. Invitation themes are data-driven.
