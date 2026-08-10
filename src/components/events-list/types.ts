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
  startDate: string
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
}

export type EventsListProps = EventsPageProps
