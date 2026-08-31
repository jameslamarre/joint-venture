export type EventShowtimeLink = {
  label: string
  href?: string
  movieGluLookup?: {
    cinemaId: number
    filmId: number
    date: string
    time: string
  }
}

export type EventListItem = {
  uid: string
  title: string
  linkTitle?: string
  venue: string
  city: string
  state?: string
  latitude?: number | null
  longitude?: number | null
  startDate: string
  timezone?: string | null
  href?: string
  source?: 'itm' | 'movieglu'
  itemImageUrl?: string | null
  venueLogoUrl?: string | null
  showtimes?: EventShowtimeLink[]
}

export type EventsPageProps = {
  events: EventListItem[]
  error: string | null
  movieGluDeferred?: boolean
  movieGluFilmIds?: number[]
}

export type EventsListProps = EventsPageProps
