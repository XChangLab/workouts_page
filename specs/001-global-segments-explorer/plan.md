# Implementation Plan: Global Verified Strava Segments Explorer

**Branch**: `001-global-segments-explorer` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-global-segments-explorer/spec.md`

## Summary

Build a read-only web application that lets users browse all verified Strava segments
worldwide, organised by country, with distance, elevation gain, and grade visible per
segment and an interactive map showing each segment's route. The tech stack is Vite + React
+ TypeScript + Tailwind CSS v4. `segments.json` stores only Strava segment URLs per country;
all segment details are fetched live from the Strava API using the ID extracted from each URL.
No backend — the Strava access token is supplied via an environment variable.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)

**Primary Dependencies**:
- `react` + `react-dom` ^19 — UI component model
- `leaflet` ^1.9 — interactive map with polyline overlay
- `@tailwindcss/vite` + `tailwindcss` v4 — utility-first styling
- `vitest` + `@testing-library/react` — unit and component tests
- Inline polyline decoder (~40 lines, zero npm dep)

**Storage**: `public/data/segments.json` — stores only Strava segment URLs per country code;
segment details fetched at runtime from `https://www.strava.com/api/v3/segments/{id}`

**Testing**: Vitest + `@testing-library/react`; 80% coverage on core logic modules (per
Constitution Principle III)

**Target Platform**: Modern browsers (Chrome/Firefox/Safari/Edge, ES2020+); responsive
layout for desktop and mobile

**Project Type**: Web application (single-page, client-side only)

**Performance Goals**:
- Segment map renders route within 2 s of selection (SC-002)
- Filter/sort results update within 500 ms (SC-004)

**Constraints**:
- Strava API `GET /api/v3/segments/{id}` — requires Bearer token scoped to `read` only
- Token supplied via `VITE_STRAVA_ACCESS_TOKEN` env var (`.env.local`, never committed)
- No user authentication required for browsing
- Bundle size increase per PR ≤ 5% (Constitution Principle V)

**Scale/Scope**: Hundreds to low-thousands of segments across ~50–100 countries; all loaded
into memory on first fetch (single JSON file, cached by browser)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality | PASS | TypeScript strict mode enforced; ESLint + Prettier required in CI |
| II. Test-First | PASS | Tests written before implementation; Vitest + RTL |
| III. Testing Standards | PASS | ≥80% unit coverage on core modules; component tests for all views |
| IV. UX Consistency | PASS | All components from a shared component library within the project; Tailwind design tokens |
| V. Performance | PASS | Bundle size gate in CI; map renders within 2 s; filter updates within 500 ms |

No violations. Complexity Tracking table omitted.

## Project Structure

### Documentation (this feature)

```text
specs/001-global-segments-explorer/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── ui-contract.md   ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
public/
└── data/
    └── segments.json          # Hand-maintained segment dataset

src/
├── main.tsx                   # App entry point
├── App.tsx                    # Root component, router/view state
├── components/
│   ├── CountryList.tsx        # View 1: country grid with search
│   ├── SegmentList.tsx        # View 2: segment table with filter/sort
│   ├── SegmentDetail.tsx      # View 3: map + stats panel
│   ├── FilterPanel.tsx        # Reusable filter controls
│   ├── UnitToggle.tsx         # Metric/imperial switcher
│   └── ui/                    # Shared primitives (Badge, Card, Button, Skeleton, etc.)
├── hooks/
│   ├── useSegmentIndex.ts     # Fetches segments.json, builds CountryIndex
│   ├── useSegment.ts          # Fetches one segment from Strava API; memoises by ID
│   ├── useFilters.ts          # Filter/sort state and logic
│   └── useUnitPreference.ts   # Unit system state
├── services/
│   └── stravaApi.ts           # Strava API fetch wrapper (reads VITE_STRAVA_ACCESS_TOKEN)
├── utils/
│   ├── polyline.ts            # Inline Google Encoded Polyline decoder
│   ├── units.ts               # Metric ↔ imperial conversion functions
│   └── countries.ts           # ISO code → display name via Intl.DisplayNames
└── types/
    └── segment.ts             # SegmentRef, Segment, CountryIndex, FilterState types

tests/
├── unit/
│   ├── polyline.test.ts       # Decoder correctness tests
│   ├── units.test.ts          # Conversion function tests
│   ├── filters.test.ts        # Filter/sort logic tests
│   └── stravaApi.test.ts      # API wrapper: response mapping, error handling
└── components/
    ├── CountryList.test.tsx
    ├── SegmentList.test.tsx
    └── SegmentDetail.test.tsx  # Mocks stravaApi; tests loading/error/success states
```

**Structure Decision**: Single-project web app. No separate backend — data is static.
Frontend-only Vite + React structure with co-located tests.

## Complexity Tracking

> No violations; this section is intentionally empty.
