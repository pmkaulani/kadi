# Canonical event categories: merge before adding new template entries

The supplied project snapshot has `EventCategory` in `src/lib/templates/types.ts` and a separate literal union in `EventEntity` in `src/lib/db/types.ts`. That duplication makes it easy for the UI to show a category that the API or saved event type rejects.

1. Copy `event-categories.ts` to `src/lib/events/categories.ts`.
2. In `src/lib/templates/types.ts`, remove the local `EventCategory` union and add:

```ts
import type { EventCategory } from '@/lib/events/categories';
export type { EventCategory } from '@/lib/events/categories';
```

3. In `src/lib/db/types.ts`, import the same type and use `category: EventCategory` inside `EventEntity`. Do not maintain a second union.
4. Expand `MotionPreset` with the new presets used by the category catalogue (for example `home-warming`, `funeral-service`, `holiday-celebration`, `product-launch`, `cultural-celebration`, `corporate-minimal`). Only add a preset when the renderer has defined behavior for it.
5. Search the whole project for category validators, API parsers, filters, default template selection, analytics labels and any switch statements. Update all of them consistently; do not fix only the visual chips.
6. Preserve existing category IDs and existing event data. New categories must not make older events fail to load.
