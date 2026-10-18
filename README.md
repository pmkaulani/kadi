# Kadi — Invitations, with feeling.

[![Kadi quality checks](https://github.com/pmkaulani/kadi/actions/workflows/quality.yml/badge.svg?branch=main)](https://github.com/pmkaulani/kadi/actions/workflows/quality.yml)

Kadi is a design-led digital invitation experience for weddings, birthdays, family celebrations, graduations, cultural events, and memorials. It brings the care of physical stationery—paper, imagery, typography, envelope reveals, and thoughtful motion—into invitations guests can open and explore on their phones.

The goal is not to make every invitation look like the same template. Each design should have its own art direction, while event details, guest responses, and host workflows remain useful and easy to understand.

> **Project status:** Kadi is an actively developed prototype. The application includes real routes, a template library, an invitation renderer, a host studio, and automated quality checks. Some persistence and external-service integrations are still demo or configuration-dependent; review [current limitations](#current-limitations-before-production) before deploying it as a public service.

## Start here

- **Browse the designs:** `/templates`
- **Create an invitation:** `/app/events/new`
- **Sign in:** `/login`
- **Open a guest invitation:** `/e/[slug]` (the URL is generated from a published or demo event)

These are local application routes after you start the development server. Demo event content is illustrative—not a real invitation or a promise that an event is taking place.

## Product experience

- **Distinct visual worlds.** A design library with different photographic, typographic, and decorative directions rather than a single layout recoloured for every occasion.
- **Envelope-first opening.** A coordinated envelope, seal, flap, and portrait invitation reveal, with reduced-motion handling.
- **Long-form guest pages.** Invitations can combine the cover with event details and optional sections such as the schedule, story, gallery, venue, registry, FAQs, and RSVP.
- **Host studio.** A workspace for choosing a template, editing invitation content, previewing the design, and working with event and guest details.
- **Guest-focused details.** Responsive layouts, clear actions, keyboard focus styles, and usable reduced-motion alternatives.
- **Kenya-aware product direction.** Kenyan occasions, EAT timing, KES/M-Pesa concepts, and local event examples are considered in the design. Live payments or messaging must not be assumed active.

## Local development

### Requirements

- Node.js 20 or newer
- npm (the version bundled with your Node.js installation is usually suitable)
- Git

### Install and run

Clone the repository and install the exact dependency versions in the lockfile:

```bash
git clone https://github.com/pmkaulani/kadi.git
cd kadi
npm ci
```

Create a local environment file. On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

For local development, review `.env.local` and set `AUTH_SECRET` to a private random value of at least 32 characters. Never commit `.env.local`, production credentials, API tokens, database passwords, or real guest data.

Start the development server:

```bash
npm run dev
```

Open **http://localhost:3005**. The development and production scripts both use port `3005` by default. If you change the port, also update `NEXT_PUBLIC_APP_URL` and any local callback or media URLs that depend on it.

### Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server on port 3005 |
| `npm run lint` | Run ESLint through Next.js |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm test` | Run the automated regression suite |
| `npm run build` | Create the production build |
| `npm run start` | Serve the production build on port 3005; run `npm run build` first |

The same typecheck, lint, test, and production-build gates are run by GitHub Actions for branch pushes and pull requests targeting `main`.

## Where things live

| Path | Responsibility |
| --- | --- |
| `src/app/` | Next.js App Router pages, layouts, route handlers, and API endpoints |
| `src/components/animation/` | Envelope opening, motion primitives, and guest-facing invitation reveal |
| `src/components/studio/` | Host editor and canvas design tools |
| `src/components/landing/` | Landing-page invitation gallery |
| `src/lib/templates/` | Template catalogue and art-directed canvas defaults |
| `src/lib/invitations/` | Shared invitation configuration |
| `src/lib/` | Application services, validation, persistence adapters, and domain logic |
| `public/` | Local images, stationery artwork, and other static assets |
| `tests/` | Automated regression tests |
| `.github/workflows/quality.yml` | Continuous integration checks |

## Design and engineering notes

These documents describe the intended experience and the current engineering direction:

- [Design direction](docs/DESIGN_DIRECTION.md) — visual principles and anti-patterns.
- [Video-reference specification](docs/VIDEO_REFERENCE_SPEC.md) — motion and composition requirements from the supplied design references.
- [Architecture](docs/ARCHITECTURE.md) — application structure and data flow.
- [Mobile image performance and accessibility](docs/MOBILE_IMAGE_PERFORMANCE_AND_ACCESSIBILITY.md) — responsive media and inclusive interaction.
- [Security and privacy notes](docs/SECURITY_AND_PRIVACY.md) — intended controls and production considerations.
- [Test plan](docs/TEST_PLAN.md) and [QA matrix](docs/QA_TEST_MATRIX.md) — areas that need verification.
- [Template asset manifest](docs/TEMPLATE_ASSET_MANIFEST.md) — current template media inventory.
- [Full platform blueprint](Kadi_Full_Platform_Blueprint.md) — broader product and technical scope.
- [Technical snippets and original database schema notes](Kadi_Technical_Snippets_and_Original_Database_Schema.md) — earlier engineering reference material.
- [Redesign changelog](REDESIGN_CHANGELOG.md) — historical redesign notes.
- [Quality workflow](.github/workflows/quality.yml) — what CI actually runs.

Older planning documents may describe intended or previously tested functionality. Treat source code and the current CI results as the authoritative evidence of the current implementation.

## Configuration and integrations

The root `.env.example` documents the configuration surface. Local development uses mock/demo settings by default so the interface can be explored without live provider credentials.

- **Database:** `DATABASE_ADAPTER=memory` is for demos and local evaluation. In-memory data is not durable storage and should not be used as the persistence layer for a production multi-user service.
- **Media storage:** `STORAGE_PROVIDER=mock_local` is a development setting, not a managed production media pipeline.
- **Remote images:** the optimizer only allows Unsplash and the local development media path by default. Add approved HTTPS CDN hostnames to `KADI_IMAGE_HOSTS` as a comma-separated list; do not use full URLs or wildcard hosts.
- **Email:** `EMAIL_PROVIDER=mock_console` does not send real transactional email.
- **WhatsApp:** automated sending is disabled by default. Sharing links are not the same as an approved automated messaging integration.
- **M-Pesa:** sandbox configuration and an explicit disabled-by-default collection flag do not constitute a live payment integration. A production implementation needs approved provider arrangements, secure credentials, verified callbacks, idempotency, reconciliation, and operational monitoring.
- **Analytics and error reporting:** optional services require deliberate provider configuration and privacy review.

Do not switch provider flags to production merely to make a feature appear enabled. Implement, test, and verify the complete provider flow first.

## Current limitations before production

Kadi should not be described as production-ready solely because it builds or its automated tests pass. Before accepting real invitations, personal information, or money at scale, validate at least the following:

1. Replace demo/in-memory persistence with a durable database and apply migrations. Confirm tenant isolation, backups, restore procedures, and concurrent writes.
2. Configure a private production `AUTH_SECRET`, HTTPS, trusted domains, secure session lifetimes, account recovery, and deployment-specific security settings.
3. Configure persistent, access-controlled media storage; validate uploads, size/type limits, and image delivery.
4. Complete real email, WhatsApp, and M-Pesa integrations only when provider approvals and credentials are available; test callbacks, failure paths, duplicates, retries, and reconciliation.
5. Test the full journey in real desktop and mobile browsers: template discovery, draft creation, saving, preview, publishing, sharing, guest RSVP, and host review of responses.
6. Review keyboard navigation, screen-reader labels, color contrast, reduced motion, image loading, slow networks, and small-screen layouts.
7. Review the privacy notice, consent and retention rules, incident response, logs, monitoring, and legal obligations before handling real guest records.

Demo names, dates, addresses, and stock/template photographs are illustrative. Replace them with approved content or media the host has permission to use before presenting a design as a real event.

## Contributing

1. Create a focused branch from `main`.
2. Keep the invitation's visual art direction intact; avoid generic dashboards, repeated cards, and decorative motion that competes with the event details.
3. Add or update regression tests when changing template configuration, invitation rendering, RSVP behaviour, or motion.
4. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
5. Open a pull request and confirm the GitHub Actions checks pass before merging.

---

**Kadi — Invitations, with feeling.**
