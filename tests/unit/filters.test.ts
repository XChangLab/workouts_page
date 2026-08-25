import { describe, it, expect } from 'vitest'
import { applyFilters } from '../../src/hooks/useFilters'
import type { Segment, FilterState } from '../../src/types/segment'

const BASE_FILTERS: FilterState = {
  minDistance_m: null,
  maxDistance_m: null,
  minElevation_m: null,
  maxElevation_m: null,
  minGrade_pct: null,
  maxGrade_pct: null,
  sortField: 'name',
  sortDir: 'asc',
}

function seg(id: string, name: string, distance_m: number, elevation_gain_m: number, avg_grade_pct: number): Segment {
  return { id, name, distance_m, elevation_gain_m, avg_grade_pct, polyline: '' }
}

const SEGMENTS = [
  seg('1', 'Alpe d\'Huez', 13800, 1071, 7.9),
  seg('2', 'Box Hill', 2400, 124, 5.0),
  seg('3', 'Col du Tourmalet', 17100, 1404, 7.4),
  seg('4', 'Hardknott Pass', 3200, 393, 30.0),
]

describe('applyFilters — distance', () => {
  it('filters by minDistance_m', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, minDistance_m: 5000 })
    expect(result.map((s) => s.id).sort()).toEqual(['1', '3'])
  })

  it('filters by maxDistance_m', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, maxDistance_m: 3000 })
    expect(result.map((s) => s.id).sort()).toEqual(['2'])
  })

  it('filters by both min and max distance', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, minDistance_m: 2000, maxDistance_m: 5000 })
    expect(result.map((s) => s.id).sort()).toEqual(['2', '4'])
  })
})

describe('applyFilters — elevation', () => {
  it('filters by minElevation_m', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, minElevation_m: 500 })
    expect(result.map((s) => s.id).sort()).toEqual(['1', '3'])
  })

  it('filters by maxElevation_m', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, maxElevation_m: 200 })
    expect(result.map((s) => s.id).sort()).toEqual(['2'])
  })
})

describe('applyFilters — grade', () => {
  it('filters by minGrade_pct', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, minGrade_pct: 7.5 })
    expect(result.map((s) => s.id).sort()).toEqual(['1', '4'])
  })

  it('filters by maxGrade_pct', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, maxGrade_pct: 7.0 })
    expect(result.map((s) => s.id).sort()).toEqual(['2', '3'])
  })
})

describe('applyFilters — sort', () => {
  it('sorts by name ascending', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, sortField: 'name', sortDir: 'asc' })
    expect(result.map((s) => s.name)).toEqual(["Alpe d'Huez", 'Box Hill', 'Col du Tourmalet', 'Hardknott Pass'])
  })

  it('sorts by name descending', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, sortField: 'name', sortDir: 'desc' })
    expect(result.map((s) => s.name)).toEqual(['Hardknott Pass', 'Col du Tourmalet', 'Box Hill', "Alpe d'Huez"])
  })

  it('sorts by distance ascending', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, sortField: 'distance_m', sortDir: 'asc' })
    expect(result.map((s) => s.id)).toEqual(['2', '4', '1', '3'])
  })

  it('sorts by grade descending', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, sortField: 'avg_grade_pct', sortDir: 'desc' })
    expect(result[0].id).toBe('4') // Hardknott Pass 30%
  })

  it('sorts by elevation gain ascending', () => {
    const result = applyFilters(SEGMENTS, { ...BASE_FILTERS, sortField: 'elevation_gain_m', sortDir: 'asc' })
    expect(result.map((s) => s.id)).toEqual(['2', '4', '1', '3'])
  })
})

describe('applyFilters — clear (null filters)', () => {
  it('returns all segments when all filters are null', () => {
    const result = applyFilters(SEGMENTS, BASE_FILTERS)
    expect(result).toHaveLength(SEGMENTS.length)
  })
})
