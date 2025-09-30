import type { HTMLAttributes } from 'react'
import type { Media } from '@gen/sanity-schema'

export interface FooterProps
  extends Omit<HTMLAttributes<HTMLElement>, 'content'> {
  content?: {
    _key?: string
    title?: string
    url: string
    icon?: Media
  }[]
  newsletterId?: string
}
