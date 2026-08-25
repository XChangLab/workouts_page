import { useCallback, useRef, useState } from 'react'
import type { Segment } from './types/segment'
import { useUnitPreference } from './hooks/useUnitPreference'
import { useSegmentIndex } from './hooks/useSegmentIndex'
import { CountryList } from './components/CountryList'
import { SegmentList } from './components/SegmentList'
import { SegmentDetail } from './components/SegmentDetail'
import { UnitToggle } from './components/UnitToggle'

type View = 'countries' | 'segments' | 'detail'

export default function App() {
  const { system, toggle } = useUnitPreference()
  const { countries, segmentsByCountry, lastUpdated } = useSegmentIndex()

  const [view, setView] = useState<View>('countries')
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)

  const countryScrollRef = useRef(0)
  const segmentScrollRef = useRef(0)

  const country = selectedCountryCode ? countries.find((c) => c.code === selectedCountryCode) : null
  const countrySegments = selectedCountryCode ? (segmentsByCountry.get(selectedCountryCode) ?? []) : []

  const handleSelectCountry = useCallback((code: string) => {
    countryScrollRef.current = window.scrollY
    setSelectedCountryCode(code)
    setView('segments')
    window.scrollTo(0, 0)
  }, [])

  const handleSelectSegment = useCallback((segment: Segment) => {
    segmentScrollRef.current = window.scrollY
    setSelectedSegment(segment)
    setView('detail')
    window.scrollTo(0, 0)
  }, [])

  const handleBackToCountries = useCallback(() => {
    setView('countries')
    requestAnimationFrame(() => window.scrollTo(0, countryScrollRef.current))
  }, [])

  const handleBackToSegments = useCallback(() => {
    setView('segments')
    requestAnimationFrame(() => window.scrollTo(0, segmentScrollRef.current))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {view !== 'countries' && (
              <button
                onClick={view === 'detail' ? handleBackToSegments : handleBackToCountries}
                aria-label="Go back"
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                ←
              </button>
            )}
            <h1 className="text-base font-bold text-gray-900 sm:text-lg">
              {view === 'countries' && 'Verified Strava Segments'}
              {view === 'segments' && (country?.name ?? 'Segments')}
              {view === 'detail' && (selectedSegment?.name ?? 'Segment Detail')}
            </h1>
          </div>
          <UnitToggle system={system} onToggle={toggle} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {view === 'countries' && (
          <CountryList onSelectCountry={handleSelectCountry} />
        )}

        {view === 'segments' && (
          <SegmentList
            segments={countrySegments}
            system={system}
            lastUpdated={lastUpdated}
            onSelectSegment={handleSelectSegment}
          />
        )}

        {view === 'detail' && selectedSegment && (
          <SegmentDetail
            segment={selectedSegment}
            system={system}
            onBack={handleBackToSegments}
          />
        )}
      </main>
    </div>
  )
}
