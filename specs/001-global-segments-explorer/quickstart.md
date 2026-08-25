# Quickstart & Validation Guide

**Feature**: `001-global-segments-explorer`
**Date**: 2026-08-25

This guide describes how to set up, run, and validate the application end-to-end. It does
not include full implementation code; see `data-model.md` and `contracts/ui-contract.md`
for data and interface definitions.

---

## Prerequisites

- Node.js ≥ 20 (LTS)
- npm ≥ 10

---

## Setup

```bash
# Install dependencies (Vite, React, Tailwind v4, Leaflet, Vitest, @testing-library/react)
npm install
```

### Strava API Token

The app fetches segment details from the Strava API at runtime and requires a valid access
token scoped to `read` (activity:read is NOT required — segments are public data).

1. Go to https://www.strava.com/settings/api and create an application (or use an existing one).
2. Generate an access token with the `read` scope.
3. Create `.env.local` in the project root (**never commit this file**):

```
VITE_STRAVA_ACCESS_TOKEN=your_access_token_here
```

> **Note**: Strava access tokens expire every 6 hours. For v1, regenerate the token manually
> when it expires. Token refresh automation is a future iteration.

```bash
# Start development server
npm run dev
# → opens http://localhost:5173
```

---

## Data File

Segments live at `public/data/segments.json`. The file stores only Strava segment URLs.
Segment details (name, distance, elevation, grade, route) are fetched from the Strava API.

A minimal valid file for local testing:

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

To add a segment: find it on Strava, copy its URL, and append it to the correct country array.
The `_meta` key is reserved for metadata and is not treated as a country code.

---

## Validation Scenarios

### SC-V1 — Country List Loads (maps to SC-001, FR-001)

1. Open `http://localhost:5173`
2. **Expected**: A list of country cards is visible. Each card shows a country name and
   segment count. Countries are sorted alphabetically.
3. **Pass criteria**: All country codes in `segments.json` (excluding `_meta`) appear as
   named cards within 3 seconds on a standard connection.

---

### SC-V2 — Country Search (maps to FR-004)

1. Type "fra" into the country search field.
2. **Expected**: Only "France" (or countries containing "fra") remain visible.
3. Clear the field.
4. **Expected**: Full country list restored.

---

### SC-V3 — Segment List for Country (maps to FR-002, SC-003)

1. Click "France" (or any populated country card).
2. **Expected**: A list of segments is shown. Each row displays name, distance, elevation
   gain, and average grade. All values are in the currently selected unit system.

---

### SC-V4 — Segment Map View (maps to FR-003, SC-002)

1. From the segment list, click any segment.
2. **Expected**: An interactive map renders within 2 seconds showing the segment route
   as a coloured polyline. The stats panel alongside shows distance, elevation gain, and grade.
3. Zoom and pan the map.
4. **Expected**: The polyline overlay remains correctly positioned.

---

### SC-V5 — Filter and Sort (maps to FR-005, FR-006, SC-004)

1. Navigate to a country with multiple segments.
2. Set a maximum distance filter.
3. **Expected**: Only segments within the distance range are shown. Result updates within
   500 ms of filter change.
4. Change sort to "Grade (descending)".
5. **Expected**: The list reorders so the steepest segment appears first.
6. Click "Clear filters".
7. **Expected**: Full unfiltered list restored.

---

### SC-V6 — Unit Toggle (maps to FR-010)

1. From any view, switch from Metric to Imperial using the unit toggle.
2. **Expected**: All distance values switch from km to mi and elevation from m to ft
   immediately without a page reload. Grade remains as a percentage.

---

### SC-V7 — API Error Graceful Handling (maps to FR-008, FR-009)

1. Set `VITE_STRAVA_ACCESS_TOKEN` to an invalid value and restart the dev server.
2. Navigate to any segment detail view.
3. **Expected**: An error message is shown ("Strava API token is invalid or expired.")
   in the map area. The app does not crash; the user can navigate back to the country list.
4. Restore the valid token and verify the segment detail loads correctly.

---

## Running Tests

```bash
# Unit + component tests
npm run test

# Tests with coverage report
npm run test -- --coverage
```

**Minimum coverage threshold** (per Constitution Principle III): 80% for core logic modules
(polyline decoder, filter/sort functions, unit conversion utilities).

---

## Build & Preview

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
# → opens http://localhost:4173
```

Validate that the production build passes all SC-V1 through SC-V7 scenarios above.
