# Tasks: Global Verified Strava Segments Explorer

**Input**: Design documents from `specs/001-global-segments-explorer/`

**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ui-contract.md ✓

**Tests**: Included — Constitution Principle II (Test-First) is NON-NEGOTIABLE. Tests are
written before implementation in every user story phase.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no blocking dependency on an incomplete task)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the Vite + React + TypeScript project and install all dependencies.

- [X] T001 Initialize Vite + React + TypeScript project at repo root: `npm create vite@latest . -- --template react-ts`
- [X] T002 Install and configure Tailwind CSS v4: `npm i tailwindcss @tailwindcss/vite` and add plugin to `vite.config.ts`; add `@import "tailwindcss"` to `src/index.css`
- [X] T003 [P] Install Leaflet and type definitions: `npm i leaflet` and `npm i -D @types/leaflet`
- [X] T004 [P] Install test tooling: `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom`; add `vitest.config.ts` with jsdom environment and coverage thresholds (80% for `src/utils`, `src/services`, `src/hooks`)
- [X] T005 Create `.env.local.example` at repo root documenting `VITE_STRAVA_ACCESS_TOKEN=<your_strava_read_token>` so any contributor knows what is required
- [X] T006 Add `.env.local` entry to `.gitignore` (must never be committed)
- [X] T007 Create full source directory skeleton per plan.md: `src/components/ui/`, `src/hooks/`, `src/services/`, `src/utils/`, `src/types/`, `tests/unit/`, `tests/components/`; create `public/data/` directory

**Checkpoint**: `npm run dev` starts the dev server; `npm run test` runs (zero tests, zero failures)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities, types, and the Strava API wrapper that every user story depends on.
**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T008 Define all TypeScript interfaces in `src/types/segment.ts`: `SegmentRef`, `Segment`, `CountryIndex`, `UnitPreference`, `FilterState`, `StravaApiSegment` (raw API shape)
- [X] T009 [P] Write failing unit tests for polyline decoder in `tests/unit/polyline.test.ts`: test known encoded strings decode to correct lat/lng arrays; test empty string returns empty array
- [X] T010 [P] Write failing unit tests for unit converters in `tests/unit/units.test.ts`: test `mToKm`, `mToMi`, `mToFt` with known values; test grade is unchanged between systems
- [X] T011 [P] Write failing unit tests for Strava API wrapper in `tests/unit/stravaApi.test.ts`: mock `fetch`; test 200 response maps to `Segment`; test 401/404/network error each throw typed errors
- [X] T012 [P] Implement inline Google Encoded Polyline decoder in `src/utils/polyline.ts` — pure function, no dependencies; run `npm run test` and confirm T009 tests pass
- [X] T013 [P] Implement unit conversion functions in `src/utils/units.ts`: `mToKm`, `mToMi`, `mToFt`, `formatDistance`, `formatElevation`; run `npm run test` and confirm T010 tests pass
- [X] T014 [P] Implement country code → display name helper in `src/utils/countries.ts` using `Intl.DisplayNames`; no external library
- [X] T015 Implement Strava API fetch wrapper in `src/services/stravaApi.ts`: reads `import.meta.env.VITE_STRAVA_ACCESS_TOKEN`; calls `GET https://www.strava.com/api/v3/segments/{id}`; maps response to `Segment`; throws typed errors for 401, 404, and network failures; run `npm run test` and confirm T011 tests pass
- [X] T016 Add `public/data/segments.json` with at least 3 countries and 2+ segment URLs each using the schema from data-model.md; include `_meta.last_updated` field

**Checkpoint**: All foundational unit tests pass; `VITE_STRAVA_ACCESS_TOKEN` set in `.env.local`; `fetch('https://www.strava.com/api/v3/segments/229781', ...)` returns segment data in the browser console

---

## Phase 3: User Story 1 — Browse Segments by Country (Priority: P1) 🎯 MVP

**Goal**: User opens the app, sees a searchable list of countries with segment counts, selects a
country, and sees all its segments listed with name, distance, elevation gain, and grade.

**Independent Test**: Open the app, select any country → segment list renders with all four data
fields visible per row. Search for a country name → list filters. No map interaction required.

### Tests for User Story 1

> **Write these first; verify they FAIL before implementing the components**

- [X] T017 [P] [US1] Write failing component test for `CountryList` in `tests/components/CountryList.test.tsx`: render with mock `segments.json` data; assert country cards appear; assert search input filters results; assert "No countries match" empty state
- [X] T018 [P] [US1] Write failing component test for `SegmentList` (country detail view) in `tests/components/SegmentList.test.tsx`: render with mock segment array; assert each row shows name, distance, elevation, grade; assert "No segments" empty state when array is empty

### Implementation for User Story 1

- [X] T019 [P] [US1] Implement `useSegmentIndex` hook in `src/hooks/useSegmentIndex.ts`: fetches `public/data/segments.json`; builds `CountryIndex[]` sorted alphabetically using `src/utils/countries.ts`; returns `{ countries, loading, error }`
- [X] T020 [P] [US1] Create shared UI primitives in `src/components/ui/`: `Card.tsx` (padded container), `Badge.tsx` (count chip), `Skeleton.tsx` (loading placeholder), `Button.tsx` (styled button)
- [X] T021 [P] [US1] Implement `useUnitPreference` hook in `src/hooks/useUnitPreference.ts`: session state defaulting to `"metric"`; returns `{ system, toggle }`
- [X] T022 [P] [US1] Create `UnitToggle` component in `src/components/UnitToggle.tsx`: Metric/Imperial toggle using Tailwind; calls `useUnitPreference`
- [X] T023 [US1] Create `CountryList` component in `src/components/CountryList.tsx`: uses `useSegmentIndex`; renders country cards (name + segment count badge); debounced search input; skeleton loading state; error state; calls `onSelectCountry(code)` prop on card click; run `npm run test` and confirm T017 passes
- [X] T024 [US1] Create `SegmentList` component in `src/components/SegmentList.tsx` (country detail view, no filters yet): renders segment rows from props array showing name, distance (formatted), elevation (formatted), grade; uses `useUnitPreference` for display; empty state; skeleton loading; calls `onSelectSegment(url)` prop on row click; run `npm run test` and confirm T018 passes
- [X] T025 [US1] Wire up `App.tsx` with view state machine (`"countries" | "segments" | "detail"`): render `CountryList` for `"countries"` view; render `SegmentList` for `"segments"` view (fetch segment URLs from index, display stubs until US2 adds detail fetch); render `UnitToggle` in header on all views; implement back navigation restoring scroll position

**Checkpoint**: Open app → country list visible with real data from `segments.json`. Select a country → segment rows visible (name + URL-derived stub data). Unit toggle switches label. All T017–T018 tests pass.

---

## Phase 4: User Story 2 — Segment Route on Map (Priority: P2)

**Goal**: Selecting a segment opens an interactive map with the decoded route polyline overlaid,
plus a stats panel showing distance, elevation gain, and grade fetched from the Strava API.

**Independent Test**: Click any segment → map renders polyline within 2 s; stats panel shows
all three data fields; zoom/pan keeps polyline in place; back button returns to segment list with
scroll position restored.

### Tests for User Story 2

> **Write these first; verify they FAIL before implementing**

- [X] T026 [P] [US2] Write failing component test for `SegmentDetail` in `tests/components/SegmentDetail.test.tsx`: mock `stravaApi`; assert loading skeleton shown while fetching; assert stats panel renders name, distance, elevation, grade on success; assert error message shown on API failure; assert "Route unavailable" shown when polyline is empty

### Implementation for User Story 2

- [X] T027 [P] [US2] Implement `useSegment` hook in `src/hooks/useSegment.ts`: accepts segment URL; extracts ID (`url.split('/').pop()`); calls `stravaApi.fetchSegment(id)`; caches result in a module-level `Map<string, Segment>` to avoid re-fetching; returns `{ segment, loading, error }`
- [X] T028 [US2] Create `SegmentDetail` component in `src/components/SegmentDetail.tsx`: uses `useSegment`; initialises a Leaflet map in a `useEffect` (import `leaflet/dist/leaflet.css`); decodes `segment.polyline` with `src/utils/polyline.ts`; adds polyline to map and fits bounds; renders stats panel alongside map; handles loading/error/"Route unavailable" states; run `npm run test` and confirm T026 passes
- [X] T029 [US2] Wire `SegmentDetail` into `App.tsx` `"detail"` view: pass selected segment URL; implement breadcrumb/back button restoring segment list scroll position

**Checkpoint**: Click any segment → Leaflet map renders with polyline; stats panel shows real Strava data. Navigate back → scroll position restored. T026 test passes.

---

## Phase 5: User Story 3 — Filter and Sort Segments (Priority: P3)

**Goal**: Within a country's segment list, the user can filter by distance/elevation/grade ranges
and sort by any column. Results update immediately; clearing filters restores the full list.

**Independent Test**: Open any country with 3+ segments → apply a grade filter → only matching
segments shown; change sort to "Grade descending" → steepest segment first; clear filters → all
segments return. No regression in US1 or US2 flows.

### Tests for User Story 3

> **Write these first; verify they FAIL before implementing**

- [X] T030 [P] [US3] Write failing unit tests for filter/sort logic in `tests/unit/filters.test.ts`: test distance range filter; test elevation range filter; test grade range filter; test sort ascending/descending for each field; test clear returns full array

### Implementation for User Story 3

- [X] T031 [P] [US3] Implement `useFilters` hook in `src/hooks/useFilters.ts`: manages `FilterState`; exposes `applyFilters(segments)` pure function and `setFilter`, `setSort`, `clearFilters` actions; run `npm run test` and confirm T030 passes
- [X] T032 [P] [US3] Create `FilterPanel` component in `src/components/FilterPanel.tsx`: distance range inputs (respects unit preference for labels), elevation range inputs, grade range inputs, sort field selector + direction toggle, "Clear filters" button; all Tailwind-styled
- [X] T033 [US3] Integrate `useFilters` and `FilterPanel` into `SegmentList.tsx`: filtered/sorted segment array passed to row renderer; filter panel collapsible on mobile

**Checkpoint**: Apply any filter → list updates instantly. Sort by grade descending → correct order. Clear → full list. T030 unit tests pass. US1 and US2 flows unaffected.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, error resilience, freshness banner, and final validation.

- [X] T034 [P] Add skeleton loading placeholders to `CountryList`, `SegmentList`, and `SegmentDetail` using `src/components/ui/Skeleton.tsx` (replace any raw spinners)
- [X] T035 [P] Implement global error boundary in `src/components/ErrorBoundary.tsx`; wrap `App.tsx`; display friendly recovery message with reload button
- [X] T036 Add `_meta.last_updated` display: read from `segments.json` response in `useSegmentIndex`; render as a footer line "Data last updated: [date]" on `CountryList` and `SegmentList` views
- [X] T037 [P] Accessibility pass: add `aria-label` to all icon-only buttons and the Leaflet map container; verify tab order matches visual order in `CountryList` and `SegmentList`; run `axe` or browser accessibility audit and resolve all violations
- [X] T038 [P] Run all seven quickstart.md validation scenarios (SC-V1 through SC-V7) manually; document any failures and fix before marking complete
- [X] T039 Production build verification: `npm run build && npm run preview`; confirm all three views work at `http://localhost:4173`; confirm bundle size is within 5% cap from plan (Constitution Principle V)

**Checkpoint**: All 39 previous tasks complete; production build passes; quickstart scenarios SC-V1–SC-V7 all pass; zero axe violations.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 complete — **blocks all user stories**
- **US1 (Phase 3)**: Depends on Phase 2 — no dependency on US2 or US3
- **US2 (Phase 4)**: Depends on Phase 2 — no dependency on US1 (though US1 provides `SegmentList` shell that US2 extends)
- **US3 (Phase 5)**: Depends on US1 `SegmentList` being in place (T024)
- **Polish (Phase 6)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational — no cross-story dependency
- **US2 (P2)**: Starts after Foundational — builds on App view wiring from US1 (T025) but UI component itself (T028) is independent
- **US3 (P3)**: Depends on `SegmentList` from US1 (T024) — can begin once T024 is done

### Within Each User Story

1. Write tests first (confirm they fail)
2. Implement hooks and utilities
3. Implement UI components
4. Wire into App.tsx
5. Confirm tests pass at checkpoint

---

## Parallel Opportunities

### Phase 2 — run together after Phase 1

```
T009  Write polyline tests          T010  Write unit converter tests
T011  Write stravaApi tests
      ↓ (all pass)
T012  Implement polyline.ts         T013  Implement units.ts
T014  Implement countries.ts        T015  Implement stravaApi.ts
T016  Populate segments.json
```

### Phase 3 (US1) — tests and utilities in parallel

```
T017  CountryList tests             T018  SegmentList tests
T019  useSegmentIndex hook          T020  UI primitives (Card/Badge/Skeleton)
T021  useUnitPreference hook        T022  UnitToggle component
      ↓ (all ready)
T023  CountryList component
T024  SegmentList component
T025  Wire App.tsx
```

### Phase 4 (US2) — test and hook in parallel

```
T026  SegmentDetail test            T027  useSegment hook
      ↓
T028  SegmentDetail component
T029  Wire App.tsx
```

### Phase 5 (US3) — test and hook in parallel

```
T030  Filter/sort tests             T031  useFilters hook
      ↓
T032  FilterPanel component
T033  Integrate into SegmentList
```

---

## Implementation Strategy

### MVP (User Story 1 Only — ~1 day)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and validate**: Country list loads → segment rows visible → unit toggle works
5. All T017–T018 tests pass

### Incremental Delivery

1. Setup + Foundational → infrastructure confirmed
2. + US1 → browsable country/segment directory (MVP ✓)
3. + US2 → interactive map with live Strava data
4. + US3 → filtered/sorted segment exploration
5. + Polish → production-ready

### Parallel Team Strategy

After Phase 2 is complete:
- Developer A: US1 (T017–T025)
- Developer B: US2 (T026–T029) — can begin `useSegment` (T027) and test (T026) immediately
- Developer C: US3 (T030–T031) — can begin once T024 merges

---

## Notes

- `[P]` tasks modify different files with no incomplete-task dependency — safe to parallelise
- Constitution Principle II mandates tests written before implementation — every phase follows Red→Green→Refactor
- `VITE_STRAVA_ACCESS_TOKEN` must be set in `.env.local` before any Phase 4+ tasks can be validated manually
- Strava access tokens expire every 6 hours — refresh manually for v1
- Commit after each checkpoint (T007, T016, T025, T029, T033, T039)
