import { type FC, type HTMLProps } from 'react'
import type { FooterProps } from './types'
import classNames from 'classnames'

export const Footer: FC<FooterProps & HTMLProps<HTMLDivElement>> = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="w-full mx-auto">
      <p>{`© ${year} Joint Venture`}</p>
    </footer>
  )
}

export default Footer
