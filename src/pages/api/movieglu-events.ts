import type { NextApiRequest, NextApiResponse } from 'next'

import type { EventListItem } from '@components/events-list/types'
import { getMovieGluEvents } from '@lib/events/movieglu-events'

type MovieGluEventsResponse = {
  events: EventListItem[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MovieGluEventsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const requestedFilmId = Array.isArray(req.query.filmId)
      ? req.query.filmId[0]
      : req.query.filmId
    const parsedFilmId = requestedFilmId ? Number(requestedFilmId) : undefined
    const filmId =
      typeof parsedFilmId === 'number' &&
      Number.isFinite(parsedFilmId) &&
      parsedFilmId > 0
        ? parsedFilmId
        : undefined

    const events = await getMovieGluEvents(filmId)

    return res.status(200).json({ events })
  } catch {
    return res.status(200).json({ events: [] })
  }
}
