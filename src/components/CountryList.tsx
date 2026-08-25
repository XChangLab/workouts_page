import { useState } from 'react'
import type { CountryIndex } from '../types/segment'
import { useSegmentIndex } from '../hooks/useSegmentIndex'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { SkeletonCard } from './ui/Skeleton'

interface CountryListProps {
  onSelectCountry: (code: string) => void
}

export function CountryList({ onSelectCountry }: CountryListProps) {
  const { countries, lastUpdated, loading, error } = useSegmentIndex()
  const [query, setQuery] = useState('')

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  const filtered = query.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : countries

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <input
          type="search"
          placeholder="Search countries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search countries"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="py-8 text-center text-gray-500">
          {query ? `No countries match "${query}".` : 'No segment data available.'}
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((country) => (
            <Card key={country.code} onClick={() => onSelectCountry(country.code)}>
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-gray-900">{country.name}</span>
                <Badge variant="orange">{country.segmentCount} segments</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {lastUpdated && (
        <p className="mt-2 text-center text-xs text-gray-400">Data last updated: {lastUpdated}</p>
      )}
    </div>
  )
}
