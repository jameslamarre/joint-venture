/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState, type FC } from 'react'
import classNames from 'classnames'
import type { HeaderProps } from './types'
import { IconLogoLine, IconMicroHyphen } from '@components/icons'
import { motion } from 'framer-motion'
import MicrositeHeaderMenu from './MicrositeHeaderMenu'
import { Btn } from '@components/btns'

export const MicrositeHeader: FC<HeaderProps> = ({
  mainMenu,
  socials,
  className,
}) => {
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

        <Btn
          className="absolute pt-[2px] lg:pt-0 right-xhalf top-1/2 transform lg:-translate-y-1/2 uppercase animate-fadeIn z-menu"
          onClick={() => {
            setMenuOpen(!menuOpen)
          }}
          custom={true}
        >
          <div className="flex flex-col gap-[3px] md:gap-[6px] w-[23px] md:w-[37px] h-auto">
            <span
              className={classNames(
                menuOpen
                  ? 'rotate-45 translate-x-[1px] -translate-y-[2px] bg-white'
                  : '',
                'w-full h-[3.5px] md:h-[5px] transform transition-all duration-500 origin-top-left'
              )}
              style={{ backgroundColor: 'var(--theme-text--menu)' }}
            ></span>
            <span
              className={classNames(
                menuOpen ? 'opacity-0' : 'opacity-1',
                'w-full h-[3.5px] md:h-[5px] transition-opacity duration-300'
              )}
              style={{ backgroundColor: 'var(--theme-text--menu)' }}
            ></span>
            <span
              className={classNames(
                menuOpen ? '-rotate-45 translate-x-[1px] bg-white' : '',
                'w-full h-[3.5px] md:h-[5px] transform transition-all duration-500 origin-bottom-left'
              )}
              style={{ backgroundColor: 'var(--theme-text--menu)' }}
            ></span>
          </div>
        </Btn>

        <MicrositeHeaderMenu
          mainMenu={mainMenu}
          socials={socials}
          customOpen={menuOpen}
          setCustomOpen={setMenuOpen}
          onOpen={onOpen}
          className="inline-block h-auto pointer-events-auto z-2"
        />
      </motion.header>
    </div>
  )
}

export default MicrositeHeader
