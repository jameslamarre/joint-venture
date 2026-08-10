/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RoughNotation } from 'react-rough-notation'
import { RxTriangleDown } from 'react-icons/rx'

import { Calendar } from '@components/ui/calendar'

import {
  dateKeyFromDate,
  dateKeyFromISO,
  getEventHref as getItmEventHref,
  monthKeyFromISO,
  monthLabelFromISO,
  SELECT_HYPHEN_BG,
} from './consts'
import { EventListItem as EventListItemRow } from './EventListItem'
import type {
  EventListItem as EventListItemType,
  EventShowtimeLink,
  EventsListProps,
} from './types'
import { isMobile } from 'react-device-detect'

type Coordinates = {
  lat: number
  lon: number
}

const MILES_PER_KM = 0.621371

const toRadians = (value: number): number => {
  return (value * Math.PI) / 180
}

const getDistanceMiles = (from: Coordinates, to: Coordinates): number => {
  const earthRadiusKm = 6371
  const latDelta = toRadians(to.lat - from.lat)
  const lonDelta = toRadians(to.lon - from.lon)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c * MILES_PER_KM
}

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value)
}

const buildEventLocationQuery = (event: EventListItemType): string => {
  return [event.venue, event.city, event.state].filter(Boolean).join(', ')
}

export const EventsList = ({ events, error }: EventsListProps) => {
  const movieFilmOptions = [
    {
      value: '391297',
      label: 'Example film',
    },
  ]
  const [selectedFilmId, setSelectedFilmId] = useState('')
  const [nearYouInput, setNearYouInput] = useState('')
  const [sortedByDistanceTo, setSortedByDistanceTo] = useState('')
  const [distanceByEventUid, setDistanceByEventUid] = useState<
    Record<string, number | null>
  >({})
  const [isSortingByDistance, setIsSortingByDistance] = useState(false)
  const [isSortingByDistanceLoading, setIsSortingByDistanceLoading] =
    useState(false)
  const [distanceSortError, setDistanceSortError] = useState<string | null>(
    null
  )
  const [distanceDateFilterKey, setDistanceDateFilterKey] = useState<
    string | null
  >(null)
  const [pendingShowtimeKey, setPendingShowtimeKey] = useState<string | null>(
    null
  )
  const [loadedMovieGluEvents, setLoadedMovieGluEvents] = useState<
    EventListItemType[]
  >([])
  const [isLoadingMovieGlu, setIsLoadingMovieGlu] = useState(false)
  const [movieGluLoadError, setMovieGluLoadError] = useState<string | null>(
    null
  )
  const geocodeCache = useRef<Map<string, Coordinates | null>>(new Map())

  const displayedEvents = useMemo(() => {
    const eventMap = new Map<string, EventListItemType>()

    for (const event of [...events, ...loadedMovieGluEvents]) {
      eventMap.set(event.uid, event)
    }

    return Array.from(eventMap.values()).sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
  }, [events, loadedMovieGluEvents])

  const visibleEvents = useMemo(() => {
    return displayedEvents
  }, [displayedEvents])

  const resolveCoordinates = useCallback(async (query: string) => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return null
    }

    if (geocodeCache.current.has(normalizedQuery)) {
      return geocodeCache.current.get(normalizedQuery) ?? null
    }

    try {
      const response = await fetch(
        `/api/geocode?query=${encodeURIComponent(query)}`
      )

      if (!response.ok) {
        geocodeCache.current.set(normalizedQuery, null)
        return null
      }

      const payload = (await response.json()) as {
        lat: number
        lon: number
      } | null

      if (!payload) {
        geocodeCache.current.set(normalizedQuery, null)
        return null
      }

      const coordinates =
        isFiniteNumber(payload.lat) && isFiniteNumber(payload.lon)
          ? { lat: payload.lat, lon: payload.lon }
          : null

      geocodeCache.current.set(normalizedQuery, coordinates)

      return coordinates
    } catch {
      geocodeCache.current.set(normalizedQuery, null)
      return null
    }
  }, [])

  const sortEventsByDistance = useCallback(async () => {
    const query = nearYouInput.trim()

    if (!query) {
      setIsSortingByDistance(false)
      setSortedByDistanceTo('')
      setDistanceByEventUid({})
      setDistanceSortError(null)
      setDistanceDateFilterKey(null)
      return
    }

    setIsSortingByDistanceLoading(true)
    setDistanceSortError(null)

    try {
      const userCoordinates = await resolveCoordinates(query)

      if (!userCoordinates) {
        setIsSortingByDistance(false)
        setDistanceSortError(
          'Could not locate that ZIP or address. Please try another location.'
        )
        return
      }

      const nextDistances: Record<string, number | null> = {}

      await Promise.all(
        visibleEvents.map(async event => {
          const fallbackQuery = buildEventLocationQuery(event)
          const eventCoordinates =
            isFiniteNumber(event.latitude) && isFiniteNumber(event.longitude)
              ? {
                  lat: event.latitude,
                  lon: event.longitude,
                }
              : await resolveCoordinates(fallbackQuery)

          if (!eventCoordinates) {
            nextDistances[event.uid] = null
            return
          }

          nextDistances[event.uid] = getDistanceMiles(
            userCoordinates,
            eventCoordinates
          )
        })
      )

      setDistanceByEventUid(nextDistances)
      setIsSortingByDistance(true)
      setSortedByDistanceTo(query)
      setDistanceDateFilterKey(null)
    } finally {
      setIsSortingByDistanceLoading(false)
    }
  }, [nearYouInput, resolveCoordinates, visibleEvents])

  const loadMovieGluEvents = async (filmId: string) => {
    setIsLoadingMovieGlu(true)
    setMovieGluLoadError(null)

    try {
      const response = await fetch(
        `/api/movieglu-events?filmId=${encodeURIComponent(filmId)}`
      )

      if (!response.ok) {
        setMovieGluLoadError('Failed to load movie showtimes.')
        return
      }

      const payload = (await response.json()) as {
        events?: EventListItemType[]
      }

      const movieEvents = payload.events ?? []

      setLoadedMovieGluEvents(previousEvents => {
        const eventMap = new Map<string, EventListItemType>()

        for (const event of [...previousEvents, ...movieEvents]) {
          eventMap.set(event.uid, event)
        }

        return Array.from(eventMap.values()).sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
      })
    } catch {
      setMovieGluLoadError('Failed to load movie showtimes.')
    } finally {
      setIsLoadingMovieGlu(false)
    }
  }

  const resolveMovieGluShowtimeUrl = async (
    showtime: EventShowtimeLink
  ): Promise<string | undefined> => {
    if (!showtime.movieGluLookup) {
      return showtime.href
    }

    try {
      const response = await fetch('/api/movieglu-purchase-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(showtime.movieGluLookup),
      })

      if (!response.ok) {
        return showtime.href
      }

      const payload = (await response.json()) as { url?: string | null }

      return payload.url ?? showtime.href
    } catch {
      return showtime.href
    }
  }

  const onMovieGluShowtimeClick = async (
    showtime: EventShowtimeLink,
    key: string
  ) => {
    const popup = window.open('', '_blank', 'noopener,noreferrer')

    setPendingShowtimeKey(key)
    const resolvedUrl = await resolveMovieGluShowtimeUrl(showtime)
    setPendingShowtimeKey(null)

    if (!resolvedUrl) {
      popup?.close()
      return
    }

    if (popup) {
      popup.location.href = resolvedUrl
      return
    }

    window.open(resolvedUrl, '_blank', 'noopener,noreferrer')
  }

  const getEventHref = (event: EventListItemType): string => {
    if (event.source === 'movieglu' && event.href) {
      return event.href
    }

    if (event.href) {
      return event.href
    }

    return getItmEventHref(event.linkTitle ?? event.title, event.uid)
  }

  const isExternalHref = (href: string): boolean => {
    return /^https?:\/\//i.test(href)
  }

  const getVenueLocationLabel = (event: EventListItemType): string => {
    const venue = event.venue || 'Venue TBA'
    const city = event.city || 'City TBA'
    const state = event.state?.trim() ?? ''
    const cityLabel = state ? `${city}, ${state}` : city

    return `${venue}, ${cityLabel}`
  }

  const distanceSortedEvents = useMemo(() => {
    if (!isSortingByDistance) {
      return visibleEvents
    }

    return [...visibleEvents].sort((leftEvent, rightEvent) => {
      const leftDistance = distanceByEventUid[leftEvent.uid]
      const rightDistance = distanceByEventUid[rightEvent.uid]
      const leftHasDistance = isFiniteNumber(leftDistance)
      const rightHasDistance = isFiniteNumber(rightDistance)

      if (leftHasDistance && rightHasDistance) {
        return leftDistance - rightDistance
      }

      if (leftHasDistance && !rightHasDistance) {
        return -1
      }

      if (!leftHasDistance && rightHasDistance) {
        return 1
      }

      return (
        new Date(leftEvent.startDate).getTime() -
        new Date(rightEvent.startDate).getTime()
      )
    })
  }, [distanceByEventUid, isSortingByDistance, visibleEvents])

  const filteredEvents = useMemo(() => {
    if (!isSortingByDistance || !distanceDateFilterKey) {
      return distanceSortedEvents
    }

    return distanceSortedEvents.filter(event => {
      return dateKeyFromISO(event.startDate) === distanceDateFilterKey
    })
  }, [distanceDateFilterKey, distanceSortedEvents, isSortingByDistance])

  const firstEventDateString = filteredEvents[0]?.startDate

  const firstEventDate = useMemo(() => {
    if (!firstEventDateString) {
      return undefined
    }

    return new Date(firstEventDateString)
  }, [firstEventDateString])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [hasNavigatedToNextMonth, setHasNavigatedToNextMonth] = useState(false)

  const eventsByDate = useMemo(() => {
    return filteredEvents.reduce<Record<string, EventListItemType[]>>(
      (acc, event) => {
        const dateKey = dateKeyFromISO(event.startDate)

        if (!acc[dateKey]) {
          acc[dateKey] = []
        }

        acc[dateKey].push(event)
        return acc
      },
      {}
    )
  }, [filteredEvents])

  const enabledDateSet = useMemo(() => {
    return new Set(visibleEvents.map(event => dateKeyFromISO(event.startDate)))
  }, [visibleEvents])

  useEffect(() => {
    if (selectedDate && !enabledDateSet.has(dateKeyFromDate(selectedDate))) {
      setSelectedDate(firstEventDate)
    }
  }, [enabledDateSet, firstEventDate, selectedDate])

  const scrollToDateEvent = useCallback(
    (date: Date) => {
      const dateKey = dateKeyFromDate(date)
      const firstEvent = eventsByDate[dateKey]?.[0]

      if (!firstEvent) {
        return
      }

      const target = document.getElementById(`event-${firstEvent.uid}`)
      if (!target) {
        return
      }

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    },
    [eventsByDate]
  )

  const groupedEvents = filteredEvents.reduce<
    Array<{
      monthKey: string
      monthLabel: string
      items: EventListItemType[]
    }>
  >((groups, event) => {
    const monthKey = monthKeyFromISO(event.startDate)
    const existing = groups.find(group => group.monthKey === monthKey)

    if (existing) {
      existing.items.push(event)
      return groups
    }

    groups.push({
      monthKey,
      monthLabel: monthLabelFromISO(event.startDate),
      items: [event],
    })

    return groups
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y md:gap-xdouble w-full">
      <div className="order-2 md:order-1 flex flex-col gap-y w-full">
        {error ? <p>{error}</p> : null}

        <div className="flex flex-col gap-yhalf">
          <label htmlFor="events-film-filter" className="font-sans text-sm">
            Select a film:
          </label>
          <div className="relative w-full">
            <select
              id="events-film-filter"
              value={selectedFilmId}
              onChange={event => {
                const filmId = event.target.value
                setSelectedFilmId(filmId)

                if (!filmId) {
                  return
                }

                void loadMovieGluEvents(filmId)
              }}
              disabled={isLoadingMovieGlu}
              className="select w-full text-center bg-transparent disabled:opacity-60"
              style={{
                backgroundImage: SELECT_HYPHEN_BG,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderColor: 'transparent',
              }}
            >
              <option value="">Select a film</option>
              {movieFilmOptions.map(film => (
                <option key={film.value} value={film.value}>
                  {film.label}
                </option>
              ))}
            </select>

            <RxTriangleDown
              className="w-6 h-auto pointer-events-none absolute right-xhalf top-1/2 -translate-y-1/2 text-black"
              aria-hidden="true"
            />
          </div>

          {!error && filteredEvents.length === 0 && selectedFilmId ? (
            <p>No upcoming events found.</p>
          ) : null}

          {isLoadingMovieGlu ? (
            <span className="font-sans text-sm">
              Loading movie showtimes...
            </span>
          ) : null}
          {movieGluLoadError ? (
            <span className="font-sans text-sm">{movieGluLoadError}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-y w-full">
          {isSortingByDistance && sortedByDistanceTo ? (
            <h2 className="text-h2 font-sans text-[20px]">
              Sorted by distance to {sortedByDistanceTo}
            </h2>
          ) : null}

          {!error && isSortingByDistance ? (
            <section className="flex flex-col gap-yhalf md:gap-y w-full">
              <ul className="flex flex-col gap-y">
                {filteredEvents.map(event => {
                  return (
                    <EventListItemRow
                      key={event.uid}
                      event={event}
                      eventHref={getEventHref(event)}
                      venueLocationLabel={getVenueLocationLabel(event)}
                      pendingShowtimeKey={pendingShowtimeKey}
                      onMovieGluShowtimeClick={onMovieGluShowtimeClick}
                      isExternalHref={isExternalHref}
                    />
                  )
                })}
              </ul>
            </section>
          ) : null}

          {!error && !isSortingByDistance
            ? groupedEvents.map(group => (
                <section
                  key={group.monthKey}
                  className="flex flex-col gap-yhalf md:gap-y w-full"
                >
                  <h2 className="text-h2">{group.monthLabel}</h2>
                  <ul className="flex flex-col gap-y">
                    {group.items.map(event => {
                      return (
                        <EventListItemRow
                          key={event.uid}
                          event={event}
                          eventHref={getEventHref(event)}
                          venueLocationLabel={getVenueLocationLabel(event)}
                          pendingShowtimeKey={pendingShowtimeKey}
                          onMovieGluShowtimeClick={onMovieGluShowtimeClick}
                          isExternalHref={isExternalHref}
                        />
                      )
                    })}
                  </ul>
                </section>
              ))
            : null}
        </div>
      </div>

      <div className="order-1 md:order-2 md:sticky md:flex flex-col gap-y md:gap-y md:top-[90px] h-fit">
        <RoughNotation
          type="box"
          show={isMobile ? false : true}
          animate={true}
          animationDuration={1000}
          color="#A90736"
          padding={10}
          iterations={2}
          strokeWidth={2.5}
        >
          <div className="hidden md:block">
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={firstEventDate}
              modifiers={{
                hasEvent: date => enabledDateSet.has(dateKeyFromDate(date)),
              }}
              modifiersClassNames={{
                hasEvent: 'underline underline-offset-4',
                selected:
                  isSortingByDistance && selectedDate
                    ? 'calendar-selected-rough'
                    : '',
              }}
              disabled={
                isSortingByDistance
                  ? undefined
                  : date => {
                      const dateString = dateKeyFromDate(date)
                      return !enabledDateSet.has(dateString)
                    }
              }
              onSelect={date => {
                if (!date) {
                  return
                }

                setSelectedDate(date)

                if (isSortingByDistance) {
                  setDistanceDateFilterKey(dateKeyFromDate(date))
                  return
                }

                scrollToDateEvent(date)
              }}
              onMonthChange={month => {
                const now = new Date()
                const currentMonth = now.getMonth()
                const currentYear = now.getFullYear()
                const selectedMonth = month.getMonth()
                const selectedYear = month.getFullYear()

                if (
                  selectedYear > currentYear ||
                  (selectedYear === currentYear && selectedMonth > currentMonth)
                ) {
                  setHasNavigatedToNextMonth(true)
                }
              }}
              components={{
                IconLeft: ({ className }: { className?: string }) => (
                  <span
                    className={`${className || ''} ${
                      hasNavigatedToNextMonth
                        ? ''
                        : 'opacity-20 pointer-events-none'
                    }`}
                  >
                    ←
                  </span>
                ),
                IconRight: ({ className }: { className?: string }) => (
                  <span className={className}>→</span>
                ),
              }}
              className="flex-inline relative font-regular"
            />
          </div>
        </RoughNotation>

        {isSortingByDistance && sortedByDistanceTo ? (
          <p className="hidden md:block font-sans text-xs opacity-60">
            Click a date in the calendar to filter by date.
          </p>
        ) : null}

        <div className="flex flex-col gap-yhalf">
          <h4 className="hidden md:inline-block text-h4">
            Find events near you
          </h4>

          <label
            htmlFor="events-near-you-filter"
            className="hidden md:inline-block font-sans text-sm"
          >
            Enter ZIP, city, or address
          </label>

          <input
            id="events-near-you-filter"
            type="text"
            value={nearYouInput}
            onChange={event => setNearYouInput(event.target.value)}
            placeholder="10003 or New York, NY"
            className="w-full border px-3 py-2 font-sans text-sm"
            style={{
              borderColor: 'var(--theme-text)',
            }}
          />

          <div className="flex items-center gap-x-2">
            <button
              type="button"
              onClick={() => void sortEventsByDistance()}
              disabled={isSortingByDistanceLoading}
              className="px-3 py-2 font-sans text-sm bg-[var(--theme-text)] text-[var(--theme-bg)] disabled:opacity-50"
            >
              {isSortingByDistanceLoading ? 'Sorting...' : 'Sort by distance'}
            </button>

            {isSortingByDistance ? (
              <button
                type="button"
                onClick={() => {
                  setIsSortingByDistance(false)
                  setNearYouInput('')
                  setSortedByDistanceTo('')
                  setDistanceByEventUid({})
                  setDistanceDateFilterKey(null)
                  setSelectedDate(undefined)
                }}
                className="px-3 py-2 font-sans text-sm border"
                style={{ borderColor: 'var(--theme-text)' }}
              >
                Reset
              </button>
            ) : null}
          </div>

          {distanceSortError ? (
            <p className="font-sans text-sm">{distanceSortError}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
