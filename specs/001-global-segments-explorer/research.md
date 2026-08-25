# Research: Global Verified Strava Segments Explorer

**Feature**: `001-global-segments-explorer`
**Date**: 2026-08-25

---

## Decision 1: Map Library

**Decision**: Leaflet (via `leaflet` npm package, ~42 KB gzipped)

**Rationale**: Leaflet is the lightest full-featured map library that supports tile layers and
polyline overlays with no GL/WebGL requirement. It works seamlessly with Vite, has no
framework dependency, and its CSS can be imported alongside Tailwind without conflict.
MapLibre GL JS produces sharper vector tiles but adds ~240 KB gzipped and requires WebGL —
unnecessary for this use case where segments are rendered as simple path overlays on a
raster tile background.

**Alternatives considered**: MapLibre GL JS — rejected due to bundle size and WebGL
requirement. Google Maps JS API — rejected due to licensing cost and mandatory API key for
every page load. Mapbox GL JS — same concerns as MapLibre plus proprietary licence.

---

## Decision 2: Strava Polyline Decoding

**Decision**: Inline decoder (~40-line pure function, zero dependencies)

**Rationale**: Strava uses Google's Encoded Polyline Algorithm Format. The decoding logic is
~40 lines of pure JavaScript and has no external dependencies. Shipping it inline avoids
adding `@mapbox/polyline` (3 KB) or `polyline` (2 KB) as a runtime dependency. Given the
project goal of minimal libraries this is the correct trade-off; the algorithm is stable and
well-documented, making the inline version easy to test and maintain.

**Alternatives considered**: `@mapbox/polyline` — functionally equivalent but adds a
dependency for trivial code. `google-polyline` — same assessment.

---

## Decision 3: Vite Project Type

**Decision**: Vite + React (with TypeScript)

**Rationale**: The UI has three distinct stateful views (country list, segment list, map
detail) with shared filter/sort state. React's component model keeps this state manageable
without a custom event bus. TypeScript adds the type-safety required by Constitution
Principle I. The Vite + React + TS template is the standard starting point and adds only
`react` and `react-dom` as runtime dependencies — both small and justified.

**Alternatives considered**: Vanilla JS — rejected because managing three views and their
shared state without a component model would require a bespoke state system, adding more
complexity than React itself. Vue 3 — viable but React is more widely known within the
iHerb team and reduces onboarding friction.

---

## Decision 4: Tailwind CSS Version

**Decision**: Tailwind CSS v4 with the official `@tailwindcss/vite` plugin

**Rationale**: Tailwind v4 ships a first-class Vite plugin that replaces the PostCSS
pipeline, producing faster HMR and zero-config CSS-only entry. It is stable as of mid-2026
and is the recommended path for new Vite projects. No `tailwind.config.js` is required for
standard usage, keeping the config surface minimal.

**Alternatives considered**: Tailwind v3 + PostCSS — works but requires a `postcss.config`
file and produces slightly slower HMR. Not chosen as v4 is now stable.

---

## Decision 5: Static JSON Data File Structure

**Decision**: Single `public/data/segments.json` — top-level object keyed by ISO 3166-1
alpha-2 country code, value is an array of Strava segment URLs (strings).

```json
{
  "_meta": { "last_updated": "2026-08-25" },
  "FR": [
    "https://www.strava.com/segments/229781",
    "https://www.strava.com/segments/668877"
  ],
  "GB": [
    "https://www.strava.com/segments/614884"
  ]
}
```

**Rationale**: Storing only the Strava URL keeps the file minimal and hand-editable — adding
a segment is a single line. The segment ID is extracted from the URL path at runtime
(`url.split('/').pop()`). All rich details (name, distance, elevation, grade, polyline) are
fetched from the Strava API using that ID. Placing the file in `public/` lets Vite serve it
as a static asset with browser-level caching.

**Alternatives considered**: Storing full segment detail objects — rejected per the user's
explicit requirement to fetch details from the Strava API. One JSON file per country —
rejected as it increases the number of hand-maintained files and HTTP requests.

---

## Decision 6: Testing Framework

**Decision**: Vitest + `@testing-library/react`

**Rationale**: Vitest is Vite-native, shares the same config, and requires zero additional
build tooling. `@testing-library/react` is the standard complement for React component
tests. Together they cover unit tests (polyline decoder, filter/sort logic) and component
tests (country list rendering, segment card rendering) with minimal setup. No separate Jest
config or Babel transform is needed.

**Alternatives considered**: Jest — works but requires a separate transform config and does
not share Vite's module resolution, creating a two-config maintenance burden. Playwright
only — too heavy for unit-level logic tests; Playwright is appropriate as an optional
addition for e2e tests later.

---

## Decision 7: Strava API Authentication for Client-Side App

**Decision**: Strava API access token supplied via Vite environment variable
(`VITE_STRAVA_ACCESS_TOKEN`), stored in a `.env.local` file that is never committed.

**Rationale**: The Strava Segments API (`GET /api/v3/segments/{id}`) requires a Bearer
token. For a purely client-side Vite app with no backend, the simplest approach is an
operator-provided access token injected at build/dev time via `import.meta.env`. This avoids
adding a proxy server or serverless function for v1. Strava access tokens expire every 6
hours; for v1 the operator is responsible for providing a fresh token — token refresh
automation is deferred to a future iteration.

Requests are made with `fetch()` (native, no library needed):
```
Authorization: Bearer <VITE_STRAVA_ACCESS_TOKEN>
```

**Alternatives considered**: Full OAuth2 PKCE flow — gives each user their own token but
adds significant auth UI complexity and requires users to have a Strava account. Rejected
for v1. Server-side proxy / serverless function — hides the token from the client bundle
but adds infrastructure; deferred to a future iteration if token exposure is a concern.

**Security note**: `VITE_` prefixed env vars are embedded in the client bundle and visible
in browser dev tools. Acceptable for v1 (read-only public segment data); the token MUST
be scoped to `read` only (no write permissions) to limit blast radius.
