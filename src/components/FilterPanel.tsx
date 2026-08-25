import type { FilterState, UnitSystem } from '../types/segment'
import { Button } from './ui/Button'

interface FilterPanelProps {
  filters: FilterState
  system: UnitSystem
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  clearFilters: () => void
}

const SORT_OPTIONS: { value: FilterState['sortField']; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'distance_m', label: 'Distance' },
  { value: 'elevation_gain_m', label: 'Elevation Gain' },
  { value: 'avg_grade_pct', label: 'Grade' },
]

function numInput(
  label: string,
  value: number | null,
  onChange: (v: number | null) => void,
  placeholder: string,
) {
  return (
    <label className="flex flex-col gap-1 text-xs text-gray-600">
      {label}
      <input
        type="number"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-100 w-24"
      />
    </label>
  )
}

export function FilterPanel({ filters, system, setFilter, clearFilters }: FilterPanelProps) {
  const distUnit = system === 'metric' ? 'km' : 'mi'
  const elevUnit = system === 'metric' ? 'm' : 'ft'
  const toM = system === 'metric' ? (v: number) => v * 1000 : (v: number) => v * 1609.344
  const fromM = system === 'metric' ? (v: number | null) => (v == null ? null : v / 1000) : (v: number | null) => (v == null ? null : v / 1609.344)
  const toMElev = system === 'metric' ? (v: number) => v : (v: number) => v / 3.28084
  const fromMElev = system === 'metric' ? (v: number | null) => v : (v: number | null) => (v == null ? null : v * 3.28084)

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-wrap gap-4">
        {numInput(`Min dist (${distUnit})`, fromM(filters.minDistance_m), (v) => setFilter('minDistance_m', v == null ? null : toM(v)), '0')}
        {numInput(`Max dist (${distUnit})`, fromM(filters.maxDistance_m), (v) => setFilter('maxDistance_m', v == null ? null : toM(v)), '∞')}
        {numInput(`Min elev (${elevUnit})`, fromMElev(filters.minElevation_m), (v) => setFilter('minElevation_m', v == null ? null : toMElev(v)), '0')}
        {numInput(`Max elev (${elevUnit})`, fromMElev(filters.maxElevation_m), (v) => setFilter('maxElevation_m', v == null ? null : toMElev(v)), '∞')}
        {numInput('Min grade (%)', filters.minGrade_pct, (v) => setFilter('minGrade_pct', v), '0')}
        {numInput('Max grade (%)', filters.maxGrade_pct, (v) => setFilter('maxGrade_pct', v), '∞')}
      </div>

      <label className="flex flex-col gap-1 text-xs text-gray-600">
        Sort by
        <div className="flex gap-1">
          <select
            value={filters.sortField}
            onChange={(e) => setFilter('sortField', e.target.value as FilterState['sortField'])}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-orange-400 focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            onClick={() => setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort ${filters.sortDir === 'asc' ? 'descending' : 'ascending'}`}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm hover:bg-gray-100 transition-colors"
          >
            {filters.sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </label>

      <Button variant="outline" onClick={clearFilters} className="self-end">
        Clear filters
      </Button>
    </div>
  )
}
