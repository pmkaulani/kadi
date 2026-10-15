# Implementation status — Kadi video-reference starter

## Included in this source package

- A reusable invitation experience component with a closed/opening/revealed interaction sequence and skip/replay support.
- Four art-directed experience themes: ruby disco, gift-led birthday, pastel garden and sage love letter, plus dignified memorial mode.
- CSS for envelope flap, card rise, themed stationery, floral/party ornaments, photo collage, gallery, music/record motif, detail sections and responsive behavior.
- Template catalogue entries and `experienceTheme` metadata for the four new visual worlds.
- Optional gallery images and milestone-age metadata in event/template types and seeded demo records.
- Public invitation route no longer overlays the closed envelope with a permanent SaaS-style share/RVSP toolbar. Event-specific map destinations derive from actual venue details when a direct URL is absent.
- Template-preview RSVP clearly says it is a preview and does not pretend to record a real response.
- Full video reference design spec and Antigravity master prompt.

## Checks run in this environment

- `npm run typecheck`: passed.
- `npm run lint`: passed with seven Next.js `<img>` optimization warnings in `EnvelopeRenderer.tsx`. These images are currently dynamic external URLs / demo media; the full media pipeline should migrate to a validated object-storage and responsive-image strategy.
- `npm test`: could not execute because the dependency tree restored from the uploaded archive had `@esbuild/aix-ppc64` rather than `@esbuild/linux-x64`.
- `npm run build`: could not finish because Next.js attempted to download `@next/swc-linux-x64-gnu`, but this environment could not resolve / reach `registry.npmjs.org`.

## Still needed for full platform / production launch

- Browser screenshot and interaction review at phone, tablet and desktop widths.
- Persistent PostgreSQL adapter and reviewed migrations; the current service layer includes in-memory seed data.
- A complete canvas-based invitation editor, media upload and crop pipeline, user-defined section ordering and draft autosave.
- Production authentication/session management and server-side authorization audits.
- Real provider configuration, verified webhooks and reconciliation for M-Pesa; approved templates / consent tracking and delivery webhook processing for direct WhatsApp; mail delivery, subscription billing and background job processing.
- Complete test suite after installing dependencies on the target Windows development machine.
- Review privacy, data protection, payment model and provider terms with qualified advisers before public launch.
