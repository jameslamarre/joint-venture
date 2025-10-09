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

export const HeaderMenu: FC<HeaderMenuProps & HTMLProps<HTMLDivElement>> = ({
  customOpen = false,
  setCustomOpen,
  onOpen,
  pageBackground,
  className,
}) => {
  const position = Math.floor(Math.random() * 4)

  const positions = [
    [
      { x: '5%', y: 120 },
      { x: '40%', y: 250 },
      { x: '60%', y: 450 },
      { x: '35%', y: 600 },
    ],
    [
      { x: '50%', y: 120 },
      { x: '20%', y: 300 },
      { x: '45%', y: 500 },
      { x: '30%', y: 700 },
    ],
    [
      { x: '20%', y: 100 },
      { x: '40%', y: 300 },
      { x: '5%', y: 550 },
      { x: '40%', y: 500 },
    ],
    [
      { x: '10%', y: 250 },
      { x: '35%', y: 150 },
      { x: '20%', y: 425 },
      { x: '60%', y: 510 },
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
        className="absolute right-0 top-1/2 transform -translate-y-1/2 uppercase animate-fadeIn z-header"
        onClick={() => {
          setCustomOpen(!customOpen)
        }}
        custom={true}
      >
        <div className="flex flex-col gap-[6px] w-[37px] h-auto">
          <span
            className={classNames(
              customOpen
                ? 'rotate-45 translate-x-[1px] -translate-y-[2px] bg-white'
                : pageBackground === 'green'
                ? 'bg-yellow'
                : 'bg-stone',
              'w-full h-[5px] transform transition-all duration-500 origin-top-left'
            )}
          ></span>
          <span
            className={classNames(
              customOpen ? 'opacity-0' : 'opacity-1',
              pageBackground === 'green' ? 'bg-yellow' : 'bg-stone',
              'w-full h-[5px] transition-opacity duration-300'
            )}
          ></span>
          <span
            className={classNames(
              customOpen
                ? '-rotate-45 translate-x-[1px] bg-white'
                : pageBackground === 'green'
                ? 'bg-yellow'
                : 'bg-stone',
              'w-full h-[5px] transform transition-all duration-500 origin-bottom-left'
            )}
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
                  <Link href="/" className="hover:invert">
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
                  <Link href="/films" className="group">
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
                  <Link href="/contact" className="hover:invert">
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
                  <IconJV className="w-[210px] lg:w-[323px] h-auto hover:invert z-behind" />
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
