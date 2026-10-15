# Phase 05 — Inviter workspace dashboard and event management

Edit the actual `/app/events` and shared `/app` layout. Keep the current event/guest services and route handlers as the source of truth. No mock dashboard metrics or fake activity feed.

## Dashboard hierarchy

1. Page title, brief status/subtitle and one primary Create invitation action.
2. When events exist: next/upcoming event featured with useful event metadata and real actions.
3. Summaries (total invited, attending, waiting for reply, declined) only if the existing service can compute accurate counts; show the underlying count labels clearly.
4. A compact list of events, each with occasion, date, status and relevant actions.
5. A genuine empty state when there are no events, with “Create your first invitation”.

## Responsive behavior

- Desktop: dark shared sidebar, light canvas, consistent topbar and content width. A featured event plus compact metrics/list can form a balanced grid.
- Tablet: reduce columns before making text cramped.
- Mobile: one-column event list, no narrow KPI cards, no horizontal scroll. Put primary create action in header and bottom navigation. Reserve safe-area padding.
- Event detail and guest-management subsections should reuse the same page title, tabs, table/list styles, status badges, menus and back navigation.

## Acceptance

- Open `/app/events`, `/app/events/new`, and two existing event detail routes; they should look like the same application.
- Empty, loading, error and populated states are coherent.
- Guest/RSVP counts come from real services, not a hardcoded sample.
- Primary actions lead to existing routes and work.
- Mobile navigation does not hide the last row, action button or save/publish button.
