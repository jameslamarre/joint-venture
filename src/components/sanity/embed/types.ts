import type { HTMLAttributes } from 'react'

export interface SanityEmbedProps extends HTMLAttributes<HTMLIFrameElement> {
  vimeo?: {
    vimeoId?: string
  }
  youtube?: {
    youtubeId?: string
  }
}
