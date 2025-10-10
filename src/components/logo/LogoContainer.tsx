/* eslint-disable @next/next/no-img-element */
import { HTMLAttributes, useEffect, useState, type FC } from 'react'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { IconJoint, IconVen, IconTure } from '@components/icons/letters'
import { IconHyphen } from '@components/icons'
import { isMobile, isTablet } from 'react-device-detect'

interface LogoContainerProps extends HTMLAttributes<HTMLDivElement> {
  setShowIntro?: () => void
}

export const LogoContainer: FC<LogoContainerProps> = ({
  setShowIntro,
  className,
}) => {
  const [isMobileSize, setIsMobileSize] = useState(isMobile)
  const [isTabletSize, setIsTabletSize] = useState(isTablet)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768) // Adjust breakpoint as needed
      setIsTabletSize(window.innerWidth >= 768 && window.innerWidth < 1024) // Adjust breakpoint as needed
      setLoaded(true)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!loaded) return null

  const jointVariants = {
    initial: { x: 0 },
    animate: {
      x: isMobileSize ? [0, 150, 300, 450, 600] : [0, 350, 700, 1050, 1400],
      opacity: [1, 1, 1, 1, 0],
      transition: {
        delay: 1.4,
        duration: 1.8,
        ease: [
          [0.465, -0.3, 0.52, 0.285],
          'linear',
          'linear',
          'linear',
          'easeOut',
        ],
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  }

  const venVariants = {
    initial: { x: 0 },
    animate: {
      x: isMobileSize
        ? [0, 0, -112.5, -225, -337.5, -450]
        : [0, 0, -250, -500, -750, -1000],
      opacity: [1, 1, 1, 1, 1, 0],
      transition: {
        delay: 1.6,
        duration: 1.6,
        ease: ['linear', 'linear', 'linear', 'linear', 'linear', 'easeOut'],
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    },
  }

  const hyphenVariants = {
    initial: { transform: 'scaleX(1)' },
    animate: {
      transform: isTabletSize
        ? [
            'scaleX(1)',
            'scaleX(8.25) translateX(0)',
            'scaleX(8.25) translateX(-27px)',
            'scaleX(8.25) scaleY(2.25) translateX(-47px)',
          ]
        : isMobileSize
        ? [
            'scaleX(1)',
            'scaleX(4.9) translateX(0)',
            'scaleX(4.9) translateX(-27px)',
            'scaleX(4.9) scaleY(2.25) translateX(-53px)',
          ]
        : [
            'scaleX(1)',
            'scaleX(3.25) translateX(0)',
            'scaleX(3.25) translateX(-80px)',
            'scaleX(3.25) translateX(-160px)', // Center position to match header
          ],
      transition: {
        delay: 1.6,
        duration: 1.5,
        ease: ['easeIn', 'linear', 'linear', 'linear'],
        times: [0, 0.33, 0.66, 1],
      },
    },
  }

  const tureVariants = {
    initial: { x: 0 },
    animate: {
      x: isMobileSize
        ? [0, 0, -137.5, -275, -412.5, -550]
        : [0, -240, -480, -720, -960, -1200],
      opacity: [1, 1, 1, 1, 1, 0],
      transition: {
        delay: 1.7,
        duration: 1.1,
        ease: ['easeIn', 'linear', 'linear', 'linear', 'linear', 'easeOut'],
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    },
  }

  return (
    <AnimatePresence>
      <div
        className={classNames(
          className,
          'flex flex-col justify-center lg:items-start gap-y relative w-auto h-[100dvh] lg:h-auto lg:mt-ydouble mx-auto'
        )}
      >
        {/* JOINT - Top row */}
        <motion.div
          variants={jointVariants}
          initial="initial"
          animate="animate"
          className="flex items-center justify-center"
        >
          <IconJoint className="w-[342px] lg:w-[875px] h-auto" />
        </motion.div>

        {/* VEN– - Middle row */}
        <div className="flex items-center justify-start relative w-full">
          <motion.div
            variants={venVariants}
            initial="initial"
            animate="animate"
          >
            <IconVen className="w-[241px] lg:w-[616px] h-auto" />
          </motion.div>
          <motion.div
            variants={hyphenVariants}
            initial="initial"
            animate="animate"
            onAnimationComplete={setShowIntro}
            className="absolute w-[74px] lg:w-[190px] h-[30px] lg:h-[76px] right-0 ml-[20px] lg:ml-[30px] mr-[15px] lg:mr-[40px] origin-left"
          >
            <IconHyphen className="w-full theme-menu-fill" />
          </motion.div>
        </div>

        {/* TURE - Bottom row */}
        <motion.div
          variants={tureVariants}
          initial="initial"
          animate="animate"
          className="flex items-center justify-center"
        >
          <IconTure className="w-[342px] lg:w-[875px] h-auto" />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default LogoContainer
