import type { ReactNode, HTMLAttributes } from 'react'

export interface FigureProps extends HTMLAttributes<HTMLElement> {
  media?: ReactNode
  contentClass?: string
  mediaClass?: string
}
