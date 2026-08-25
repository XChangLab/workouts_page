import type { Segment } from '../types/segment'

/**
 * Looks up a segment from the pre-loaded in-memory map.
 * No network calls — all data comes from segments-data.json via useSegmentIndex.
 */
export function findSegment(
  segmentsByCountry: Map<string, Segment[]>,
  url: string,
): Segment | undefined {
  for (const segments of segmentsByCountry.values()) {
    const found = segments.find((s) => s.url === url || `https://www.strava.com/segments/${s.id}` === url)
    if (found) return found
  }
  return undefined
}
