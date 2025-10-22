/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState, type FC } from 'react'
import classNames from 'classnames'
import type { HeaderProps } from './types'
import { IconLogoLine, IconMicroHyphen } from '@components/icons'
import { motion } from 'framer-motion'
import MicrositeHeaderMenu from './MicrositeHeaderMenu'

export const MicrositeHeader: FC<HeaderProps> = ({ mainMenu, className }) => {
  const onOpen = useCallback((open: boolean) => setMenuOpen(open), [])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    menuOpen
      ? document.body.classList.add('overflow-hidden')
      : document.body.classList.remove('overflow-hidden')
  }, [menuOpen])

  return (
    <div
      id="header"
      className={classNames(
        className,
        'block lg:fixed relative w-auto h-header mx-auto lg:right-2 font-sans text-xl lg:text-lg z-header'
      )}
    >
      <motion.header
        role="banner"
        className="flex justify-between items-center relative w-[345px] h-[48px] lg:h-[68px] px-xhalf pt-[22px] lg:pt-0 top-0 lg:top-4 lg:right-2"
      >
        <div className="absolute w-[345px] left-0 top-0 scale-y-[0.705] lg:scale-y-[1] z-menu">
          <IconMicroHyphen className="w-[345px] h-auto" />
        </div>

        <IconLogoLine
          fill="var(--theme-text--menu)"
          className="relative w-[215px] h-auto z-menu"
        />

        <MicrositeHeaderMenu
          mainMenu={mainMenu}
          customOpen={menuOpen}
          setCustomOpen={setMenuOpen}
          onOpen={onOpen}
          className="inline-block h-auto pointer-events-auto z-menu"
        />
      </motion.header>
    </div>
  )
}

export default MicrositeHeader
