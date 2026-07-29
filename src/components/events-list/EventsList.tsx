import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RoughNotation } from 'react-rough-notation'
import { RxTriangleDown } from 'react-icons/rx'

import { Calendar } from '@components/ui/calendar'

import {
  dateKeyFromDate,
  dateKeyFromISO,
  getEventHref,
  monthKeyFromISO,
  monthLabelFromISO,
  SELECT_HYPHEN_BG,
} from './consts'
import type { EventListItem, EventsListProps } from './types'
import { isMobile } from 'react-device-detect'
import { dateFormatter } from '@lib/util/date-formatters'

export const EventsList = ({ events, error }: EventsListProps) => {
  const [selectedVenue, setSelectedVenue] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')

  const getVenueValue = (event: EventListItem): string => {
    return event.venue || 'Venue TBA'
  }

  const getCityValue = (event: EventListItem): string => {
    return event.city || 'City TBA'
  }

  const cities = useMemo(() => {
    return Array.from(new Set(events.map(getCityValue))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [events])

  const venuesForSelectedCity = useMemo(() => {
    if (selectedCity === 'all') {
      return []
    }

    const cityEvents = events.filter(
      event => getCityValue(event) === selectedCity
    )

    return Array.from(new Set(cityEvents.map(getVenueValue))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [events, selectedCity])

  const venueOptions = useMemo(() => {
    return venuesForSelectedCity.map(venue => {
      const venueCities = Array.from(
        new Set(
          events
            .filter(
              event =>
                getVenueValue(event) === venue &&
                getCityValue(event) === selectedCity
            )
            .map(getCityValue)
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
  }, [events, selectedCity, venuesForSelectedCity])

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCity =
        selectedCity === 'all' || getCityValue(event) === selectedCity
      const matchesVenue =
        selectedCity === 'all' ||
        selectedVenue === 'all' ||
        getVenueValue(event) === selectedVenue

      return matchesVenue && matchesCity
    })
  }, [events, selectedVenue, selectedCity])

  const getEventLocation = (event: EventListItem): string => {
    const venue = getVenueValue(event)
    const city = getCityValue(event)

    if (venue === 'Venue TBA' && city === 'City TBA') {
      return 'Location TBA'
    }

    if (venue === 'Venue TBA') {
      return city
    }

    if (city === 'City TBA') {
      return venue
    }

    return `${venue}, ${city}`
  }

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
    return filteredEvents.reduce<Record<string, EventListItem[]>>(
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
      items: EventListItem[]
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

        {!error && filteredEvents.length === 0 ? (
          <p>No upcoming events found.</p>
        ) : null}

        <div className="flex flex-col gap-y w-full">
          {!error
            ? groupedEvents.map(group => (
                <section
                  key={group.monthKey}
                  className="flex flex-col gap-yhalf md:gap-y w-full"
                >
                  <h2 className="text-h2">{group.monthLabel}</h2>
                  <ul className="flex flex-col gap-y">
                    {group.items.map(event => (
                      <li key={event.uid} id={`event-${event.uid}`}>
                        <Link
                          href={getEventHref(event.title, event.uid)}
                          className="flex flex-col gap-3 group"
                        >
                          <div
                            className="text-textColorTables"
                            style={{ border: `1px solid var(--theme-text)` }}
                          >
                            <h3
                              style={{ color: `var(--theme-text--tables)` }}
                              className="w-full pt-2 pb-[5px] px-4 bg-white group-hover:bg-black group-hover:!text-white border-bottom font-sans text-sm"
                            >
                              {event.title}
                            </h3>
                            <div className="flex justify-between gap-x w-full pt-2 pb-[5px] px-4 group-hover:bg-white group-hover:text-textColorActionHover font-serif text-base text-textColor">
                              <p>{getEventLocation(event)}</p>
                              <time dateTime={event.startDate}>
                                {dateFormatter.format(
                                  new Date(event.startDate)
                                )}
                              </time>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
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
