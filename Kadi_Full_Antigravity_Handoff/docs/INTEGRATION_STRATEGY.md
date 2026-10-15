# Integration strategy: preserve the app, centralize the truth

1. Identify where data values already live and make the editor config a typed adapter over the existing EventEntity/TemplateDefinition/EventDesignEntity. Don't keep competing versions of title/date/category or two separate `sections` arrays.
2. Reconcile `EnvelopeRenderer.tsx` and `kadi-invitation-kit/EnvelopeExperience.tsx` before adding another envelope component. `EnvelopeRenderer` should be the stable API for template preview, editor and guest page, even if internally it delegates to one implementation.
3. Centralize category defaults/section order and block renderer. Preserve event rich fields (birthday-specific, memorial, programme, ceremony/reception etc.) in the current schema.
4. Keep the preview renderer pure where possible. Make action capabilities explicit: `{ mode: 'editor-preview' | 'template-demo' | 'published-guest' | 'private-review', allowRsvpSubmit, allowPayment, allowAnalytics }` rather than scattering ambiguous booleans.
5. Establish a repository API boundary for data. The current mockDb may remain as `dev/mock` implementation, but UI must show demo status and production adapters cannot be claimed before configured.
6. Each phase should be small enough to typecheck/test. Commit or checkpoint before risky schema/security changes.
7. Record current workspace diffs and merge code by understanding, not blind copy. Older starter components are intended to demonstrate state flow and design; import paths/types might need adaptation.
