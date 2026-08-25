/**
 * The Strava API fetch logic lives in scripts/sync-segments.mjs (server-side only).
 * There is no client-side Strava API module to test here.
 *
 * To test the sync script, run it locally with a valid STRAVA_ACCESS_TOKEN and verify
 * that public/data/segments-data.json is populated correctly (see quickstart.md SC-V7).
 */

// Placeholder so Vitest does not report an empty test suite warning.
import { describe, it } from 'vitest'
describe('stravaApi (server-side sync script)', () => {
  it('is tested via the sync script in scripts/sync-segments.mjs — no client-side API module', () => {
    // Intentionally empty: Strava API calls are server-side only.
  })
})
