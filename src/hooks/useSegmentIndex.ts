import { useEffect, useState } from 'react'
import type { CountryIndex, Segment } from '../types/segment'
import { countryName } from '../utils/countries'

interface SegmentsDataJson {
  _meta?: { generated_at?: string | null; note?: string }
  [countryCode: string]: Segment[] | { generated_at?: string | null; note?: string } | undefined
}

interface SegmentIndexState {
  countries: CountryIndex[]
  segmentsByCountry: Map<string, Segment[]>
  lastUpdated: string | null
  loading: boolean
  error: string | null
}

export function useSegmentIndex(): SegmentIndexState {
  const [state, setState] = useState<SegmentIndexState>({
    countries: [],
    segmentsByCountry: new Map(),
    lastUpdated: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    fetch('/data/segments-data.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load segment data (HTTP ${r.status})`)
        return r.json() as Promise<SegmentsDataJson>
      })
      .then((data) => {
        if (cancelled) return

        const meta = data._meta as { generated_at?: string | null } | undefined
        const lastUpdated = meta?.generated_at ? meta.generated_at.slice(0, 10) : null

        const segmentsByCountry = new Map<string, Segment[]>()
        const countries: CountryIndex[] = []

        for (const [key, value] of Object.entries(data)) {
          if (key === '_meta' || !Array.isArray(value)) continue
          const segs = value as Segment[]
          segmentsByCountry.set(key, segs)
          countries.push({
            code: key,
            name: countryName(key),
            segmentUrls: segs.map((s) => s.url ?? `https://www.strava.com/segments/${s.id}`),
            segmentCount: segs.length,
          })
        }

        countries.sort((a, b) => a.name.localeCompare(b.name))

        if (countries.length === 0) {
          setState({
            countries: [],
            segmentsByCountry,
            lastUpdated: null,
            loading: false,
            error: 'No segment data yet. Run the sync script or the GitHub Actions workflow.',
          })
          return
        }

        setState({ countries, segmentsByCountry, lastUpdated, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : 'Unable to load segment data. Please refresh the page.',
          }))
        }
      })

    return () => { cancelled = true }
  }, [])

  return state
}
