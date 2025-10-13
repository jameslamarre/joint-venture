import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type PageTransitionProps = HTMLMotionProps<'div'>
type PageTransitionRef = React.ForwardedRef<HTMLDivElement>

function PageTransition(
  { children }: PageTransitionProps,
  ref: PageTransitionRef
) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.95 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.95 }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

export default forwardRef(PageTransition)
