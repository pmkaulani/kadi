# Kadi — Video-reference implementation starter

This source package extends the Kadi Next.js application with four distinct, mobile-first invitation experiences derived from the four videos supplied for the project. The visual and interaction requirements are written down in `docs/VIDEO_REFERENCE_SPEC.md`; the full platform build instructions are in `Kadi_Antigravity_Master_Prompt.txt`.

## Read these first

1. `docs/VIDEO_REFERENCE_SPEC.md` — the four exact visual worlds and interaction sequence.
2. `Kadi_Antigravity_Master_Prompt.txt` — the master prompt for Antigravity to continue building the platform.
3. `docs/DESIGN_DIRECTION.md` — design rules and anti-patterns.
4. `docs/KADI_PLATFORM_BLUEPRINT.md` and `Kadi_Technical_Snippets_and_Original_Database_Schema.md` — platform scope and earlier technical source material.
5. `docs/IMPLEMENTATION_STATUS.md` — what is implemented versus still a prototype / integration prerequisite.

## Video-inspired invitation themes

- **Ruby Disco:** red-framed, star/disco-ball birthday invitation with a bold age reveal and party details.
- **These Are for You:** gift-led birthday experience with interactive message / flower / cake items, collage imagery and a record motif.
- **Pastel Garden Party:** blush botanical birthday invitation with a hand-drawn garden arch and sage details section.
- **The Sage Love Letter:** botanical wedding experience with an envelope reveal, a photographic cover, venue/map, gallery and long-form sections.
- **Memorial mode:** quiet botanical and remembrance experience without party effects.

Existing template IDs are retained for compatibility. Open `/templates` and select a design to preview the opening. Demo event links include `/e/kevin-and-wanjiku`, `/e/maina-50`, and `/e/mama-sarah-wambui`. These are seeded local examples, not production data.

## Local development

Requirements: Node.js 20+ and npm. Dependencies are intentionally excluded from this ZIP to avoid carrying platform-specific binaries. On your own Windows machine, extract the ZIP, open the project folder in a terminal, and run:

```powershell
npm ci
npm run dev
```

The app uses port `3005`. Open `http://localhost:3005`. To check the project:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

## Important status notes

- The video-specific envelope, page compositions and theme variants are implemented in source code, along with changes to the public invitation flow and new template entries.
- This project still includes an in-memory demo database. Do not assume multi-user production persistence or production authentication from the presence of app routes.
- Live M-Pesa collection/payouts, direct WhatsApp Cloud API messaging, production email delivery and subscription billing require provider configuration, legal / operational decisions, tests and credentials. The app must not pretend those integrations are live.
- Gallery photos and host assets need to be managed as real uploaded event data in the full editor. Unsplash assets in the catalogue are demo/template media only and should be replaceable before use.
- TypeScript and ESLint have been run against this source. Automated tests could not run in the packaging environment because the uploaded dependency tree contained a native `esbuild` binary for a different platform. The production build could not download the matching Next.js SWC binary because the environment could not reach npm's registry. Reinstall dependencies with `npm ci` on the target machine before retesting.

## Do not treat this as finished production SaaS

Use the master prompt to continue implementing the visual editor, persistent database adapter, uploads, consent / suppression model, role-based access, jobs, transaction reconciliation and launch acceptance tests. Keep the invitations crafted and varied; do not turn the platform back into repetitive cards and forms.
