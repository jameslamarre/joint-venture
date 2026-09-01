/* eslint-disable @next/next/no-img-element */
import { EventListItemActions } from './actions'
import type {
  EventListItem as EventListItemType,
  EventShowtimeLink,
} from './types'

const formatEventTime = (
  startDate: string,
  timezone?: string | null
): string => {
  const normalizedTimezone = timezone?.trim() || undefined

  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: normalizedTimezone,
    }).format(new Date(startDate))
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(startDate))
  }
}

const formatEventDate = (
  startDate: string,
  timezone?: string | null
): string => {
  const normalizedTimezone = timezone?.trim() || undefined

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: normalizedTimezone,
    }).format(new Date(startDate))
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(startDate))
  }
}

type EventListItemProps = {
  event: EventListItemType
  eventHref: string
  venueLocationLabel: string
  pendingShowtimeKey: string | null
  onMovieGluShowtimeClick: (showtime: EventShowtimeLink, key: string) => void
  isExternalHref: (href: string) => boolean
}

export const EventListItem = ({
  event,
  eventHref,
  venueLocationLabel,
  pendingShowtimeKey,
  onMovieGluShowtimeClick,
  isExternalHref,
}: EventListItemProps) => {
  const shouldRenderItmImage = event.source === 'itm'

  const showtimes: EventShowtimeLink[] =
    event.source === 'movieglu' && (event.showtimes?.length ?? 0) > 0
      ? event.showtimes ?? []
      : [
          {
            label: formatEventTime(event.startDate, event.timezone),
            href: eventHref,
          },
        ]

  return (
    <li key={event.uid} id={`event-${event.uid}`}>
      <div
        className="flex text-textColorTables"
        style={{ border: `1px solid var(--theme-text)` }}
      >
        {shouldRenderItmImage ? (
          <div
            className="relative shrink-0 w-[72px] bg-gray-300"
            style={{ aspectRatio: '4 / 5' }}
            aria-hidden={event.itemImageUrl ? undefined : true}
          >
            {event.itemImageUrl ? (
              <img
                src={event.itemImageUrl}
                alt={`${event.title} event image`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        ) : null}

        <div className="flex-1 min-w-0">
          <h3
            style={{ color: `var(--theme-text--tables)` }}
            className="w-full pt-2 pb-[5px] px-4 bg-white border-bottom font-sans text-base"
          >
            {event.title}
          </h3>
          <div
            style={{ color: `var(--theme-text--tables)` }}
            className="w-full pt-2 pb-[5px] px-4 bg-white border-bottom font-sans text-sm flex items-center justify-between gap-x-3"
          >
            <h4 className="font-serif text-base min-w-0">
              {venueLocationLabel}
            </h4>
            {event.venueLogoUrl ? (
              <img
                src={event.venueLogoUrl}
                alt={`${event.venue} logo`}
                className="w-auto max-w-[96px] h-[18px] object-contain shrink-0"
                loading="lazy"
              />
            ) : null}
          </div>
          <div className="flex justify-between gap-x w-full pt-2 pb-[5px] px-4 font-sans text-sm leading-tight ">
            <EventListItemActions
              showtimes={showtimes}
              pendingShowtimeKey={pendingShowtimeKey}
              onMovieGluShowtimeClick={onMovieGluShowtimeClick}
              isExternalHref={isExternalHref}
              eventUid={event.uid}
            />
            <time
              style={{ color: `var(--theme-text)` }}
              dateTime={event.startDate}
            >
              {formatEventDate(event.startDate, event.timezone)}
            </time>
          </div>
        </div>
      </div>
    </li>
  )
}
