# Mobile Experience, Responsive Imagery, Performance & Accessibility Specification

This document defines the core architecture, testing targets, responsive design standards, performance rules, and accessibility (WCAG 2.1 AA) compliance across all public and authenticated workspace routes of Kadi.

---

## 1. Viewport Testing Matrix & Breakpoints

Kadi interfaces are designed and tested across eleven standard viewports:

| Device Class | Viewport (W × H) | DPR | Description |
| :--- | :--- | :--- | :--- |
| **Ultra-Compact Phone** | `320 × 568` | 2.0 | iPhone SE (1st gen) / Compact Android. Strict fold height & text wrapping. |
| **Standard Android** | `360 × 800` | 3.0 | Modern Samsung Galaxy / Pixel entry devices. Standard 9:20 ratio. |
| **Legacy Compact iOS** | `375 × 667` | 2.0 | iPhone 6/7/8/SE (2nd/3rd gen). Standard 9:16 mobile ratio. |
| **Modern iOS Standard** | `390 × 844` | 3.0 | iPhone 12/13/14. High-DPI modern iOS benchmark. |
| **Modern Dynamic Island** | `393 × 852` | 3.0 | iPhone 14 Pro / 15 / 16. Dynamic island top inset & rounded bezel. |
| **Large Phablet / Max** | `430 × 932` | 3.0 | iPhone 14/15/16 Pro Max / Galaxy S24 Ultra. Wide single-column view. |
| **Portrait Tablet** | `768 × 1024` | 2.0 | iPad Mini / Air (Portrait). 2-column transition boundary. |
| **Landscape Tablet** | `1024 × 768` | 2.0 | iPad Air / Pro (Landscape). Compact desktop layout with sidebar. |
| **Compact Laptop** | `1280 × 800` | 1.0/2.0 | 13-inch MacBook / Chromebook / WXGA display. |
| **Standard Desktop** | `1440 × 900` | 2.0 | Standard 14/15-inch Retina laptop. Canonical desktop baseline. |
| **FHD Widescreen** | `1920 × 1080` | 1.0 | 1080p Desktop monitor. Broad container max-width constraints. |

### Layout Rules Across Breakpoints:
1. **Zero Horizontal Overflow**: No horizontal scrollbars or side overflow are permitted on any route at any viewport down to 320px width (`overflow-x: hidden` / `overflow: clip` on viewport roots, container max-widths with responsive margins).
2. **Above-the-Fold Hero (Mobile)**: On viewports `<= 767px` and short heights `<= 640px`, the homepage hero deliberately rearranges into a single column with tailored typographic scales (`clamp(1.95rem, 7.7vh, 2.8rem)`), ensuring the heading, primary CTA ("Explore templates"), and occasion indicators remain fully above the fold without requiring a scroll down.
3. **Safe-Area Insets**: All fixed toolbars and bottom sheets account for hardware insets via `calc(base + env(safe-area-inset-bottom))` and `calc(base + env(safe-area-inset-top))`.

---

## 2. Responsive Imagery & Performance

Kadi uses Next.js `next/image` to serve optimized WebP/AVIF images with stable layouts and zero cumulative layout shift (CLS).

### 2.1 Next.js Image Conventions
- **Explicit Aspect Ratios & Fill Layouts**: Parent containers enforce explicit aspect ratios (`aspect-[4/3]`, `aspect-square`, `aspect-[16/10]`) or fixed dimensions with `relative overflow-hidden`, allowing `<Image fill sizes="..." />` to avoid layout shift.
- **Accurate `sizes` Attribute**: Every `fill` image defines an accurate `sizes` string reflecting its rendered column widths across media breakpoints:
  - Full-width hero: `sizes="100vw"`
  - Three-column grid: `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
  - Touch rail tiles: `sizes="(max-width: 640px) 132px, 164px"`
  - Small avatars / thumbnails: `sizes="48px"` or `sizes="32px"`
- **Priority & LCP (Largest Contentful Paint)**:
  - Hero carousel first slide (`index === 0`) is explicitly flagged with `priority={true}` and `loading="eager"`.
  - All below-the-fold catalog cards, masonry photos, and timeline milestone images use default lazy loading (`loading="lazy"`).
- **Remote Host Configuration**:
  - `next.config.js` configures `images.remotePatterns` for `https://**` and explicit domains (`images.unsplash.com`, `localhost`) with support for arbitrary high-resolution uncompressed asset sources.
- **Alt Text & Decorative Fallbacks**:
  - Informative images provide meaningful contextual descriptions (e.g. `"Savannah Acacia invitation suite for weddings"`).
  - Purely decorative backgrounds and framing textures have empty `alt=""` and `aria-hidden="true"`.

---

## 3. Mobile Navigation & Workspace Ergonomics

### 3.1 Single Unified Navigation Paradigm
- **Mobile (`< 768px`)**:
  - Desktop sidebar is hidden (`hidden md:flex`).
  - Fixed bottom navigation bar (`WorkspaceBottomNav`) renders 5 ergonomic touch destinations: **Home**, **Invitations**, **Center FAB (Create +)**, **Guests**, and **Profile**.
  - Obeying `env(safe-area-inset-bottom)`, the bar is elevated above home-indicator gestures.
  - Page bodies enforce bottom padding `pb-28 sm:pb-8` (and `.kadi-app-shell main` enforces `padding-bottom: calc(5.8rem + env(safe-area-inset-bottom)) !important`) so primary submit buttons and content are never obscured.
- **Desktop (`>= 768px`)**:
  - Fixed 250px dark sidebar (`#111815`) with botanical decor and persistent workspace navigation.
  - Top navigation bar provides search, live notifications, user profile menu, and primary creation CTA.

### 3.2 Responsive Lists vs. Compressed Tables
- Multi-column data tables (Guest Households, RSVP responses, attendee headcounts) degrade poorly when squeezed into 320px–390px screens.
- **Standardized Adaptive Pattern**:
  - Viewports `>= 640px`: Full data table (`hidden sm:block`) with column sorting, badges, contact metadata, and inline actions.
  - Viewports `< 640px`: Stacked card rows (`sm:hidden`) displaying the guest name prominently, group badge, RSVP status pill, headcount, and large 44px tap targets for copying private invitation links or viewing details.

### 3.3 Studio Editor Mobile Experience
- **Edit / Preview Tabs**:
  - On viewports `< 1024px`, the editor provides an accessible segmented switch between **Edit** (accordion controls for details, blocks, palette, typography, envelope) and **Preview** (live guest unsealing canvas).
  - The control drawer and preview stage occupy 100% viewport width without lateral cramped scrolling.
- **Preview Isolation & Scroll Trapping Prevention**:
  - The preview canvas scrolls internally without capturing parent page navigation.
  - Device frames (iPhone / Android / Desktop) fit smoothly within the viewport.
  - Floating status pill ("All changes saved", "Saving…") is positioned safely at the top without occluding inputs.

### 3.4 Dialogs, Bottom Sheets & Modals
- Built-in `Modal` component enforces:
  - **Body Scroll Locking**: `document.body.style.overflow = 'hidden'` on open; reset on close.
  - **Focus Trap & Return**: Remembers the trigger element (`document.activeElement`) and restores focus on dismissal.
  - **Keyboard Esc**: Closes on `Escape` key press.
  - **Safe-Area Accommodations**: `max-h-[calc(100dvh-2rem)]` and vertical auto-scrolling ensure form submit buttons remain visible when virtual keyboards appear.

---

## 4. Accessibility (WCAG 2.1 AA) Compliance

### 4.1 Focus Rings & Keyboard Navigation
- Interactive elements possess visible focus outlines: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#934638] focus-visible:ring-offset-2`.
- Skip-to-content links and natural tab order throughout public headers, template filters, and workspace sidebars.
- Modal dialogs have `role="dialog"` and `aria-modal="true"`.

### 4.2 Non-Visual Accessible Names
- Icon-only buttons (search clear, carousel advance, modal close, envelope audio toggles) define descriptive `aria-label` attributes.
- Segmented switches declare `aria-pressed` or `aria-current`.
- Form inputs have associated `<label>` tags or `aria-label` attributes. Form error states provide `role="alert"` announcements.

### 4.3 Reduced Motion (`prefers-reduced-motion: reduce`)
- Framer-motion components inspect `useReducedMotion()`. When active:
  - Durations snap to `0s`.
  - Spring translations (`y: 20px`, `rotate: -2deg`) are disabled.
  - Auto-advancing carousels and background loops (`HeroBackdropCarousel`, `KadiFullViewportHero`) immediately pause timers.
  - Envelope opening renders in an instantly readable unsealed state.

### 4.4 Color Contrast Standards
- Primary text (`#272620` on `#F6F2EA` or `#FFFFFF`): Contrast ratio exceeds `12.5:1` (far above the 4.5:1 requirement).
- Muted secondary text (`#60584D` / `#756F64`): Contrast ratio exceeds `5.8:1`.
- Brand accent button (`#794a32` / `#934638` with white text): Contrast ratio exceeds `5.2:1`.
- Dark sidebar (`#c8cbc4` on `#111815`): Contrast ratio exceeds `8.1:1`.

### 4.5 200% Zoom & Reflow
- Fluid type scales and container max-widths allow full 200% browser scaling without horizontal scrollbars or truncated critical actions.

---

## 5. Animation, Memory & Throttled Mobile Performance

1. **IntersectionObserver Cleanup**: All scroll-triggered reveals (`[data-kr-reveal]`, `PhotoMasonry`) unobserve nodes once triggered and cleanly disconnect observers on component unmount.
2. **Timer Cleanup**: All `setInterval` and `setTimeout` calls within carousels, toasts, and STK-push simulations are paired with cleanup functions in `useEffect`.
3. **No Heavy Third-Party Animation Libraries**: Animations leverage hardware-accelerated CSS transforms/opacity and Framer Motion with tree-shaken imports.
