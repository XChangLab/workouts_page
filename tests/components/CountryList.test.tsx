import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CountryList } from '../../src/components/CountryList'

const MOCK_DATA = {
  _meta: { generated_at: '2026-08-25T10:00:00Z' },
  FR: [
    { id: '229781', url: 'https://www.strava.com/segments/229781', name: 'Col du Tourmalet', distance_m: 17100, elevation_gain_m: 1404, avg_grade_pct: 7.4, polyline: '' },
  ],
  GB: [
    { id: '614884', url: 'https://www.strava.com/segments/614884', name: 'Box Hill', distance_m: 2400, elevation_gain_m: 124, avg_grade_pct: 5.0, polyline: '' },
    { id: '4560985', url: 'https://www.strava.com/segments/4560985', name: 'Ditchling Beacon', distance_m: 1900, elevation_gain_m: 109, avg_grade_pct: 9.1, polyline: '' },
  ],
  US: [
    { id: '1241780', url: 'https://www.strava.com/segments/1241780', name: 'Hawk Hill', distance_m: 2200, elevation_gain_m: 183, avg_grade_pct: 8.0, polyline: '' },
  ],
}

function mockFetchOk() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(MOCK_DATA),
  }))
}

beforeEach(() => vi.unstubAllGlobals())

describe('CountryList', () => {
  it('renders a card for each country after loading', async () => {
    mockFetchOk()
    render(<CountryList onSelectCountry={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('France')).toBeInTheDocument()
      expect(screen.getByText('United Kingdom')).toBeInTheDocument()
      expect(screen.getByText('United States')).toBeInTheDocument()
    })
  })

  it('shows correct segment count badges', async () => {
    mockFetchOk()
    render(<CountryList onSelectCountry={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('2 segments')).toBeInTheDocument()
      expect(screen.getAllByText('1 segments')).toHaveLength(2)
    })
  })

  it('filters countries by search query', async () => {
    mockFetchOk()
    render(<CountryList onSelectCountry={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('France')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'fra' } })

    expect(screen.getByText('France')).toBeInTheDocument()
    expect(screen.queryByText('United Kingdom')).not.toBeInTheDocument()
  })

  it('shows empty state message for unmatched search', async () => {
    mockFetchOk()
    render(<CountryList onSelectCountry={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('France')).toBeInTheDocument())

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzznomatch' } })
    expect(screen.getByText(/No countries match/)).toBeInTheDocument()
  })

  it('calls onSelectCountry with country code on card click', async () => {
    mockFetchOk()
    const onSelect = vi.fn()
    render(<CountryList onSelectCountry={onSelect} />)
    await waitFor(() => expect(screen.getByText('France')).toBeInTheDocument())

    fireEvent.click(screen.getByText('France'))
    expect(onSelect).toHaveBeenCalledWith('FR')
  })

  it('shows error when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    render(<CountryList onSelectCountry={vi.fn()} />)
    await waitFor(() => expect(screen.getByText(/Network error/)).toBeInTheDocument())
  })

  it('shows "no data" message when segments-data.json has no countries', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ _meta: { generated_at: null } }),
    }))
    render(<CountryList onSelectCountry={vi.fn()} />)
    await waitFor(() => expect(screen.getByText(/sync script/)).toBeInTheDocument())
  })

  it('shows last updated date in footer', async () => {
    mockFetchOk()
    render(<CountryList onSelectCountry={vi.fn()} />)
    await waitFor(() => expect(screen.getByText(/2026-08-25/)).toBeInTheDocument())
  })
})
