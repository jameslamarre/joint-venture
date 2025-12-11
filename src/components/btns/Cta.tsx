import type { Ref, FC } from 'react'
import classNames from 'classnames'
import type { CtaProps } from './types'
import { motion, AnimatePresence } from 'framer-motion'

export const Cta: FC<CtaProps> = props => {
  return (
    <AnimatePresence>
      <button
        type={props.type || 'button'}
        className={classNames(
          props.className,
          'highlight highlight--hover hover:text-textColorActionHover inline-flex items-center justify-center uppercase font-sans text-xl lg:text-lg pt-1 md:pt-2 px-3 md:px-4'
        )}
        // style={{ backgroundColor: 'var(--theme-highlight)' }}
        ref={props.innerRef as Ref<HTMLButtonElement>}
        onClick={props.onClick}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3, ease: 'easeInOut' }}
          className="relative leading-none text-sm"
        >
          {props.children}
        </motion.span>
      </button>
    </AnimatePresence>
  )
}

export default Cta
