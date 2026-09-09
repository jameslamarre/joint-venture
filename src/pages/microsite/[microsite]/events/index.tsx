import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'

import {
  EventsList,
  getEventSlug,
  type EventListItem,
  type EventsPageProps,
} from '@components/events-list'
import { getEventsPageProps } from '@lib/events/get-events-page-props'
import { getMicrositeEventsBasePath } from '@lib/microsite/events-path'
import {
  getMicrositeByKey,
  type MicrositeShellData,
} from '@lib/microsite/get-microsite-by-key'

type MicrositeEventsPageProps = EventsPageProps & {
  data: MicrositeShellData[]
  preview: boolean
  slug: string
}

const withMicrositeEventHrefs = (
  events: EventListItem[],
  basePath: string
): EventListItem[] => {
  return events.map(event => {
    if (event.source === 'movieglu' || event.href) {
      return event
    }

    return {
      ...event,
      href: `${basePath}/${getEventSlug(
        event.linkTitle ?? event.title,
        event.uid
      )}`,
    }
  })
}

export const getServerSideProps: GetServerSideProps<
  MicrositeEventsPageProps
> = async context => {
  const micrositeParam = context.params?.microsite
  const micrositeKey = Array.isArray(micrositeParam)
    ? micrositeParam[0]
    : micrositeParam

  if (!micrositeKey) {
    return { notFound: true }
  }

  const microsite = await getMicrositeByKey(micrositeKey)

  if (!microsite) {
    return { notFound: true }
  }

  const eventsPageProps = await getEventsPageProps({
    movieGluFilmIds: [microsite.movieGluId ?? null],
  })
  const basePath = getMicrositeEventsBasePath(
    micrositeKey,
    context.req.headers.host
  )

  return {
    props: {
      ...eventsPageProps,
      events: withMicrositeEventHrefs(eventsPageProps.events, basePath),
      data: [microsite],
      preview: false,
      slug: micrositeKey,
    },
  }
}

const MicrositeEventsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ events, error, movieGluDeferred, movieGluFilmIds }) => {
  return (
    <div className="flex flex-col gap-ydouble pt-ydouble pb-page px-x max-w-container mx-auto">
      <h1 className="text-h1 mx-auto text-center">Events</h1>

      <EventsList
        events={events}
        error={error}
        movieGluDeferred={movieGluDeferred}
        movieGluFilmIds={movieGluFilmIds}
      />
    </div>
  )
}

export default MicrositeEventsPage
