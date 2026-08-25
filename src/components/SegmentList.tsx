import type { Segment, UnitSystem } from '../types/segment'
import { useFilters, applyFilters } from '../hooks/useFilters'
import { FilterPanel } from './FilterPanel'
import { formatDistance, formatElevation, formatGrade } from '../utils/units'

interface SegmentListProps {
  segments: Segment[]
  system: UnitSystem
  lastUpdated: string | null
  onSelectSegment: (segment: Segment) => void
}

export function SegmentList({ segments, system, lastUpdated, onSelectSegment }: SegmentListProps) {
  const { filters, setFilter, clearFilters } = useFilters()
  const displayed = applyFilters(segments, filters)

  return (
    <div className="flex flex-col gap-4">
      <FilterPanel filters={filters} system={system} setFilter={setFilter} clearFilters={clearFilters} />

      {displayed.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">No segments match your current filters.</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-orange-500 hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {displayed.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Segment</th>
                <th className="px-4 py-3 text-right">Distance</th>
                <th className="px-4 py-3 text-right">Elevation</th>
                <th className="px-4 py-3 text-right">Avg Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((seg) => (
                <tr
                  key={seg.id}
                  onClick={() => onSelectSegment(seg)}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectSegment(seg)}
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer hover:bg-orange-50 transition-colors focus:outline-none focus:bg-orange-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{seg.name}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatDistance(seg.distance_m, system)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatElevation(seg.elevation_gain_m, system)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatGrade(seg.avg_grade_pct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lastUpdated && (
        <p className="text-center text-xs text-gray-400">Data last updated: {lastUpdated}</p>
      )}
    </div>
  )
}
