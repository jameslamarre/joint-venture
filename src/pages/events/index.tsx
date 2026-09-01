import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import { EventsList } from '@components/events-list'
import type { EventsPageProps } from '@components/events-list'
import { getEventsPageProps } from '@lib/events/get-events-page-props'

export const getServerSideProps: GetServerSideProps<
  EventsPageProps
> = async () => {
  return {
    props: await getEventsPageProps(),
  }
}

const EventsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ events, error, movieGluDeferred, movieGluFilmIds }) => {
  return (
    <div className="py-page px-x max-w-container mx-auto">
      <EventsList
        events={events}
        error={error}
        movieGluDeferred={movieGluDeferred}
        movieGluFilmIds={movieGluFilmIds}
      />
    </div>
  )
}

export default EventsPage
