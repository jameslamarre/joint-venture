import type { NextApiRequest, NextApiResponse } from 'next'

import {
  GLU_PURCHASE_CACHE_TTL_MS,
  GLU_RATE_LIMIT_COOLDOWN_MS,
} from '@lib/events/config'
import { getDeviceDateTimeHeaderValue } from '@lib/util/device-datetime'

type PurchaseConfirmationBody = {
  cinemaId?: number
  filmId?: number
  date?: string
  time?: string
}

type PurchaseConfirmationResponse = {
  url: string | null
}

type PurchaseCacheEntry = {
  expiresAt: number
  url: string | null
}

const DEFAULT_GEOLOCATION = '40.7128;-74.0060'
const purchaseCache = new Map<string, PurchaseCacheEntry>()
let purchaseCooldownUntil = 0

const getMovieGluGeolocation = (): string => {
  const geolocation = process.env.GLU_GEOLOCATION?.trim() ?? ''
  const isLatLon = /^-?\d+(\.\d+)?;-?\d+(\.\d+)?$/.test(geolocation)

  return isLatLon ? geolocation : DEFAULT_GEOLOCATION
}

const hasMovieGluConfig = (): boolean => {
  return Boolean(
    process.env.GLU_API_URL &&
      process.env.GLU_CLIENT &&
      process.env.GLU_API_KEY &&
      process.env.GLU_AUTH &&
      process.env.GLU_TERRITORY &&
      process.env.GLU_API_VERSION
  )
}

const getMovieGluHeaders = (): HeadersInit => {
  return {
    client: process.env.GLU_CLIENT ?? '',
    'x-api-key': process.env.GLU_API_KEY ?? '',
    authorization: process.env.GLU_AUTH ?? '',
    territory: process.env.GLU_TERRITORY ?? '',
    'api-version': process.env.GLU_API_VERSION ?? '',
    geolocation: getMovieGluGeolocation(),
    'device-datetime': getDeviceDateTimeHeaderValue(),
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PurchaseConfirmationResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!hasMovieGluConfig()) {
    return res.status(200).json({ url: null })
  }

  const body = (req.body ?? {}) as PurchaseConfirmationBody
  const cinemaId = Number(body.cinemaId)
  const filmId = Number(body.filmId)
  const date = body.date ?? ''
  const time = body.time ?? ''
  const now = Date.now()

  if (
    !Number.isFinite(cinemaId) ||
    !Number.isFinite(filmId) ||
    !date ||
    !time
  ) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const cacheKey = [cinemaId, filmId, date, time].join('|')
  const cached = purchaseCache.get(cacheKey)

  if (cached && cached.expiresAt > now) {
    return res.status(200).json({ url: cached.url })
  }

  if (now < purchaseCooldownUntil) {
    return res.status(200).json({ url: cached?.url ?? null })
  }

  const apiUrl = process.env.GLU_API_URL as string
  const purchaseUrl = new URL('purchaseConfirmation/', apiUrl)
  purchaseUrl.searchParams.set('cinema_id', String(cinemaId))
  purchaseUrl.searchParams.set('film_id', String(filmId))
  purchaseUrl.searchParams.set('date', date)
  purchaseUrl.searchParams.set('time', time)

  try {
    const response = await fetch(purchaseUrl.toString(), {
      headers: getMovieGluHeaders(),
    })

    if (!response.ok) {
      if (response.status === 429) {
        purchaseCooldownUntil = Date.now() + GLU_RATE_LIMIT_COOLDOWN_MS
      }

      return res.status(200).json({ url: null })
    }

    const rawBody = await response.text()

    if (!rawBody.trim()) {
      return res.status(200).json({ url: null })
    }

    let payload: { url?: string }

    try {
      payload = JSON.parse(rawBody) as { url?: string }
    } catch {
      return res.status(200).json({ url: null })
    }

    const url = payload.url ?? null

    purchaseCache.set(cacheKey, {
      expiresAt: Date.now() + GLU_PURCHASE_CACHE_TTL_MS,
      url,
    })

    return res.status(200).json({ url })
  } catch {
    return res.status(200).json({ url: null })
  }
}
