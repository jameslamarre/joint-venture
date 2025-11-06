import { type FC, ButtonHTMLAttributes } from 'react'
import { IconLogo } from '@components/icons'
import { motion } from 'framer-motion'
import IconLogoFill from '@components/icons/IconLogoFill'

interface LogoButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'stone' | 'yellow' | 'blue' | 'dark'
  asPath?: string
  cycleTheme: () => void
}

export const LogoButton: FC<LogoButton> = ({ cycleTheme, className }) => {
  return (
    <motion.button
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
      onClick={cycleTheme}
      className="group fixed w-[100px] md:w-[134px] right-[calc(50%-40px)] md:right-[calc(50%-57px)] lg:right-x bottom-x p-2 rounded-full z-above"
    >
      <IconLogo className="w-full h-auto animate-fadeIn theme-menu-fill group-hover:hidden" />
      <IconLogoFill className="hidden relative w-full h-auto theme-menu-fill group-hover:block" />
    </motion.button>
  )
}

export default LogoButton
