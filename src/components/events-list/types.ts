export type EventListItem = {
  uid: string
  title: string
  location: string
  startDate: string
}

export type EventsPageProps = {
  events: EventListItem[]
  error: string | null
}

export type EventsListProps = EventsPageProps
