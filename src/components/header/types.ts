import type { Dispatch, HTMLAttributes, SetStateAction } from 'react'

export interface HeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
  currentPage?: string
  pageBackground?: string
  setShowContent?: () => void
}

export interface HeaderMenuProps extends HeaderProps {
  customOpen?: boolean
  setCustomOpen: Dispatch<SetStateAction<boolean>>
  onOpen?: (open: boolean) => void
  closeMenu?: () => void
}
