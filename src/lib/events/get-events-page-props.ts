import type { EventsPageProps } from '@components/events-list'

import { getItmEvents } from './itm-events'
import { getMovieGluEvents } from './movieglu-events'

export const getEventsPageProps = async (): Promise<EventsPageProps> => {
  const token = process.env.ITM_PARTNER_TOKEN
  const shouldLoadMovieGluOnServer =
    process.env.MOVIEGLU_LOAD_ON_SERVER === 'true'

  try {
    const loadErrors: string[] = []

    const [itmResult, movieGluResult] = await Promise.allSettled([
      token ? getItmEvents(token) : Promise.resolve([]),
      shouldLoadMovieGluOnServer ? getMovieGluEvents() : Promise.resolve([]),
    ])

    const itmEvents = itmResult.status === 'fulfilled' ? itmResult.value : []
    const movieGluEvents =
      movieGluResult.status === 'fulfilled' ? movieGluResult.value : []

    if (!token) {
      loadErrors.push('ITM partner token is missing.')
    } else if (itmResult.status === 'rejected') {
      loadErrors.push(
        `Failed to load ITM events: ${
          itmResult.reason instanceof Error
            ? itmResult.reason.message
            : 'Unknown ITM error'
        }`
      )
    }

    if (movieGluResult.status === 'rejected') {
      loadErrors.push(
        `Failed to load MovieGLU showtimes: ${
          movieGluResult.reason instanceof Error
            ? movieGluResult.reason.message
            : 'Unknown MovieGLU error'
        }`
      )
    }

    const now = Date.now()

    const events = [...itmEvents, ...movieGluEvents]
      .filter(event => new Date(event.startDate).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )

    return {
      events,
      movieGluDeferred: !shouldLoadMovieGluOnServer,
      error:
        events.length === 0 && loadErrors.length > 0
          ? loadErrors.join(' ')
          : null,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown events loader error'

    return {
      events: [],
      movieGluDeferred: !shouldLoadMovieGluOnServer,
      error: `Failed to load events: ${message}`,
    }
  }
}
