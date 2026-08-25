import { describe, it, expect } from 'vitest'
import { decodePolyline } from '../../src/utils/polyline'

describe('decodePolyline', () => {
  it('decodes a known encoded string to correct lat/lng pairs', () => {
    // Google's canonical example from their documentation
    const encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq`@'
    const result = decodePolyline(encoded)
    expect(result).toHaveLength(3)
    expect(result[0][0]).toBeCloseTo(38.5, 3)
    expect(result[0][1]).toBeCloseTo(-120.2, 3)
    expect(result[1][0]).toBeCloseTo(40.7, 3)
    expect(result[1][1]).toBeCloseTo(-120.95, 3)
    expect(result[2][0]).toBeCloseTo(43.252, 3)
    expect(result[2][1]).toBeCloseTo(-126.453, 3)
  })

  it('returns an empty array for an empty string', () => {
    expect(decodePolyline('')).toEqual([])
  })

  it('handles a single point', () => {
    // Encode [0, 0]: both deltas are 0 → single char '?'
    const result = decodePolyline('??')
    expect(result).toHaveLength(1)
    expect(result[0][0]).toBeCloseTo(0, 5)
    expect(result[0][1]).toBeCloseTo(0, 5)
  })

  it('returns an array of [lat, lng] tuples', () => {
    const result = decodePolyline('_p~iF~ps|U')
    expect(result[0]).toHaveLength(2)
  })
})
