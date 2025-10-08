/* eslint-disable @next/next/no-img-element */
import { HTMLAttributes, type FC } from 'react'
import classNames from 'classnames'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { IconJoint, IconVen, IconTure } from '@components/icons/letters'
import { IconHyphen } from '@components/icons'

interface LogoContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const LogoContainer: FC<LogoContainerProps> = ({ className }) => {
  return (
    <AnimatePresence>
      <div
        className={classNames(
          className,
          'flex flex-col gap-y w-auto pt-page relative mx-auto'
        )}
      >
        {/* JOINT - Top row */}
        <motion.div
          initial={{ x: '0' }}
          animate={{ x: '150%' }}
          transition={{ delay: 3, duration: 1.6, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          <IconJoint className="w-[875px] h-auto" />
        </motion.div>

        {/* VEN– - Middle row */}
        <motion.div
          initial={{ x: '0' }}
          animate={{ x: '-50%' }}
          transition={{ delay: 3, duration: 1.6, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          <IconVen className="w-[616px] h-auto" />
          <motion.div
            initial={{ transform: 'scaleX(1)' }}
            animate={{ transform: 'scaleX(3.25) translateX(55%)' }}
            transition={{ delay: 3, duration: 1.6, ease: 'easeInOut' }}
            className="relative w-[190px] h-[77px] ml-[30px] mr-[40px] origin-left"
          >
            <IconHyphen className="w-full" />
          </motion.div>
        </motion.div>

        {/* TURE - Bottom row */}
        <motion.div
          initial={{ x: '0' }}
          animate={{ x: '-150%' }}
          transition={{ delay: 3, duration: 1.2, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          <IconTure className="w-[875px] h-auto" />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default LogoContainer
