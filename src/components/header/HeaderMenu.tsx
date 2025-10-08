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
import { useState, useEffect } from 'react'

export const HeaderMenu: FC<HeaderMenuProps & HTMLProps<HTMLDivElement>> = ({
  customOpen = false,
  setCustomOpen,
  onOpen,
  className,
}) => {
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>(
    []
  )

  // Generate random positions on mount and when menu opens
  useEffect(() => {
    if (customOpen) {
      const newPositions: Array<{ x: number; y: number }> = []
      const usedAreas: Array<{
        width: number
        height: number
        x: number
        y: number
      }> = [] // Track occupied areas to prevent overlap

      const items = [
        { width: 285, height: 100 }, // About
        { width: 273, height: 80 }, // Films
        { width: 416, height: 120 }, // Contact
        { width: 323, height: 100 }, // JV
      ]

      items.forEach((item, index) => {
        let attempts = 0
        let position: { x: number; y: number }

        do {
          position = {
            x: Math.random() * (window.innerWidth - item.width - 250) + 1,
            y: Math.random() * (window.innerHeight - item.height - 350) + 100,
          }
          attempts++
        } while (
          attempts < 20 &&
          usedAreas.some(
            (area: any) =>
              position.x < area.x + area.width + 100 &&
              position.x + item.width + 100 > area.x &&
              position.y < area.y + area.height + 100 &&
              position.y + item.height + 100 > area.y
          )
        )

        usedAreas.push({ ...position, ...item })
        newPositions.push(position)
      })

      setPositions(newPositions)
    }
  }, [customOpen])

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
                : 'bg-stone',
              'w-full h-[5px] transform transition-all duration-500 origin-top-left'
            )}
          ></span>
          <span
            className={classNames(
              customOpen ? 'opacity-0' : 'opacity-1',
              'w-full h-[5px] bg-stone transition-opacity duration-300'
            )}
          ></span>
          <span
            className={classNames(
              customOpen ? '-rotate-45 translate-x-[1px] bg-white' : 'bg-stone',
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
          'flex flex-col justify-between fixed w-[100vw] h-[100vh] top-0 right-0 px-xhalf md:px-xdouble pb-ydouble bg-red text-white text-left transition-opacity'
        )}
      >
        <div
          className={classNames(
            customOpen ? 'pointer-events-auto' : '',
            'flex items-center absolute w-full h-header pointer-events-none'
          )}
        >
          <Link
            href="/"
            className="flex items-center relative pointer-events-auto"
          >
            <span className="sr-only">Joint Venture</span>
          </Link>
        </div>

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
                    left: positions[0]?.x || 0,
                    top: positions[0]?.y || 0,
                  }}
                >
                  <button className="hover:invert">
                    <IconAbout className="w-[285px] h-auto" />
                  </button>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[1]?.x || 100,
                    top: positions[1]?.y || 200,
                  }}
                >
                  <button className="group">
                    <IconFilms className="w-[273px] h-auto [&_.bg]:group-hover:fill-blue" />
                  </button>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[2]?.x || 200,
                    top: positions[2]?.y || 300,
                  }}
                >
                  <button className="hover:invert">
                    <IconContact className="w-[416px] h-auto" />
                  </button>
                </motion.li>

                <motion.li
                  variants={itemVariants}
                  className="absolute"
                  style={{
                    left: positions[3]?.x || 300,
                    top: positions[3]?.y || 400,
                  }}
                >
                  <IconJV className="w-[323px] h-auto hover:invert z-behind" />
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
