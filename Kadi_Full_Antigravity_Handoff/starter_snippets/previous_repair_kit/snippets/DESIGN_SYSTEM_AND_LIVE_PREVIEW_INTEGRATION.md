# Design system + live preview integration

## Project facts used for this code

The supplied project is Next.js 14 / React 18 / Tailwind CSS 3.4, with Framer Motion and lucide-react already installed. Do not paste Tailwind v4-only syntax or add a second component library just to get this screen working. The Kadi UI can use the local classes below while retaining existing template-specific guest styles.

## Files

- `kadi-apple-design-system.css`: exact app tokens plus buttons, controls, panels, states, dark surfaces, focus and reduced-motion rules.
- `kadi-studio-editor.css`: responsive split-screen studio and device frame.
- `KadiStudioEditor.tsx`: all editor inputs write to one `draft` state object. The guest preview reads that same object, so visual changes are immediate. Persistence runs after a 500ms quiet period and displays honest save states.
- `DraftInvitationPreview.tsx`: actual envelope and guest-section renderer, updated to honor `visibleSections` and `sectionOrder`.

## Integration example

Use this component in a context where a draft event id already exists. Connect `onSaveDraft` to the project's real persistence service and await successful persistence before it resolves.

```tsx
const saveDraft = useCallback(async (draft: StudioDraft) => {
  if (!eventId) throw new Error('Create a draft event before autosaving.');

  EventService.updateEvent(eventId, {
    title: draft.values.title,
    hosts: draft.values.hosts,
    celebrants: draft.values.celebrants,
    date: draft.values.date,
    time: draft.values.time,
    venue: draft.values.venue,
    city: draft.values.city,
    heroImage: draft.values.heroImage,
    rsvpDeadline: draft.values.rsvpDeadline || 'Not set',
    dressCode: draft.values.dressCode || undefined,
  });

  EventService.updateDesign(eventId, {
    ...draft.design,
    eventId,
  });
}, [eventId]);
```

`EventService` in the supplied snapshot writes to an in-memory `mockDb`. The snippet is suitable for proving UI data flow in the prototype, but it does **not** provide durable production autosave. Replace the mock service with an authenticated database-backed API before relying on save states across refreshes, devices or server restarts.

```tsx
<KadiStudioEditor
  template={selectedTemplate}
  templates={TEMPLATES}
  initialValues={valuesFromEvent}
  initialDesign={designFromEvent}
  guests={guestHouseholds.map((guest) => ({ id: guest.id, label: guest.displayName }))}
  onSaveDraft={saveDraft}
  onGeneratePrivatePreviewLink={async () => {
    const response = await fetch(`/api/events/${eventId}/preview-link`, { method: 'POST' });
    if (!response.ok) throw new Error('Could not create a private preview link');
    const data = await response.json() as { url: string };
    return data.url;
  }}
/>
```

The endpoint shown above is an integration contract, not a route present in the supplied snapshot. Implement server-side ownership validation, a high-entropy expiring token and read-only scope before enabling it. Do not share draft events using their public slug.

## Why preview reactivity works

1. Every control updates `draft.values` or `draft.design` immediately.
2. `DraftInvitationPreview` receives those current objects directly on render.
3. It constructs the preview `TemplateDefinition` / `EventEntity` and renders `EnvelopeRenderer` plus `InvitationSectionsRenderer`.
4. Only persistence is debounced. There is no debounced preview state and no parallel poster mockup to drift out of sync.
5. The preview uses `previewMode` for RSVP, so testing RSVP does not create a real guest response.
6. A replay key remounts the envelope renderer; design changes do not need a hard page reload.

## Draft creation nuance

A brand-new event must first create a draft record (or store an explicitly temporary client-side draft) before calling the event update service. Do not fake “All changes saved” by resolving a callback that only updates component state. For a new-event wizard, keep its form state local until the user saves/creates the event, or introduce an actual `createDraft` API and then autosave to that id.
