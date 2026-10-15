# Integrate the existing PublicNavbar as a landing-page variant

Do not make a second navigation component. Keep all links and mobile-menu behavior in `src/components/layout/PublicNavbar.tsx` and let it accept one optional prop:

```tsx
export function PublicNavbar({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  // Keep all existing state, links, click handlers and markup.
  // Replace only the header's root className with:
  const headerClassName = variant === 'hero'
    ? 'kadi-public-navbar kadi-public-navbar--hero relative z-50'
    : 'kadi-public-navbar relative z-50 bg-[#F6F2EA] border-b border-[rgba(39,38,32,.15)]';
  // ...then use <header className={headerClassName}>.
  // For the home variant, also render <Logo size="md" variant="monochrome" />
  // so the mark uses currentColor and is legible on the dark hero.
}
```

Call `<PublicNavbar variant="hero" />` inside `.kadi-home-nav`. Keep `<PublicNavbar />` on all other public pages. Move hardcoded text colors to semantic classes or add the `.kadi-public-navbar--hero` rules to `kadi-viewport-hero.css`; do not duplicate links or menu state.
