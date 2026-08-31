export type PartnerMoment = {
  uid: string
  name: string | null
  startDate: string | null
  timezone?: string | null
  coverImage?: {
    url: string | null
  } | null
  venue?: {
    name: string | null
    city: string | null
    country: string | null
  } | null
}

export type PartnerMomentsForBrandResponse = {
  moments: PartnerMoment[]
  totalCount?: number
  hasNextPage: boolean
  nextCursor: string | null
}

export type MovieGluShowingTime = {
  start_time: string
}

export type MovieGluShowingVariant = {
  film_id: number
  film_name?: string
  film_title?: string
  title?: string
  times: MovieGluShowingTime[]
}

export type MovieGluCinema = {
  cinema_id: number
  cinema_name: string
  city?: string
  state?: string
  lat?: number | string
  lng?: number | string
  url?: string
  showings: Record<string, MovieGluShowingVariant>
}

export type MovieGluFilmShowTimesResponse = {
  cinemas?: MovieGluCinema[]
}

export type MovieGluCinemaDetailsResponse = {
  cinema_id?: number
  logo_url?: string | null
}

export type MovieGluPurchaseConfirmationResponse = {
  url?: string
}
