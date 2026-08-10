/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react'
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

export const EventsList = ({ events, error }: EventsListProps) => {
  const movieFilmOptions = [
    {
      value: '391297',
      label: 'Example film',
    },
  ]
  const [selectedVenue, setSelectedVenue] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedFilmId, setSelectedFilmId] = useState('')
  const [pendingShowtimeKey, setPendingShowtimeKey] = useState<string | null>(
    null
  )
  const [displayedEvents, setDisplayedEvents] =
    useState<EventListItemType[]>(events)
  const [isLoadingMovieGlu, setIsLoadingMovieGlu] = useState(false)
  const [movieGluLoadError, setMovieGluLoadError] = useState<string | null>(
    null
  )

  const visibleEvents = useMemo(() => {
    if (selectedFilmId) {
      return displayedEvents
    }

    return displayedEvents.filter(event => event.source === 'movieglu')
  }, [displayedEvents, selectedFilmId])

  useEffect(() => {
    setDisplayedEvents(events)
  }, [events])

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

      setDisplayedEvents(previousEvents => {
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

  const getVenueValue = (event: EventListItemType): string => {
    return event.venue || 'Venue TBA'
  }

  const getCityValue = (event: EventListItemType): string => {
    return event.city || 'City TBA'
  }

  const getStateValue = (event: EventListItemType): string => {
    return event.state?.trim() ?? ''
  }

  const getCityLabel = (event: EventListItemType): string => {
    const city = getCityValue(event)
    const state = getStateValue(event)

    return state ? `${city}, ${state}` : city
  }

  const getVenueLocationLabel = (event: EventListItemType): string => {
    const venue = getVenueValue(event)
    const cityLabel = getCityLabel(event)

    return `${venue}, ${cityLabel}`
  }

  const cities = useMemo(() => {
    return Array.from(new Set(visibleEvents.map(getCityLabel))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [visibleEvents])

  const venuesForSelectedCity = useMemo(() => {
    if (selectedCity === 'all') {
      return []
    }

    const cityEvents = visibleEvents.filter(
      event => getCityLabel(event) === selectedCity
    )

    return Array.from(new Set(cityEvents.map(getVenueValue))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [visibleEvents, selectedCity])

  const venueOptions = useMemo(() => {
    return venuesForSelectedCity.map(venue => {
      const venueCities = Array.from(
        new Set(
          visibleEvents
            .filter(
              event =>
                getVenueValue(event) === venue &&
                getCityLabel(event) === selectedCity
            )
            .map(getCityLabel)
            .filter(city => city !== 'City TBA')
        )
      )

      return {
        value: venue,
        label:
          venueCities.length > 0
            ? `${venue}, ${venueCities.join(' / ')}`
            : venue,
      }
    })
  }, [visibleEvents, selectedCity, venuesForSelectedCity])

  const filteredEvents = useMemo(() => {
    return visibleEvents.filter(event => {
      const matchesCity =
        selectedCity === 'all' || getCityLabel(event) === selectedCity
      const matchesVenue =
        selectedCity === 'all' ||
        selectedVenue === 'all' ||
        getVenueValue(event) === selectedVenue

      return matchesVenue && matchesCity
    })
  }, [visibleEvents, selectedVenue, selectedCity])

  const firstEventDateString = filteredEvents[0]?.startDate

  const firstEventDate = useMemo(() => {
    if (!firstEventDateString) {
      return undefined
    }

    return new Date(firstEventDateString)
  }, [firstEventDateString])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    firstEventDate
  )
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
    return new Set(Object.keys(eventsByDate))
  }, [eventsByDate])

  useEffect(() => {
    if (!selectedDate && firstEventDate) {
      setSelectedDate(firstEventDate)
      return
    }

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
          {!error
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

      <div className="order-1 md:order-2 md:sticky md:flex flex-col gap-y md:gap-ydouble md:top-[90px] h-fit">
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
              }}
              disabled={date => {
                const dateString = dateKeyFromDate(date)
                return !enabledDateSet.has(dateString)
              }}
              onSelect={date => {
                if (!date) {
                  return
                }

                setSelectedDate(date)
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

        <div className="flex flex-col gap-yhalf">
          <h4 className="hidden md:inline-block text-h4">
            Filter by city and venue:
          </h4>

          <div className="flex flex-col gap-yhalf">
            <label
              htmlFor="events-city-filter"
              className="hidden md:inline-block font-sans text-sm"
            >
              City
            </label>
            <div className="relative">
              <select
                id="events-city-filter"
                value={selectedCity}
                onChange={event => {
                  const nextCity = event.target.value
                  setSelectedCity(nextCity)
                  setSelectedVenue('all')
                }}
                className="select w-full text-center bg-transparent"
                style={{
                  backgroundImage: SELECT_HYPHEN_BG,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderColor: 'transparent',
                }}
              >
                <option value="all">All cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <RxTriangleDown
                className="w-6 h-auto pointer-events-none absolute right-xhalf top-1/2 -translate-y-1/2 text-black"
                aria-hidden="true"
              />
            </div>
          </div>

          {selectedCity !== 'all' ? (
            <div className="flex flex-col gap-yhalf">
              <label
                htmlFor="events-venue-filter"
                className="hidden md:inline-block font-sans text-sm"
              >
                Venue
              </label>
              <div className="relative">
                <select
                  id="events-venue-filter"
                  value={selectedVenue}
                  onChange={event => setSelectedVenue(event.target.value)}
                  className="select w-full text-center bg-transparent"
                  style={{
                    backgroundImage: SELECT_HYPHEN_BG,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderColor: 'transparent',
                  }}
                >
                  <option value="all">All venues</option>
                  {venueOptions.map(venueOption => (
                    <option key={venueOption.value} value={venueOption.value}>
                      {venueOption.label}
                    </option>
                  ))}
                </select>

                <RxTriangleDown
                  className="w-6 h-auto pointer-events-none absolute right-xhalf top-1/2 -translate-y-1/2 text-black"
                  aria-hidden="true"
                />
              </div>
            </div>
          ) : (
            <p className="mt-yhalf font-sans text-sm opacity-50">
              Select a city to filter by venue.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
