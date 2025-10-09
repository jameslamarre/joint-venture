/* eslint-disable @next/next/no-img-element */
import { HTMLAttributes, type FC } from 'react'
import classNames from 'classnames'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { IconJoint, IconVen, IconTure } from '@components/icons/letters'
import { IconHyphen } from '@components/icons'

interface LogoContainerProps extends HTMLAttributes<HTMLDivElement> {
  setShowIntro?: () => void
}

export const LogoContainer: FC<LogoContainerProps> = ({
  setShowIntro,
  className,
}) => {
  const jointVariants = {
    initial: { x: 0 },
    animate: {
      x: [0, 350, 700, 1050, 1400],
      opacity: [1, 1, 1, 1, 0],
      transition: {
        delay: 1.6,
        duration: 2.2,
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
      x: [0, 0, -250, -500, -750],
      opacity: [1, 1, 1, 1, 0],
      transition: {
        delay: 1.8,
        duration: 2,
        ease: ['easeIn', 'linear', 'linear', 'linear', 'easeOut'],
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  }

  const hyphenVariants = {
    initial: { transform: 'scaleX(1)' },
    animate: {
      transform: [
        'scaleX(1)',
        'scaleX(3.25) translateX(0)',
        'scaleX(3.25) translateX(-80px)',
        'scaleX(3.25) translateX(-160px)',
        'scaleX(3.25) translateX(-160px)', // Center position to match header
      ],
      transition: {
        delay: 1.7,
        duration: 2.3,
        ease: ['easeIn', 'linear', 'linear', 'linear', 'easeOut'],
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  }

  const tureVariants = {
    initial: { x: 0 },
    animate: {
      x: [0, -300, -600, -900, -1200],
      opacity: [1, 1, 1, 1, 0],
      transition: {
        delay: 2,
        duration: 2,
        ease: ['easeIn', 'linear', 'linear', 'linear', 'easeOut'],
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  }

  return (
    <AnimatePresence>
      <div
        className={classNames(
          className,
          'flex flex-col gap-y w-auto mt-ydouble relative mx-auto'
        )}
      >
        {/* JOINT - Top row */}
        <motion.div
          variants={jointVariants}
          initial="initial"
          animate="animate"
          className="flex items-center justify-center"
        >
          <IconJoint className="w-[875px] h-auto" />
        </motion.div>

        {/* VEN– - Middle row */}
        <div className="flex items-center justify-start relative">
          <motion.div
            variants={venVariants}
            initial="initial"
            animate="animate"
          >
            <IconVen className="w-[616px] h-auto" />
          </motion.div>
          <motion.div
            variants={hyphenVariants}
            initial="initial"
            animate="animate"
            onAnimationComplete={setShowIntro}
            className="absolute w-[190px] h-[77px] right-0 ml-[30px] mr-[40px] origin-left"
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
          <IconTure className="w-[875px] h-auto" />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default LogoContainer
