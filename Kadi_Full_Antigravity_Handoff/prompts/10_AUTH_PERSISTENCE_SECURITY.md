# Phase 10 — production-minded persistence and auth boundaries

Begin with a report of existing configuration in `package.json`, `.env.example`, `src/lib/db`, service layer, login route and API handlers. Don't choose a new provider before checking if one is already configured. Supplied source uses `mockDb`/demo auth patterns; this is not multi-user production persistence.

Tasks:
1. Keep UI-facing service contracts, add a repository/database adapter boundary, define schema/migrations and environment config appropriate for chosen provider. If real credentials/schema are not available, implement adapter interfaces and mock mode honestly; don't say persistent data works.
2. Implement actual sign-up/login/logout and reset/verification if those routes are in scope, using verified auth sessions. Do not accept any email/password as valid. Invitees remain account-free.
3. Protect `/app/**` server-side. Protect every event/guest/import/publish/duplicate/export handler by session + event ownership. Never rely on hidden buttons for security.
4. Validate payloads with current Zod patterns. Enforce event status state transitions, unique slugs, guest tokens, plus-one limits, CSV content types/size and rate limits on public endpoints.
5. Do not leak event private fields/guest phone/email/token hash in public route response. Make draft preview links signed, unguessable, expiring and read-only. Do not allow guessed draft slug access.
6. Keep duplicated event as a new draft without copying RSVP submissions/guest tokens unless intentionally regenerated through a secure process.
7. Use secure cookies/session options from the selected auth provider. Never ship `.env` secrets or put provider secrets in client components. Update `.env.example` with variable names only.
8. Add ownership isolation tests: user A cannot query/update/delete/publish/export user B's event or guest. Test persistence after server restart on chosen database. If database provider cannot be configured in environment, mark production migration/blockers clearly.

**Acceptance:** authenticated owner operations are verified server-side; multi-user tests pass; guest RSVP stays account-free; UI never confuses demo session/in-memory store with production; no secrets committed.
