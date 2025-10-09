/* eslint-disable @next/next/no-img-element */
import { useCallback, useState, type FC } from 'react'
import classNames from 'classnames'
import type { HeaderProps } from './types'
import HeaderMenu from './HeaderMenu'
import type { Menus as SanityMenu } from '@gen/sanity-schema'
import Link from 'next/link'
import { IconHyphen } from '@components/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

export const Header: FC<HeaderProps> = ({
  mainMenu,
  currentPage,
  pageBackground,
  setShowContent,
  className,
}) => {
  const { asPath } = useRouter()
  const onOpen = useCallback((open: boolean) => setMenuOpen(open), [])
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      id="header"
      className={classNames(
        className,
        'fixed w-full h-header mx-auto top-0 font-sans text-xl z-header'
      )}
    >
      <motion.header
        role="banner"
        initial={{ y: asPath === '/' ? 391 : 0, x: 0 }} // Start from logo hyphen end position
        animate={{ y: 0, x: 0 }}
        transition={{
          duration: 1.2,
          delay: 0.7, // Start just after logo animation
          ease: 'easeInOut',
        }}
        onAnimationComplete={setShowContent}
        className="flex justify-between items-center relative w-wrap h-[75px] top-y mx-auto text-center"
      >
        <div className="absolute w-wrap left-0 top-0 z-behind">
          <div
            className={classNames(
              menuOpen
                ? 'scale-x-[4] md:scale-x-[5] lg:scale-x-[8] 2xl:scale-x-[10] scale-y-[13.5] translate-y-[48svh]'
                : 'scale-x-[3.25]',
              'relative transition-all duration-500 2xl:duration-700'
            )}
          >
            <IconHyphen
              fill={menuOpen ? '#A90736' : 'black'}
              className="w-[190px] h-[76px]"
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
                animate={{ maxWidth: 200 }}
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
                animate={{ maxWidth: 200 }}
                exit={{ maxWidth: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={classNames(
                  pageBackground === 'green' ? 'text-yellow' : 'text-black',
                  'inline-block leading-none overflow-hidden'
                )}
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
          mainMenu={mainMenu as SanityMenu}
          pageBackground={pageBackground}
          className="inline-block h-auto pointer-events-auto"
        />
      </motion.header>
    </div>
  )
}

export default Header
