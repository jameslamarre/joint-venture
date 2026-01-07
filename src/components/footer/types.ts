import type { HTMLAttributes } from 'react'
import type { Menus as SanityMenu } from '@gen/sanity-schema'

export interface FooterProps
  extends Omit<HTMLAttributes<HTMLElement>, 'content'> {
  altLogo?: boolean
  footerMenu?: SanityMenu
  newsletterId?: string
}
