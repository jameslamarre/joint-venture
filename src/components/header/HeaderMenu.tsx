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
  IconJoin,
  IconJV,
} from '@components/icons/menu'
import { AnimatePresence, motion } from 'framer-motion'
import { isMobile, ViewProps } from 'react-device-detect'
import { useView } from '@contexts/view'
import IconEvents from '@components/icons/menu/IconEvents'

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
      { x: isMobile ? '10%' : '25%', y: isMobile ? 100 : 120 },
      { x: isMobile ? '25%' : '50%', y: isMobile ? 220 : 230 },
      { x: isMobile ? '55%' : '57.5%', y: isMobile ? 90 : 450 },
      { x: isMobile ? '20%' : '40%', y: isMobile ? 480 : 600 },
      { x: isMobile ? '30%' : '22.5%', y: isMobile ? 350 : 400 },
      { x: isMobile ? '52%' : '43%', y: isMobile ? 260 : 330 },
    ],
    [
      { x: isMobile ? '35%' : '55%', y: isMobile ? 100 : 120 },
      { x: isMobile ? '8%' : '25%', y: isMobile ? 200 : 260 },
      { x: isMobile ? '55%' : '50%', y: isMobile ? 310 : 480 },
      { x: isMobile ? '20%' : '35%', y: isMobile ? 480 : 700 },
      { x: isMobile ? '15%' : '20%', y: isMobile ? 390 : 480 },
      { x: isMobile ? '48%' : '46%', y: isMobile ? 230 : 340 },
    ],
    [
      { x: isMobile ? '5%' : '25%', y: isMobile ? 90 : 100 },
      { x: isMobile ? '35%' : '45%', y: isMobile ? 190 : 240 },
      { x: isMobile ? '10%' : '30%', y: isMobile ? 410 : 570 },
      { x: isMobile ? '45%' : '57.5%', y: isMobile ? 380 : 580 },
      { x: isMobile ? '20%' : '37.5%', y: isMobile ? 300 : 400 },
      { x: isMobile ? '52%' : '65%', y: isMobile ? 250 : 410 },
    ],
    [
      { x: isMobile ? '5%' : '22%', y: isMobile ? 200 : 260 },
      { x: isMobile ? '30%' : '45%', y: isMobile ? 80 : 140 },
      { x: isMobile ? '15%' : '30%', y: isMobile ? 320 : 455 },
      { x: isMobile ? '40%' : '57.5%', y: isMobile ? 440 : 570 },
      { x: isMobile ? '40%' : '45%', y: isMobile ? 250 : 320 },
      { x: isMobile ? '55%' : '26%', y: isMobile ? 190 : 600 },
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
                    href="/about"
                    onClick={() => {
                      setCustomOpen(false)
                      updateView({
                        ...view,
                        previousPage: view?.page,
                        nextPage: 'about',
                      })
                    }}
                    className="hover:invert"
                  >
                    <IconAbout className="w-[124px] lg:w-[235px] h-auto" />
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
                        previousPage: view?.page,
                        nextPage: 'films',
                      })
                    }}
                    className="group"
                  >
                    <IconFilms className="w-[117px] lg:w-[223px] h-auto group-hover:[&_.bg]:fill-blue" />
                  </Link>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[position][5]?.x || 100,
                    top: positions[position][5]?.y || 200,
                  }}
                >
                  <Link
                    href="/events"
                    onClick={() => {
                      setCustomOpen(false)
                      updateView({
                        ...view,
                        previousPage: view?.page,
                        nextPage: 'events',
                      })
                    }}
                    className="group"
                  >
                    <IconEvents className="w-[117px] lg:w-[223px] h-auto group-hover:[&_.bg]:fill-white" />
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
                    href="/join"
                    onClick={() => {
                      setCustomOpen(false)
                      updateView({
                        ...view,
                        previousPage: view?.page,
                        nextPage: 'join',
                      })
                    }}
                    className="hover:invert"
                  >
                    <IconJoin className="w-[95px] lg:w-[190px] h-auto" />
                  </Link>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[position][4]?.x || 200,
                    top: positions[position][4]?.y || 300,
                  }}
                >
                  <Link
                    href="mailto:info@ajointventure.com"
                    target="_blank"
                    className="hover:invert"
                  >
                    <IconContact className="w-[170px] lg:w-[346px] h-auto" />
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
                  <Link
                    href="/"
                    onClick={() => {
                      setCustomOpen(false)
                      updateView({
                        ...view,
                        previousPage: view?.page,
                        nextPage: '',
                      })
                    }}
                    className="hover:invert"
                  >
                    <IconJV className="w-[130px] lg:w-[273px] h-auto z-behind" />
                  </Link>
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
