import { motion } from 'framer-motion'
import classNames from 'classnames'
import { FC, HTMLAttributes } from 'react'

interface TransitionIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  direction: 'up' | 'down'
  keyHoldProgress: number // percentage from 0 to 100
}

export const TransitionIndicator: FC<TransitionIndicatorProps> = ({
  direction,
  keyHoldProgress,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: direction === 'up' ? 40 : -40, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed h-dvh inset-0 z-above pointer-events-none flex items-center justify-center"
    >
      <div
        className={classNames(
          direction === 'up'
            ? 'top-header md:top-[calc(var(--header-height)+8px)]'
            : 'bottom-y',
          'absolute rounded-full'
        )}
      >
        <div className="relative w-[42px] h-[42px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 53 50"
            className="absolute inset-0 w-[42px] h-[42px] -rotate-90"
          >
            <path
              key="path-black"
              fill="#000"
              fillRule="evenodd"
              d="M26.12.085c7.015 0 13.524 2.11 17.416 5.658 1.553 1.423 5.38 6.77 6.328 8.716 5.086 10.286 1.93 23.205-7.506 30.728-3.253 2.598-8.483 4.037-14.71 4.039-5.884-.002-11.996-1.277-16.36-3.418-4.334-2.126-9.828-12.46-10.286-17.89-.933-10.826 1.667-17.335 9.271-23.222C14.051 1.77 19.823.085 26.12.085m-.322 8.564c-1.018 0-2.036.105-3.001.288-4.126.783-7.573 3.394-9.688 7.363-2.297 4.282-2.742 9.608-1.201 14.23 2.271 6.814 6.476 10.13 12.873 10.13 1.723 0 3.655-.234 5.9-.73 5.953-1.28 12.455-10.68 12.011-17.364C41.886 10.604 32.377 9.364 28.741 8.89l-.044-.006-.6-.078a17 17 0 0 0-2.272-.157z"
              clipRule="evenodd"
            />
          </svg>

          <motion.div
            initial={{ maxHeight: 0 }}
            animate={{ maxHeight: `${keyHoldProgress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
            style={{ backgroundColor: 'var(--theme-highlight)' }}
            className={classNames(
              direction === 'up' ? 'top-2' : 'bottom-2',
              'absolute w-3/4 h-3/4 bg-white rounded-full z-behind'
            )}
          />
        </div>
      </div>
    </motion.div>
  )
}
