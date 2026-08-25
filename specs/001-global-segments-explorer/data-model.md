# Data Model: Global Verified Strava Segments Explorer

**Feature**: `001-global-segments-explorer`
**Date**: 2026-08-25 (revised: Strava API fetch approach)

---

## Entities

### SegmentRef (stored in segments.json)

The only data persisted in the hand-maintained JSON file. Intentionally minimal.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `url` | string | yes | Full Strava segment URL, e.g. `https://www.strava.com/segments/229781` |

The segment ID is derived at runtime: `url.split('/').pop()` → `"229781"`.

---

### Segment (runtime, from Strava API)

Populated by calling `GET https://www.strava.com/api/v3/segments/{id}`.
Fields are mapped from the Strava API response; unused fields are discarded.

| Field | Type | Unit | Source field in API response | Notes |
|-------|------|------|------------------------------|-------|
| `id` | string | — | `id` | Strava segment ID |
| `name` | string | — | `name` | Human-readable segment name |
| `distance_m` | number | metres | `distance` | Raw; converted to km/mi at display |
| `elevation_gain_m` | number | metres | `total_elevation_gain` | Raw; converted to m/ft at display |
| `avg_grade_pct` | number | percent | `average_grade` | e.g. `7.4` |
| `polyline` | string | — | `map.polyline` | Google Encoded Polyline of the route |
| `start_lat` | number | degrees | `start_latlng[0]` | Map initial centre fallback |
| `start_lng` | number | degrees | `start_latlng[1]` | Map initial centre fallback |

**Validation rules** (applied after API response is received):
- `distance_m` MUST be > 0
- `elevation_gain_m` MUST be ≥ 0
- `avg_grade_pct` range: −30 to +30; values outside this range are flagged as a data warning
- `polyline` MUST be non-empty; decode errors display "Route unavailable" in the map area

**State**: Segments are immutable read-only data fetched per session. There are no state
transitions.

**Caching**: Fetched segment details SHOULD be cached in memory for the browser session
(React state or a module-level Map) to avoid re-fetching when navigating back and forth.

---

### CountryIndex (runtime-derived)

Built at app load time from the keys of `segments.json`.

| Field | Type | Notes |
|-------|------|-------|
| `code` | string | ISO 3166-1 alpha-2 country code (e.g. `"FR"`) |
| `name` | string | Localised display name via `Intl.DisplayNames` (no library) |
| `segmentUrls` | string[] | Array of Strava URLs stored under this country key |
| `segmentCount` | number | `segmentUrls.length` |

---

### UnitPreference (session state)

| Field | Type | Default | Values |
|-------|------|---------|--------|
| `system` | string | `"metric"` | `"metric"` \| `"imperial"` |

**Conversions applied at render time**:

| Metric | Imperial |
|--------|----------|
| `distance_m / 1000` → km | `distance_m / 1609.344` → mi |
| `elevation_gain_m` → m | `elevation_gain_m * 3.28084` → ft |

Grade percentage is display-identical in both systems.

---

### FilterState (in-memory UI state)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `minDistance_m` | number \| null | `null` | Lower bound on distance |
| `maxDistance_m` | number \| null | `null` | Upper bound on distance |
| `minElevation_m` | number \| null | `null` | Lower bound on elevation gain |
| `maxElevation_m` | number \| null | `null` | Upper bound on elevation gain |
| `minGrade_pct` | number \| null | `null` | Lower bound on average grade |
| `maxGrade_pct` | number \| null | `null` | Upper bound on average grade |
| `sortField` | string | `"name"` | `"name"` \| `"distance_m"` \| `"elevation_gain_m"` \| `"avg_grade_pct"` |
| `sortDir` | string | `"asc"` | `"asc"` \| `"desc"` |

Filter and sort operate only on already-fetched Segment objects.

---

## JSON File Layout

File: `public/data/segments.json`

```json
{
  "_meta": {
    "last_updated": "2026-08-25"
  },
  "FR": [
    "https://www.strava.com/segments/229781",
    "https://www.strava.com/segments/668877"
  ],
  "GB": [
    "https://www.strava.com/segments/614884"
  ],
  "US": [
    "https://www.strava.com/segments/1241780"
  ]
}
```

**Schema notes**:
- `_meta` is a reserved key and MUST NOT be treated as a country code.
- Country codes follow ISO 3166-1 alpha-2 (two uppercase letters).
- Values are arrays of Strava segment URL strings; no other fields are stored.
- Adding a segment requires only appending one URL string to the correct country array.

---

## Strava API Reference

**Endpoint**: `GET https://www.strava.com/api/v3/segments/{id}`

**Auth header**: `Authorization: Bearer <VITE_STRAVA_ACCESS_TOKEN>`

**Key response fields used**:

```json
{
  "id": 229781,
  "name": "Col du Tourmalet",
  "distance": 17100.0,
  "total_elevation_gain": 1404.0,
  "average_grade": 7.4,
  "start_latlng": [42.908, 0.147],
  "map": {
    "polyline": "kfxpHkp..."
  }
}
```

**Error handling**:
- `401 Unauthorized` → display "Strava API token is invalid or expired."
- `404 Not Found` → display "Segment not found on Strava."
- Network error / timeout → display "Unable to load segment details. Please try again."
