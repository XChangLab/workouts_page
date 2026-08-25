import { useEffect, useRef } from 'react'
import type { Segment, UnitSystem } from '../types/segment'
import { decodePolyline } from '../utils/polyline'
import { formatDistance, formatElevation, formatGrade } from '../utils/units'
import { Button } from './ui/Button'

interface SegmentDetailProps {
  segment: Segment
  system: UnitSystem
  onBack: () => void
}

export function SegmentDetail({ segment, system, onBack }: SegmentDetailProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    import('leaflet').then((L) => {
      if (!mapRef.current) return

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      const map = L.map(mapRef.current)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      const latlngs = decodePolyline(segment.polyline)

      if (latlngs.length > 0) {
        const polyline = L.polyline(latlngs as [number, number][], {
          color: '#f97316',
          weight: 4,
          opacity: 0.9,
        }).addTo(map)
        map.fitBounds(polyline.getBounds(), { padding: [24, 24] })
      } else if (segment.start_lat !== undefined && segment.start_lng !== undefined) {
        map.setView([segment.start_lat, segment.start_lng], 13)
      } else {
        map.setView([20, 0], 2)
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [segment])

  const segmentUrl = segment.url ?? `https://www.strava.com/segments/${segment.id}`

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" onClick={onBack} className="self-start">
        ← Back
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative h-80 w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm lg:flex-1 lg:h-auto lg:min-h-96">
          {!segment.polyline && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-500">
              Route map unavailable for this segment.
            </div>
          )}
          <div
            ref={mapRef}
            className="h-full w-full"
            aria-label={`Map showing route of ${segment.name}`}
          />
        </div>

        <div className="flex flex-col gap-4 lg:w-64">
          <h2 className="text-xl font-bold text-gray-900">{segment.name}</h2>
          <dl className="flex flex-col gap-3">
            <Stat label="Distance" value={formatDistance(segment.distance_m, system)} />
            <Stat label="Elevation Gain" value={formatElevation(segment.elevation_gain_m, system)} />
            <Stat label="Average Grade" value={formatGrade(segment.avg_grade_pct)} />
          </dl>
          <a
            href={segmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto text-sm text-orange-500 hover:underline"
          >
            View on Strava ↗
          </a>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  )
}
