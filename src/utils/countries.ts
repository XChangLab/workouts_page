const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })

export function countryName(code: string): string {
  try {
    return displayNames.of(code) ?? code
  } catch {
    return code
  }
}

export function extractSegmentId(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1] ?? url
}
