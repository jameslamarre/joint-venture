import type { SanityDocument } from 'sanity'

export type PageDocument = SanityDocument & {
  slug?: {
    _type: 'slug'
    current: string
  }
}
