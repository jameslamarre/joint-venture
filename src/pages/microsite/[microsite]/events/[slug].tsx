import { createITMPartnerClient } from '@itm-studio/partner-sdk'
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'

import { getUidFromEventSlug } from '@components/events-list'
import { Event } from '@components/event/Event'
import type { EventContent } from '@components/event/Event'
import { getMicrositeEventsBasePath } from '@lib/microsite/events-path'
import {
  getMicrositeByKey,
  type MicrositeShellData,
} from '@lib/microsite/get-microsite-by-key'

type MicrositeEventDetailPageProps = {
  data: MicrositeShellData[]
  preview: boolean
  slug: string
  backHref: string
  event: EventContent | null
  error: string | null
}

type PartnerMoment = {
  uid: string
  slug: string | null
  name: string | null
  description: string | null
  startDate: string | null
  timezone: string | null
  coverImage: {
    url: string | null
  } | null
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
  MicrositeEventDetailPageProps
> = async context => {
  const micrositeParam = context.params?.microsite
  const micrositeKey = Array.isArray(micrositeParam)
    ? micrositeParam[0]
    : micrositeParam

  const slugParam = context.params?.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

  if (!micrositeKey || !slug) {
    return { notFound: true }
  }

  const microsite = await getMicrositeByKey(micrositeKey)

  if (!microsite) {
    return { notFound: true }
  }

  const backHref = getMicrositeEventsBasePath(
    micrositeKey,
    context.req.headers.host
  )

  const uid = getUidFromEventSlug(slug)

  if (!uid) {
    return { notFound: true }
  }

  const token = process.env.ITM_PARTNER_TOKEN

  if (!token) {
    return {
      props: {
        data: [microsite],
        preview: false,
        slug: micrositeKey,
        backHref,
        event: null,
        error: 'ITM partner token is missing.',
      },
    }
  }

  try {
    const itm = createITMPartnerClient({ token })
    let cursor: string | null = null
    let matchedMoment: PartnerMoment | null = null

    do {
      const queryResult = await itm.query({
        getPartnerMomentsForBrand: {
          __args: {
            sortOrder: 'ASC',
            take: 50,
            ...(cursor ? { cursor } : {}),
            filters: { includePrivate: true },
          },
          moments: {
            uid: true,
            slug: true,
            name: true,
            description: true,
            startDate: true,
            timezone: true,
            coverImage: {
              url: true,
            },
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

      matchedMoment =
        momentsResponse.moments.find(moment => moment.uid === uid) || null

      if (matchedMoment) {
        break
      }

      cursor = momentsResponse.hasNextPage
        ? momentsResponse.nextCursor ?? null
        : null
    } while (cursor)

    if (!matchedMoment || !matchedMoment.startDate) {
      return { notFound: true }
    }

    const locationParts = [
      matchedMoment.venue?.name,
      matchedMoment.venue?.city,
      matchedMoment.venue?.country,
    ].filter((value): value is string => Boolean(value))

    return {
      props: {
        data: [microsite],
        preview: false,
        slug: micrositeKey,
        backHref,
        event: {
          uid: matchedMoment.uid,
          momentSlug: matchedMoment.slug ?? null,
          title: matchedMoment.name ?? 'Untitled Event',
          startDate: matchedMoment.startDate,
          timezone: matchedMoment.timezone ?? null,
          location:
            locationParts.length > 0
              ? locationParts.join(', ')
              : 'Location TBA',
          description: matchedMoment.description ?? '',
          imageUrl: matchedMoment.coverImage?.url ?? null,
        },
        error: null,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown ITM error'

    return {
      props: {
        data: [microsite],
        preview: false,
        slug: micrositeKey,
        backHref,
        event: null,
        error: `Failed to load ITM event: ${message}`,
      },
    }
  }
}

const MicrositeEventDetailPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ event, error, backHref }) => {
  if (error) {
    return <p>{error}</p>
  }

  if (!event) {
    return <p>Event not found.</p>
  }

  return <Event event={event} backHref={backHref} />
}

export default MicrositeEventDetailPage
