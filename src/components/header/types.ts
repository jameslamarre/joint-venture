import type { Dispatch, HTMLAttributes, SetStateAction } from 'react'
import type { Menus as SanityMenu } from '@gen/sanity-schema'

export interface HeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
  currentPage?: string
  pageBackground?: string
  mainMenu?: SanityMenu
  socials?: {
    instagram?: string
    youtube?: string
    tiktok?: string
    facebook?: string
  }
  showContent?: boolean
  setShowContent?: () => void
}

export interface HeaderMenuProps extends HeaderProps {
  customOpen?: boolean
  setCustomOpen: Dispatch<SetStateAction<boolean>>
  onOpen?: (open: boolean) => void
  closeMenu?: () => void
}
