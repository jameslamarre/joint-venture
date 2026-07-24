import { createITMPartnerClient } from '@itm-studio/partner-sdk'
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import { EventsList } from '@components/events-list'
import type { EventListItem, EventsPageProps } from '@components/events-list'

type PartnerMoment = {
  uid: string
  name: string | null
  startDate: string | null
  venue: {
    name: string | null
    city: string | null
    country: string | null
  } | null
}

type PartnerMomentsForBrandResponse = {
  moments: PartnerMoment[]
  hasNextPage: boolean
  nextCursor: string | null
}

export const getServerSideProps: GetServerSideProps<
  EventsPageProps
> = async () => {
  const token = process.env.ITM_PARTNER_TOKEN

  if (!token) {
    return {
      props: {
        events: [],
        error: 'ITM partner token is missing.',
      },
    }
  }

  try {
    const itm = createITMPartnerClient({ token })
    const upcomingEvents: EventListItem[] = []
    let cursor: string | null = null

    do {
      const queryResult = await itm.query({
        getPartnerMomentsForBrand: {
          __args: {
            status: 'UPCOMING',
            sortOrder: 'ASC',
            take: 50,
            ...(cursor ? { cursor } : {}),
          },
          moments: {
            uid: true,
            name: true,
            startDate: true,
            venue: {
              name: true,
              city: true,
              country: true,
            },
          },
          hasNextPage: true,
          nextCursor: true,
        },
      })

      const momentsResponse =
        queryResult.getPartnerMomentsForBrand as PartnerMomentsForBrandResponse

      for (const moment of momentsResponse.moments) {
        if (!moment.startDate) {
          continue
        }

        const locationParts = [moment.venue?.name, moment.venue?.city].filter(
          (value): value is string => Boolean(value)
        )

        upcomingEvents.push({
          uid: moment.uid,
          title: moment.name ?? 'Untitled Event',
          location:
            locationParts.length > 0
              ? locationParts.join(', ')
              : 'Location TBA',
          startDate: moment.startDate,
        })
      }

      cursor = momentsResponse.hasNextPage
        ? momentsResponse.nextCursor ?? null
        : null
    } while (cursor)

    const now = Date.now()

    const events = upcomingEvents
      .filter(event => new Date(event.startDate).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )

    return {
      props: {
        events,
        error: null,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown ITM error'

    return {
      props: {
        events: [],
        error: `Failed to load ITM events: ${message}`,
      },
    }
  }
}

const EventsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ events, error }) => {
  return (
    <div className="pt-page px-x max-w-container mx-auto">
      <EventsList events={events} error={error} />
    </div>
  )
}

export default EventsPage
