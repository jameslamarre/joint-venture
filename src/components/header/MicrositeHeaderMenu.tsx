/* eslint-disable @next/next/no-img-element */
import { type FC, type HTMLProps } from 'react'
import classNames from 'classnames'
import type { HeaderMenuProps } from './types'
import { AnimatePresence, motion } from 'framer-motion'
import { SanityLink } from '@components/sanity'
import { SanityLinkType } from '@studio/lib'
import { useRouter } from 'next/router'

export const MicrositeHeaderMenu: FC<
  HeaderMenuProps & HTMLProps<HTMLDivElement>
> = ({ customOpen = false, setCustomOpen, onOpen, mainMenu, className }) => {
  const { asPath } = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  }

  return (
    <div className={className}>
      <div
        className={classNames(
          customOpen
            ? 'opacity-100 pointer-events-all'
            : 'opacity-0 pointer-events-none',
          'flex flex-col justify-between fixed w-dvw h-dvh top-0 right-0 z-2'
        )}
      >
        <AnimatePresence>
          {customOpen && (
            <motion.nav
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ backgroundColor: 'var(--theme-bg)' }}
              className="flex relative w-full h-dvh px-xhalf text-2xl pointer-events-auto"
            >
              <ul className="flex flex-col items-center justify-center gap-ydouble lg:gap-y relative w-full h-[80dvh] lg:h-[70dvh] text-center">
                {mainMenu?.items?.map(({ _key, text, link }, index) => {
                  return text && link ? (
                    <li key={_key}>
                      <SanityLink
                        text={text}
                        onClick={
                          setCustomOpen ? () => setCustomOpen(false) : undefined
                        }
                        {...(link as SanityLinkType)}
                        className={classNames(
                          asPath !== '' &&
                            asPath.includes(
                              `/${
                                (link as SanityLinkType)?.internalLink?.slug
                                  ?.current
                              }`
                            )
                            ? 'underline underline-offset-4 decoration-4'
                            : '',
                          'inline-block text-black hover:text-white uppercase'
                        )}
                      />
                    </li>
                  ) : null
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MicrositeHeaderMenu
