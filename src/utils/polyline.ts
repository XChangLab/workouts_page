export type LatLng = [number, number]

/**
 * Decodes a Google Encoded Polyline string into an array of [lat, lng] pairs.
 * https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
export function decodePolyline(encoded: string): LatLng[] {
  if (!encoded) return []

  const result: LatLng[] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let b: number
    let shift = 0
    let result_val = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result_val |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = result_val & 1 ? ~(result_val >> 1) : result_val >> 1
    lat += dlat

    shift = 0
    result_val = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result_val |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlng = result_val & 1 ? ~(result_val >> 1) : result_val >> 1
    lng += dlng

    result.push([lat / 1e5, lng / 1e5])
  }

  return result
}
