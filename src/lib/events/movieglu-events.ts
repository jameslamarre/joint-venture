import { getDeviceDateTimeHeaderValue } from '@lib/util/device-datetime'

import type {
  MovieGluCinemaDetailsResponse,
  MovieGluFilmShowTimesResponse,
} from './types'
import {
  GLU_EXAMPLE_FILM_ID,
  GLU_LISTINGS_CACHE_TTL_MS,
  GLU_LOOKAHEAD_DAYS,
  GLU_RATE_LIMIT_COOLDOWN_MS,
  GLU_RESULTS_LIMIT,
} from './config'
import type { EventListItem } from '@components/events-list/types'

const DEFAULT_GEOLOCATION = '40.7128;-74.0060'
let movieGluCooldownUntil = 0

type ListingsCacheEntry = {
  expiresAt: number
  events: EventListItem[]
}

type CinemaDetailsCacheEntry = {
  expiresAt: number
  logoUrl: string | null
}

const listingsCache = new Map<string, ListingsCacheEntry>()
const cinemaDetailsCache = new Map<number, CinemaDetailsCacheEntry>()
const CINEMA_DETAILS_CACHE_TTL_MS = 24 * 60 * 60 * 1000

const isMovieGluCinemaDetailsEnabled = (): boolean => {
  const rawFlag =
    process.env.GLU_ENABLE_CINEMA_DETAILS ??
    process.env.MOVIEGLU_ENABLE_CINEMA_DETAILS ??
    ''

  const normalizedFlag = rawFlag.trim().toLowerCase()

  // Default to enabled so cinema logos render without extra env setup.
  if (!normalizedFlag) {
    return true
  }

  if (['0', 'false', 'no', 'off'].includes(normalizedFlag)) {
    return false
  }

  return ['1', 'true', 'yes', 'on'].includes(normalizedFlag)
}

const getMovieGluGeolocation = (): string => {
  const geolocation = process.env.GLU_GEOLOCATION?.trim() ?? ''
  const isLatLon = /^-?\d+(\.\d+)?;-?\d+(\.\d+)?$/.test(geolocation)

  return isLatLon ? geolocation : DEFAULT_GEOLOCATION
}

const parseShowtimeDate = (date: string, time: string): string | null => {
  const startDate = `${date}T${time}:00`
  const parsed = new Date(startDate)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return startDate
}

const getDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getMovieGluDateRange = (days: number): string[] => {
  const dates: string[] = []
  const current = new Date()

  for (let index = 0; index < days; index += 1) {
    dates.push(getDateKey(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

const showtimeLabelFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

const formatShowtimeLabel = (date: string, time: string): string => {
  return showtimeLabelFormatter.format(new Date(`${date}T${time}:00`))
}

const parseCoordinate = (value: number | string | undefined): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

const getMovieGluShowingTitle = (
  showing: Record<string, unknown>
): string | null => {
  const candidateTitle =
    showing.film_name ?? showing.film_title ?? showing.title ?? showing.name

  if (typeof candidateTitle !== 'string') {
    return null
  }

  const trimmedTitle = candidateTitle.trim()
  return trimmedTitle.length > 0 ? trimmedTitle : null
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

const getMovieGluHeaders = (includeGeolocation = true): HeadersInit => {
  const headers: HeadersInit = {
    client: process.env.GLU_CLIENT ?? '',
    'x-api-key': process.env.GLU_API_KEY ?? '',
    authorization: process.env.GLU_AUTH ?? '',
    territory: process.env.GLU_TERRITORY ?? '',
    'api-version': process.env.GLU_API_VERSION ?? '',
    'device-datetime': getDeviceDateTimeHeaderValue(),
  }

  if (includeGeolocation) {
    return {
      ...headers,
      geolocation: getMovieGluGeolocation(),
    }
  }

  return headers
}

const getMovieGluCinemaLogoUrl = async (
  cinemaId: number
): Promise<string | null> => {
  if (!isMovieGluCinemaDetailsEnabled() || !hasMovieGluConfig()) {
    return null
  }

  const now = Date.now()
  const cachedCinemaDetails = cinemaDetailsCache.get(cinemaId)

  if (cachedCinemaDetails && cachedCinemaDetails.expiresAt > now) {
    return cachedCinemaDetails.logoUrl
  }

  if (now < movieGluCooldownUntil) {
    return null
  }

  const apiUrl = process.env.GLU_API_URL as string
  const cinemaDetailsUrl = new URL('cinemaDetails/', apiUrl)
  cinemaDetailsUrl.searchParams.set('cinema_id', String(cinemaId))

  try {
    const response = await fetch(cinemaDetailsUrl.toString(), {
      headers: getMovieGluHeaders(),
    })

    if (!response.ok) {
      if (response.status === 429) {
        movieGluCooldownUntil = Date.now() + GLU_RATE_LIMIT_COOLDOWN_MS
      }

      return null
    }

    const payload = (await response.json()) as MovieGluCinemaDetailsResponse
    const logoUrl =
      typeof payload.logo_url === 'string' && payload.logo_url.trim().length > 0
        ? payload.logo_url
        : null

    cinemaDetailsCache.set(cinemaId, {
      expiresAt: Date.now() + CINEMA_DETAILS_CACHE_TTL_MS,
      logoUrl,
    })

    return logoUrl
  } catch {
    return null
  }
}

export const getMovieGluEvents = async (
  filmId?: number
): Promise<EventListItem[]> => {
  if (!hasMovieGluConfig()) {
    return []
  }

  const now = Date.now()

  if (now < movieGluCooldownUntil) {
    return []
  }

  const apiUrl = process.env.GLU_API_URL as string
  const selectedFilmId =
    Number.isFinite(filmId) && (filmId ?? 0) > 0
      ? Number(filmId)
      : GLU_EXAMPLE_FILM_ID
  const dates = getMovieGluDateRange(GLU_LOOKAHEAD_DAYS)
  const cacheKey = [
    apiUrl,
    selectedFilmId,
    GLU_RESULTS_LIMIT,
    dates.join(','),
  ].join('|')
  const cached = listingsCache.get(cacheKey)

  if (cached && cached.expiresAt > now) {
    return cached.events
  }

  const groupedEvents = new Map<string, EventListItem>()
  const eventCinemaIdByUid = new Map<string, number>()
  let hasRateLimitError = false

  for (const showDate of dates) {
    if (hasRateLimitError) {
      break
    }

    const filmShowTimesUrl = new URL('filmShowTimes/', apiUrl)
    filmShowTimesUrl.searchParams.set('film_id', String(selectedFilmId))
    filmShowTimesUrl.searchParams.set('date', showDate)
    filmShowTimesUrl.searchParams.set('n', String(GLU_RESULTS_LIMIT))

    let response: Response

    try {
      response = await fetch(filmShowTimesUrl.toString(), {
        headers: getMovieGluHeaders(),
      })
    } catch {
      continue
    }

    if (!response.ok) {
      if (response.status === 429) {
        movieGluCooldownUntil = Date.now() + GLU_RATE_LIMIT_COOLDOWN_MS
        hasRateLimitError = true
        break
      }

      continue
    }

    const rawBody = await response.text()

    if (!rawBody.trim()) {
      continue
    }

    let payload: MovieGluFilmShowTimesResponse

    try {
      payload = JSON.parse(rawBody) as MovieGluFilmShowTimesResponse
    } catch {
      continue
    }

    for (const cinema of payload.cinemas ?? []) {
      const groupKey = `${showDate}-${cinema.cinema_id}`

      if (!groupedEvents.has(groupKey)) {
        const eventUid = `movieglu-${showDate}-${cinema.cinema_id}`

        groupedEvents.set(groupKey, {
          uid: eventUid,
          title: 'Film TBA',
          venue: cinema.cinema_name || 'Theater TBA',
          city: cinema.city || 'City TBA',
          state: cinema.state,
          latitude: parseCoordinate(cinema.lat),
          longitude: parseCoordinate(cinema.lng),
          startDate: `${showDate}T23:59:00`,
          source: 'movieglu',
          showtimes: [],
        })

        eventCinemaIdByUid.set(eventUid, cinema.cinema_id)
      }

      const groupedEvent = groupedEvents.get(groupKey)

      if (!groupedEvent) {
        continue
      }

      for (const showing of Object.values(cinema.showings ?? {})) {
        const showingTitle = getMovieGluShowingTitle(
          showing as Record<string, unknown>
        )

        if (showingTitle && groupedEvent.title === 'Film TBA') {
          groupedEvent.title = showingTitle
        }

        for (const showingTime of showing.times ?? []) {
          const startDate = parseShowtimeDate(showDate, showingTime.start_time)

          if (!startDate) {
            continue
          }

          const eventTime = new Date(startDate).getTime()

          if (eventTime < now) {
            continue
          }

          groupedEvent.showtimes?.push({
            label: formatShowtimeLabel(showDate, showingTime.start_time),
            href: cinema.url,
            movieGluLookup: {
              cinemaId: cinema.cinema_id,
              filmId: showing.film_id,
              date: showDate,
              time: showingTime.start_time,
            },
          })

          if (new Date(groupedEvent.startDate).getTime() > eventTime) {
            groupedEvent.startDate = startDate
          }
        }
      }
    }
  }

  const movieEvents = Array.from(groupedEvents.values())
    .map(event => {
      const uniqueSortedShowtimes = Array.from(
        new Map(
          (event.showtimes ?? []).map(showtime => [
            `${showtime.label}-${showtime.href ?? ''}`,
            showtime,
          ])
        ).values()
      ).sort((a, b) => a.label.localeCompare(b.label))

      return {
        ...event,
        showtimes: uniqueSortedShowtimes,
      }
    })
    .filter(event => (event.showtimes?.length ?? 0) > 0)

  const eventsWithLogos = isMovieGluCinemaDetailsEnabled()
    ? await Promise.all(
        movieEvents.map(async event => {
          const cinemaId = eventCinemaIdByUid.get(event.uid)

          if (!cinemaId) {
            return event
          }

          const venueLogoUrl = await getMovieGluCinemaLogoUrl(cinemaId)

          return {
            ...event,
            venueLogoUrl,
          }
        })
      )
    : movieEvents

  listingsCache.set(cacheKey, {
    expiresAt: Date.now() + GLU_LISTINGS_CACHE_TTL_MS,
    events: eventsWithLogos,
  })

  return eventsWithLogos
}
