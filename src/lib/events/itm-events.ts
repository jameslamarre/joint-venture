import { createITMPartnerClient } from '@itm-studio/partner-sdk'

import type { PartnerMomentsForBrandResponse } from './types'
import type { EventListItem } from '@components/events-list/types'

const getFallbackItmEvents = (): EventListItem[] => {
  const now = new Date()
  const currentYear = now.getUTCFullYear()
  const hasPassedFallbackDates =
    now > new Date(Date.UTC(currentYear, 7, 26, 23, 59, 59))
  const year = hasPassedFallbackDates ? currentYear + 1 : currentYear

  return [
    {
      uid: `itm-fallback-${year}-08-22`,
      title: 'ITM Fallback Example',
      venue: 'Arclight Theater',
      city: 'Los Angeles, CA',
      latitude: 34.1119,
      longitude: -118.3371,
      startDate: new Date(Date.UTC(year, 7, 22, 19, 0, 0)).toISOString(),
      source: 'itm',
    },
    {
      uid: `itm-fallback-${year}-08-26`,
      title: 'ITM Fallback Example 2',
      venue: 'Angelika Film Center',
      city: 'New York, NY',
      latitude: 40.7299,
      longitude: -73.9928,
      startDate: new Date(Date.UTC(year, 7, 26, 19, 0, 0)).toISOString(),
      source: 'itm',
    },
  ]
}

export const getItmEvents = async (token: string): Promise<EventListItem[]> => {
  const itm = createITMPartnerClient({ token })

  const fetchMomentsByStatus = async (
    status: 'UPCOMING' | 'LIVE'
  ): Promise<EventListItem[]> => {
    const mappedEvents: EventListItem[] = []
    let cursor: string | null = null

    do {
      const queryResult = await itm.query({
        getPartnerMomentsForBrand: {
          __args: {
            take: 20,
            status,
            sortOrder: 'ASC',
            filters: { includePrivate: true },
          },
          moments: {
            uid: true,
            name: true,
            startDate: true,
            coverImage: {
              url: true,
            },
            venue: {
              name: true,
              city: true,
              country: true,
            },
          },
          totalCount: true,
          hasNextPage: true,
          nextCursor: true,
        },
      })

      console.log('ITM query result:', queryResult)

      const momentsResponse =
        queryResult.getPartnerMomentsForBrand as PartnerMomentsForBrandResponse

      for (const moment of momentsResponse.moments) {
        if (!moment.startDate) {
          continue
        }

        mappedEvents.push({
          uid: moment.uid,
          title: moment.name ?? 'Untitled Event',
          venue: moment.venue?.name ?? 'Venue TBA',
          city: moment.venue?.city ?? 'City TBA',
          startDate: moment.startDate,
          source: 'itm',
          itemImageUrl: moment.coverImage?.url ?? null,
        })
      }

      cursor = momentsResponse.hasNextPage
        ? momentsResponse.nextCursor ?? null
        : null
    } while (cursor)

    return mappedEvents
  }

  const upcomingEvents = await fetchMomentsByStatus('UPCOMING')

  console.log('ITM upcoming events:', upcomingEvents)

  if (upcomingEvents.length > 0) {
    return upcomingEvents
  }

  const liveEvents = await fetchMomentsByStatus('LIVE')

  if (liveEvents.length > 0) {
    return liveEvents
  }

  return getFallbackItmEvents()
}
