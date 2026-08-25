# UI Contract: Global Verified Strava Segments Explorer

**Feature**: `001-global-segments-explorer`
**Date**: 2026-08-25

This document defines the user-facing interface contracts: the views, their inputs/outputs,
and the navigation model. It is technology-agnostic at the interaction level.

---

## Navigation Model

```
Home (Country List)
  └── Country Detail (Segment List)
        └── Segment Detail (Map + Stats)
              └── ← back to Country Detail
```

Back navigation MUST restore the previous view's scroll position and filter/sort state.

---

## View 1: Country List (Home)

### Purpose
Entry point. Displays all countries that have at least one verified segment.

### Inputs
- Search text field: filters countries by name as the user types (debounced, ≥ 1 character)

### Displayed per country
- Country name (localised via browser `Intl.DisplayNames`)
- Segment count badge (e.g. "42 segments")

### Sorting
Countries sorted alphabetically by localised name. No user-controlled sort on this view.

### Empty state
If search yields no matches: "No countries match '[query]'."

### Loading state
While `segments.json` is fetching: skeleton cards (country name placeholder + count placeholder).

### Error state
If `segments.json` fails to load: "Unable to load segment data. Please refresh the page."

---

## View 2: Segment List (Country Detail)

### Purpose
Lists all verified segments for the selected country with filter and sort controls.

### Inputs
- Filter panel: distance range, elevation gain range, average grade range (all optional)
- Sort control: field selector (Name, Distance, Elevation Gain, Grade) + direction toggle

### Displayed per segment
- Segment name
- Distance (km or mi, per unit preference)
- Elevation gain (m or ft, per unit preference)
- Average grade (%)
- Tappable/clickable row navigating to Segment Detail

### Empty state (after filters)
"No segments match your current filters." with a "Clear filters" action.

### Empty state (country genuinely empty)
Not reachable — countries with zero segments are excluded from the Country List.

### Pagination
If a country has > 50 segments, the list MUST paginate (page size 50) or use virtual
scrolling. Infinite scroll is acceptable as an alternative.

---

## View 3: Segment Detail (Map + Stats)

### Purpose
Shows the segment's route on an interactive map alongside its key statistics.

### Map behaviour
- Renders the segment route as a coloured polyline decoded from the `polyline` field.
- Map fits to the segment's bounding box on load with padding.
- Supports zoom, pan, and pinch-to-zoom on touch devices.
- Base tiles: OpenStreetMap (free, no API key required).

### Stats panel
Displayed alongside (desktop: side-by-side) or below (mobile: stacked) the map:

| Label | Value | Notes |
|-------|-------|-------|
| Distance | e.g. "17.1 km" | Respects unit preference |
| Elevation Gain | e.g. "1,404 m" | Respects unit preference |
| Average Grade | e.g. "7.4%" | Always percentage |

### Error state (polyline decode failure)
Map area displays: "Route map unavailable for this segment." Stats panel still renders.

### Navigation
Back button or breadcrumb returns to the Country Detail view.

---

## Global UI Elements

### Unit Toggle
Persistent toggle (Metric / Imperial) visible on all views.
- Default: Metric
- Persisted for the browser session (not across page reloads unless `localStorage` is used)
- Switching units immediately re-renders all visible distance/elevation values

### Dataset Freshness Banner
Small banner or footer line: "Data last updated: [date from segments.json metadata]"

---

## Accessibility Contract

- All interactive elements MUST be keyboard-navigable (tab order follows visual order).
- All images and map tiles MUST have appropriate `alt` or `aria-label` attributes.
- Colour contrast MUST meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
- The map MUST have a non-map fallback (stats panel) for users who cannot interact with it.
- MUST pass automated axe/pa11y checks in CI with zero violations.
