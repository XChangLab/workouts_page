export interface Segment {
  id: string
  url?: string
  name: string
  distance_m: number
  elevation_gain_m: number
  avg_grade_pct: number
  polyline: string
  start_lat?: number
  start_lng?: number
}

export interface CountryIndex {
  code: string
  name: string
  segmentUrls: string[]
  segmentCount: number
}

export type UnitSystem = 'metric' | 'imperial'

export interface FilterState {
  minDistance_m: number | null
  maxDistance_m: number | null
  minElevation_m: number | null
  maxElevation_m: number | null
  minGrade_pct: number | null
  maxGrade_pct: number | null
  sortField: 'name' | 'distance_m' | 'elevation_gain_m' | 'avg_grade_pct'
  sortDir: 'asc' | 'desc'
}
