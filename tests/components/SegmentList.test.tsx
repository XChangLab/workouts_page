import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SegmentList } from '../../src/components/SegmentList'
import type { Segment } from '../../src/types/segment'

const SEGMENTS: Segment[] = [
  { id: '1', url: 'https://www.strava.com/segments/1', name: "Alpe d'Huez", distance_m: 13800, elevation_gain_m: 1071, avg_grade_pct: 7.9, polyline: '' },
  { id: '2', url: 'https://www.strava.com/segments/2', name: 'Box Hill', distance_m: 2400, elevation_gain_m: 124, avg_grade_pct: 5.0, polyline: '' },
  { id: '3', url: 'https://www.strava.com/segments/3', name: 'Hardknott Pass', distance_m: 3200, elevation_gain_m: 393, avg_grade_pct: 30.0, polyline: '' },
]

describe('SegmentList', () => {
  it('renders a row for each segment', () => {
    render(<SegmentList segments={SEGMENTS} system="metric" lastUpdated={null} onSelectSegment={vi.fn()} />)
    expect(screen.getByText("Alpe d'Huez")).toBeInTheDocument()
    expect(screen.getByText('Box Hill')).toBeInTheDocument()
    expect(screen.getByText('Hardknott Pass')).toBeInTheDocument()
  })

  it('shows distance, elevation and grade for each segment', () => {
    render(<SegmentList segments={SEGMENTS} system="metric" lastUpdated={null} onSelectSegment={vi.fn()} />)
    expect(screen.getByText('13.80 km')).toBeInTheDocument()
    expect(screen.getByText('1,071 m')).toBeInTheDocument()
    expect(screen.getByText('7.9%')).toBeInTheDocument()
  })

  it('shows distances in miles when system is imperial', () => {
    render(<SegmentList segments={SEGMENTS} system="imperial" lastUpdated={null} onSelectSegment={vi.fn()} />)
    expect(screen.getByText('8.58 mi')).toBeInTheDocument()
  })

  it('calls onSelectSegment with the full Segment object on row click', () => {
    const onSelect = vi.fn()
    render(<SegmentList segments={SEGMENTS} system="metric" lastUpdated={null} onSelectSegment={onSelect} />)
    fireEvent.click(screen.getByText('Box Hill'))
    expect(onSelect).toHaveBeenCalledWith(SEGMENTS[1])
  })

  it('shows "no segments match" empty state when all are filtered out', () => {
    render(<SegmentList segments={[]} system="metric" lastUpdated={null} onSelectSegment={vi.fn()} />)
    expect(screen.getByText(/No segments match/)).toBeInTheDocument()
  })

  it('renders last updated date when provided', () => {
    render(<SegmentList segments={SEGMENTS} system="metric" lastUpdated="2026-08-25" onSelectSegment={vi.fn()} />)
    expect(screen.getByText(/2026-08-25/)).toBeInTheDocument()
  })
})
