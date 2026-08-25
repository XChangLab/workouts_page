import { useState, useCallback } from 'react'
import type { Segment, FilterState } from '../types/segment'

const DEFAULT_FILTERS: FilterState = {
  minDistance_m: null,
  maxDistance_m: null,
  minElevation_m: null,
  maxElevation_m: null,
  minGrade_pct: null,
  maxGrade_pct: null,
  sortField: 'name',
  sortDir: 'asc',
}

export function applyFilters(segments: Segment[], filters: FilterState): Segment[] {
  let result = segments.filter((s) => {
    if (filters.minDistance_m !== null && s.distance_m < filters.minDistance_m) return false
    if (filters.maxDistance_m !== null && s.distance_m > filters.maxDistance_m) return false
    if (filters.minElevation_m !== null && s.elevation_gain_m < filters.minElevation_m) return false
    if (filters.maxElevation_m !== null && s.elevation_gain_m > filters.maxElevation_m) return false
    if (filters.minGrade_pct !== null && s.avg_grade_pct < filters.minGrade_pct) return false
    if (filters.maxGrade_pct !== null && s.avg_grade_pct > filters.maxGrade_pct) return false
    return true
  })

  result = [...result].sort((a, b) => {
    const field = filters.sortField
    const av = field === 'name' ? a.name : a[field]
    const bv = field === 'name' ? b.name : b[field]
    if (av < bv) return filters.sortDir === 'asc' ? -1 : 1
    if (av > bv) return filters.sortDir === 'asc' ? 1 : -1
    return 0
  })

  return result
}

interface FiltersHook {
  filters: FilterState
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  clearFilters: () => void
}

export function useFilters(): FiltersHook {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((f) => ({ ...f, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  return { filters, setFilter, clearFilters }
}
