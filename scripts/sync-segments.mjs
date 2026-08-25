#!/usr/bin/env node
/**
 * Sync Strava segment details into public/data/segments-data.json.
 *
 * Authentication (preferred — never expires):
 *   STRAVA_CLIENT_ID=<id>
 *   STRAVA_CLIENT_SECRET=<secret>
 *   STRAVA_REFRESH_TOKEN=<refresh_token>
 *
 * Authentication (fallback — short-lived, expires in 6 h):
 *   STRAVA_ACCESS_TOKEN=<token>
 *
 * Usage:
 *   STRAVA_CLIENT_ID=... STRAVA_CLIENT_SECRET=... STRAVA_REFRESH_TOKEN=... node scripts/sync-segments.mjs
 *
 * Reads:  public/data/segments.json        (hand-maintained list of Strava segment URLs per country)
 * Writes: public/data/segments-data.json   (full segment details fetched from Strava API)
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const STRAVA_API = 'https://www.strava.com/api/v3'
const RATE_LIMIT_DELAY_MS = 200 // stay well within Strava's 100 req/15 min limit

// ---------------------------------------------------------------------------
// Token resolution
// ---------------------------------------------------------------------------

async function resolveAccessToken() {
  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN

  if (clientId && clientSecret && refreshToken) {
    console.log('Fetching fresh access token via OAuth2 refresh token flow…')
    const res = await fetch(STRAVA_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Failed to refresh Strava token (HTTP ${res.status}): ${body}`)
    }

    const data = await res.json()

    if (data.errors) {
      throw new Error(`Strava token error: ${JSON.stringify(data.errors)}`)
    }

    console.log(`Access token obtained (expires at ${new Date(data.expires_at * 1000).toISOString()})`)

    // Strava rotates refresh tokens on each exchange. Log the new one so the
    // operator can update the secret if needed (we cannot write back to GitHub Secrets).
    if (data.refresh_token && data.refresh_token !== refreshToken) {
      console.warn('⚠  Strava issued a new refresh token. Update STRAVA_REFRESH_TOKEN in your secrets:')
      console.warn(`   New refresh token: ${data.refresh_token}`)
    }

    return data.access_token
  }

  // Fallback: bare access token (expires in 6 h)
  const accessToken = process.env.STRAVA_ACCESS_TOKEN
  if (accessToken) {
    console.warn('Using STRAVA_ACCESS_TOKEN directly (expires in 6 h). Prefer STRAVA_CLIENT_ID + STRAVA_CLIENT_SECRET + STRAVA_REFRESH_TOKEN.')
    return accessToken
  }

  throw new Error(
    'No Strava credentials found.\n' +
    'Set STRAVA_CLIENT_ID + STRAVA_CLIENT_SECRET + STRAVA_REFRESH_TOKEN (recommended)\n' +
    'or STRAVA_ACCESS_TOKEN (short-lived fallback).',
  )
}

// ---------------------------------------------------------------------------
// Segment fetch
// ---------------------------------------------------------------------------

async function fetchSegment(id, token) {
  const res = await fetch(`${STRAVA_API}/segments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 401) throw new Error(`Unauthorized — token may have expired (segment ${id})`)
  if (res.status === 404) throw new Error(`Segment ${id} not found on Strava`)
  if (res.status === 429) throw new Error('Rate limited by Strava — wait 15 minutes and retry')
  if (!res.ok) throw new Error(`Strava API error HTTP ${res.status} for segment ${id}`)

  const raw = await res.json()
  return {
    id: String(raw.id),
    url: `https://www.strava.com/segments/${raw.id}`,
    name: raw.name,
    distance_m: raw.distance,
    elevation_gain_m: raw.total_elevation_gain,
    avg_grade_pct: raw.average_grade,
    polyline: raw.map?.polyline ?? '',
    start_lat: raw.start_latlng?.[0] ?? null,
    start_lng: raw.start_latlng?.[1] ?? null,
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const token = await resolveAccessToken()

  const sourcePath = join(ROOT, 'public', 'data', 'segments.json')
  const outputPath = join(ROOT, 'public', 'data', 'segments-data.json')

  console.log(`\nReading source: ${sourcePath}`)
  const source = JSON.parse(readFileSync(sourcePath, 'utf8'))

  const result = {
    _meta: {
      generated_at: new Date().toISOString(),
      source: 'segments.json',
    },
  }

  const countryCodes = Object.keys(source).filter((k) => k !== '_meta')
  let total = 0
  let success = 0
  let failed = 0

  for (const code of countryCodes) {
    const urls = source[code]
    console.log(`\n[${code}] Fetching ${urls.length} segment(s)…`)
    result[code] = []

    for (const url of urls) {
      const id = url.split('/').pop()
      total++
      try {
        const seg = await fetchSegment(id, token)
        result[code].push(seg)
        console.log(`  ✓ ${seg.name} (${id})`)
        success++
      } catch (err) {
        console.error(`  ✗ ${id}: ${err.message}`)
        failed++
      }
      await sleep(RATE_LIMIT_DELAY_MS)
    }
  }

  writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n', 'utf8')

  console.log(`\nDone. ${success}/${total} segments synced (${failed} failed).`)
  console.log(`Output: ${outputPath}`)

  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
