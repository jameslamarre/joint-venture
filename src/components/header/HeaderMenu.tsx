/* eslint-disable @next/next/no-img-element */
import type { FC, HTMLProps } from 'react'
import classNames from 'classnames'
import { Btn } from '@components/btns'
import type { HeaderMenuProps } from './types'
import Link from 'next/link'
import {
  IconAbout,
  IconContact,
  IconFilms,
  IconJV,
} from '@components/icons/menu'
import { AnimatePresence, motion } from 'framer-motion'
import { isMobile, ViewProps } from 'react-device-detect'
import { useView } from '@contexts/view'

export const HeaderMenu: FC<HeaderMenuProps & HTMLProps<HTMLDivElement>> = ({
  customOpen = false,
  setCustomOpen,
  onOpen,
  className,
}) => {
  const [view, updateView] = useView() as any

  const position = Math.floor(Math.random() * 4)

  const positions = [
    [
      { x: isMobile ? '5%' : '25%', y: 120 },
      { x: isMobile ? '25%' : '50%', y: 230 },
      { x: isMobile ? '30%' : '57.5%', y: 450 },
      { x: isMobile ? '20%' : '40%', y: 600 },
    ],
    [
      { x: isMobile ? '35%' : '55%', y: 120 },
      { x: isMobile ? '5%' : '25%', y: 300 },
      { x: isMobile ? '30%' : '50%', y: 500 },
      { x: isMobile ? '15%' : '35%', y: 700 },
    ],
    [
      { x: isMobile ? '5%' : '25%', y: 100 },
      { x: isMobile ? '25%' : '45%', y: 300 },
      { x: isMobile ? '10%' : '30%', y: 570 },
      { x: isMobile ? '35%' : '57.5%', y: 500 },
    ],
    [
      { x: isMobile ? '0' : '22%', y: 260 },
      { x: isMobile ? '20%' : '45%', y: 140 },
      { x: isMobile ? '10%' : '30%', y: 455 },
      { x: isMobile ? '30%' : '57.5%', y: 570 },
    ],
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.125,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div className={className}>
      <Btn
        className="absolute right-xhalf md:right-0 top-1/2 transform -translate-y-1/2 uppercase animate-fadeIn z-header"
        onClick={() => {
          setCustomOpen(!customOpen)
        }}
        custom={true}
      >
        <div className="flex flex-col gap-[3px] md:gap-[6px] w-[23px] md:w-[37px] h-auto">
          <span
            className={classNames(
              customOpen
                ? 'rotate-45 translate-x-[1px] -translate-y-[2px] bg-white'
                : '',
              'w-full h-[3.5px] md:h-[5px] transform transition-all duration-500 origin-top-left'
            )}
            style={
              !customOpen
                ? { backgroundColor: 'var(--theme-text--menu)' }
                : undefined
            }
          ></span>
          <span
            className={classNames(
              customOpen ? 'opacity-0' : 'opacity-1',
              'w-full h-[3.5px] md:h-[5px] transition-opacity duration-300'
            )}
            style={
              !customOpen
                ? { backgroundColor: 'var(--theme-text--menu)' }
                : undefined
            }
          ></span>
          <span
            className={classNames(
              customOpen ? '-rotate-45 translate-x-[1px] bg-white' : '',
              'w-full h-[3.5px] md:h-[5px] transform transition-all duration-500 origin-bottom-left'
            )}
            style={
              !customOpen
                ? { backgroundColor: 'var(--theme-text--menu)' }
                : undefined
            }
          ></span>
        </div>
      </Btn>

      <div
        className={classNames(
          customOpen
            ? 'opacity-100 pointer-events-all'
            : 'opacity-0 pointer-events-none',
          'flex flex-col justify-between fixed w-[100vw] h-[100vh] top-0 right-0 px-xhalf pb-ydouble'
        )}
      >
        <AnimatePresence>
          {customOpen && (
            <motion.nav
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full pointer-events-auto"
            >
              <motion.ul className="relative w-full h-full">
                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[position][0]?.x || 0,
                    top: positions[position][0]?.y || 0,
                  }}
                >
                  <Link
                    href="/"
                    onClick={() => {
                      setCustomOpen(false)
                      updateView({
                        ...view,
                        previousPage: view.page,
                        nextPage: 'about',
                      })
                    }}
                    className="hover:invert"
                  >
                    <IconAbout className="w-[184px] lg:w-[285px] h-auto" />
                  </Link>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[position][1]?.x || 100,
                    top: positions[position][1]?.y || 200,
                  }}
                >
                  <Link
                    href="/films"
                    onClick={() => {
                      setCustomOpen(false)
                      updateView({
                        ...view,
                        previousPage: view.page,
                        nextPage: 'films',
                      })
                    }}
                    className="group"
                  >
                    <IconFilms className="w-[177px] lg:w-[273px] h-auto group-hover:[&_.bg]:fill-blue" />
                  </Link>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[position][2]?.x || 200,
                    top: positions[position][2]?.y || 300,
                  }}
                >
                  <Link
                    href="/contact"
                    onClick={() => {
                      setCustomOpen(false)
                      updateView({
                        ...view,
                        previousPage: view.page,
                        nextPage: 'contact',
                      })
                    }}
                    className="hover:invert"
                  >
                    <IconContact className="w-[269px] lg:w-[416px] h-auto" />
                  </Link>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[position][3]?.x || 300,
                    top: positions[position][3]?.y || 400,
                  }}
                >
                  <IconJV className="w-[210px] lg:w-[323px] h-auto z-behind" />
                </motion.li>
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default HeaderMenu
