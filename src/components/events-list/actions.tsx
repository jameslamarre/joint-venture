import Link from 'next/link'

import type { EventShowtimeLink } from './types'

type EventListItemActionsProps = {
  showtimes: EventShowtimeLink[]
  pendingShowtimeKey: string | null
  onMovieGluShowtimeClick: (showtime: EventShowtimeLink, key: string) => void
  isExternalHref: (href: string) => boolean
  eventUid: string
}

export const EventListItemActions = ({
  showtimes,
  pendingShowtimeKey,
  onMovieGluShowtimeClick,
  isExternalHref,
  eventUid,
}: EventListItemActionsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {showtimes.map((showtime, index) => {
        const showtimeKey = `${eventUid}-showtime-${index}`
        const hasHref = Boolean(showtime.href)
        const isPending = pendingShowtimeKey === showtimeKey

        if (!hasHref) {
          return (
            <span key={showtimeKey} className="font-sans text-sm opacity-75">
              {showtime.label}
            </span>
          )
        }

        if (showtime.movieGluLookup) {
          return (
            <button
              key={showtimeKey}
              type="button"
              onClick={() => onMovieGluShowtimeClick(showtime, showtimeKey)}
              disabled={isPending}
              className="px-2 py-1 font-sans text-sm disabled:opacity-60 bg-[var(--theme-text)] hover:bg-[var(--theme-highlight)] text-[var(--theme-bg)] hover:text-[var(--theme-text)]"
            >
              {isPending ? 'Loading...' : showtime.label}
            </button>
          )
        }

        const href = showtime.href ?? ''
        const isExternal = isExternalHref(href)

        if (isExternal) {
          return (
            <a
              key={showtimeKey}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 font-sans text-sm bg-[var(--theme-text)] hover:bg-[var(--theme-highlight)] text-[var(--theme-bg)] hover:text-[var(--theme-text)]"
            >
              {showtime.label}
            </a>
          )
        }

        return (
          <Link
            key={showtimeKey}
            href={href}
            className="px-2 py-1 font-sans text-sm bg-[var(--theme-text)] hover:bg-[var(--theme-highlight)] text-[var(--theme-bg)] hover:text-[var(--theme-text)]"
          >
            {showtime.label}
          </Link>
        )
      })}
    </div>
  )
}
