import type { NextApiRequest, NextApiResponse } from 'next'

type GeocodeResponse = {
  lat: number
  lon: number
  displayName: string
} | null

type NominatimSearchResult = {
  lat?: string
  lon?: string
  display_name?: string
}

type CacheEntry = {
  expiresAt: number
  value: GeocodeResponse
}

const geocodeCache = new Map<string, CacheEntry>()
const GEOCODE_CACHE_TTL_MS = 6 * 60 * 60 * 1000

const getCached = (key: string): GeocodeResponse | undefined => {
  const cached = geocodeCache.get(key)

  if (!cached) {
    return undefined
  }

  if (cached.expiresAt < Date.now()) {
    geocodeCache.delete(key)
    return undefined
  }

  return cached.value
}

const setCached = (key: string, value: GeocodeResponse): void => {
  geocodeCache.set(key, {
    expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS,
    value,
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeocodeResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const queryParam = Array.isArray(req.query.query)
    ? req.query.query[0]
    : req.query.query
  const query = queryParam?.trim()

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' })
  }

  const cacheKey = query.toLowerCase()
  const cached = getCached(cacheKey)

  if (cached !== undefined) {
    return res.status(200).json(cached)
  }

  const endpoint = new URL('https://nominatim.openstreetmap.org/search')
  endpoint.searchParams.set('format', 'json')
  endpoint.searchParams.set('limit', '1')
  endpoint.searchParams.set('q', query)

  try {
    const response = await fetch(endpoint.toString(), {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'joint-venture-events/1.0',
      },
    })

    if (!response.ok) {
      setCached(cacheKey, null)
      return res.status(200).json(null)
    }

    const payload = (await response.json()) as NominatimSearchResult[]
    const first = payload[0]

    if (!first?.lat || !first?.lon) {
      setCached(cacheKey, null)
      return res.status(200).json(null)
    }

    const lat = Number(first.lat)
    const lon = Number(first.lon)

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setCached(cacheKey, null)
      return res.status(200).json(null)
    }

    const result: GeocodeResponse = {
      lat,
      lon,
      displayName: first.display_name ?? query,
    }

    setCached(cacheKey, result)

    return res.status(200).json(result)
  } catch {
    setCached(cacheKey, null)
    return res.status(200).json(null)
  }
}
