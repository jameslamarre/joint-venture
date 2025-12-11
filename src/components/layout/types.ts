import { type ReactNode } from 'react'
import type {
  Microsite,
  MicrositePage,
  Page,
  Project,
  SiteSettings,
} from '@gen/sanity-schema'

export type PageData = Page | Project
export type MicrositeData = Microsite | MicrositePage

export interface AltLayoutProps {
  children?: ReactNode | undefined
  preview?: boolean
  data?: MicrositeData[]
}

export interface LayoutProps {
  children?: ReactNode | undefined
  preview?: boolean
  data?: PageData[]
  siteSettings?: SiteSettings | undefined
}

export type ThemeName = 'stone' | 'yellow' | 'blue' | 'dark'
