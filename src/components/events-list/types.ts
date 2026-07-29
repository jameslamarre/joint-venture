export type EventListItem = {
  uid: string
  title: string
  venue: string
  city: string
  startDate: string
}

export type EventsPageProps = {
  events: EventListItem[]
  error: string | null
}

export type EventsListProps = EventsPageProps
