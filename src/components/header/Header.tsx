/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState, type FC } from 'react'
import classNames from 'classnames'
import type { HeaderProps } from './types'
import HeaderMenu from './HeaderMenu'
import type { Menus as SanityMenu } from '@gen/sanity-schema'
import { IconHyphen } from '@components/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { isMobile, isTablet } from 'react-device-detect'

export const Header: FC<HeaderProps> = ({
  currentPage,
  setShowContent,
  className,
}) => {
  const { asPath } = useRouter()
  const onOpen = useCallback((open: boolean) => setMenuOpen(open), [])
  const [menuOpen, setMenuOpen] = useState(false)
  const [delay, setDelay] = useState(0.4)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

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
        'fixed w-full h-header mx-auto top-0 font-sans text-xl lg:text-lg z-header'
      )}
    >
      <motion.header
        role="banner"
        initial={{
          y:
            asPath === '/'
              ? isTablet && windowWidth < 1024
                ? 465
                : isMobile
                ? 290
                : 308
              : 0,
          x: 0,
        }} // Start from logo hyphen end position
        animate={{ y: 0, x: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.465, -0.2, 0.52, 0.285],
        }}
        onAnimationComplete={setShowContent}
        className="flex justify-between items-center relative w-wrap h-[26px] lg:h-[75px] top-y mx-auto text-center"
      >
        <div className="absolute w-wrap left-0 top-0 z-behind">
          <div
            className={classNames(
              menuOpen
                ? 'scale-x-[6] md:scale-x-[12] lg:scale-x-[10] scale-y-[32] md:scale-y-[40] lg:scale-y-[13.5] translate-y-[48svh]'
                : 'scale-x-[4.9] scale-y-[1.9] md:scale-x-[8.25] lg:scale-x-[3.25] lg:scale-y-[1]',
              'relative transition-all duration-500 2xl:duration-700'
            )}
          >
            <IconHyphen
              fill={menuOpen ? '#A90736' : ''}
              className={classNames(
                'w-[74px] lg:w-[190px] h-[30px] lg:h-[76px]',
                menuOpen ? '' : 'theme-menu-fill'
              )}
            />
          </div>
        </div>

        {/* color swap */}
        <button className="w-6 h-6 rounded-full z-above"></button>

        <div className="relative mt-2 mr-8 uppercase z-above">
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.span
                key="menu-key"
                initial={{ maxWidth: 0 }}
                animate={{ maxWidth: 210 }}
                exit={{ maxWidth: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="inline-block leading-none text-white overflow-hidden"
              >
                Menu
              </motion.span>
            ) : (
              <motion.span
                key="page-key"
                initial={{ maxWidth: 0 }}
                animate={{ maxWidth: 210 }}
                exit={{ maxWidth: 0 }}
                transition={{
                  duration: 0.5,
                  delay: delay,
                  ease: 'easeInOut',
                }}
                onAnimationComplete={() => setDelay(0)}
                className="inline-block leading-none overflow-hidden"
                style={{ color: 'var(--theme-text--menu)' }}
              >
                {currentPage}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <HeaderMenu
          customOpen={menuOpen}
          setCustomOpen={setMenuOpen}
          onOpen={onOpen}
          className="inline-block h-auto pointer-events-auto"
        />
      </motion.header>
    </div>
  )
}

export default Header
