import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SegmentDetail } from '../../src/components/SegmentDetail'
import type { Segment } from '../../src/types/segment'

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({ remove: vi.fn(), fitBounds: vi.fn(), setView: vi.fn() })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    polyline: vi.fn(() => ({ addTo: vi.fn(), getBounds: vi.fn(() => ({})) })),
  },
}))

const SEGMENT: Segment = {
  id: '229781',
  url: 'https://www.strava.com/segments/229781',
  name: 'Col du Tourmalet',
  distance_m: 17100,
  elevation_gain_m: 1404,
  avg_grade_pct: 7.4,
  polyline: 'kfxpH',
  start_lat: 42.908,
  start_lng: 0.147,
}

describe('SegmentDetail', () => {
  it('renders segment name and stats', () => {
    render(<SegmentDetail segment={SEGMENT} system="metric" onBack={vi.fn()} />)
    expect(screen.getByText('Col du Tourmalet')).toBeInTheDocument()
    expect(screen.getByText('17.10 km')).toBeInTheDocument()
    expect(screen.getByText('1,404 m')).toBeInTheDocument()
    expect(screen.getByText('7.4%')).toBeInTheDocument()
  })

  it('renders stats in imperial units', () => {
    render(<SegmentDetail segment={SEGMENT} system="imperial" onBack={vi.fn()} />)
    expect(screen.getByText('10.63 mi')).toBeInTheDocument()
    expect(screen.getByText(/ft/)).toBeInTheDocument()
  })

  it('shows route unavailable message when polyline is empty', () => {
    render(<SegmentDetail segment={{ ...SEGMENT, polyline: '' }} system="metric" onBack={vi.fn()} />)
    expect(screen.getByText('Route map unavailable for this segment.')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn()
    render(<SegmentDetail segment={SEGMENT} system="metric" onBack={onBack} />)
    fireEvent.click(screen.getByText('← Back'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('renders a link to the segment on Strava', () => {
    render(<SegmentDetail segment={SEGMENT} system="metric" onBack={vi.fn()} />)
    const link = screen.getByRole('link', { name: /View on Strava/ })
    expect(link).toHaveAttribute('href', SEGMENT.url)
    expect(link).toHaveAttribute('target', '_blank')
  })
})
