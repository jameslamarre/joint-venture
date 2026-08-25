import type { NextApiRequest, NextApiResponse } from 'next'

import type { EventListItem } from '@components/events-list/types'
import {
  getMovieGluEvents,
  getMovieGluEventsForFilmIds,
} from '@lib/events/movieglu-events'

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
    const requestedFilmIds = Array.isArray(req.query.filmIds)
      ? req.query.filmIds[0]
      : req.query.filmIds
    const parsedFilmIds =
      typeof requestedFilmIds === 'string'
        ? requestedFilmIds
            .split(',')
            .map(value => Number(value.trim()))
            .filter(value => Number.isFinite(value) && value > 0)
        : []

    if (typeof requestedFilmIds === 'string' && parsedFilmIds.length === 0) {
      return res.status(200).json({ events: [] })
    }

    if (parsedFilmIds.length > 0) {
      const events = await getMovieGluEventsForFilmIds(parsedFilmIds)
      return res.status(200).json({ events })
    }

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
