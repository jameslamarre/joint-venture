/* eslint-disable @next/next/no-img-element */
import { Fragment, type FC, type HTMLProps } from 'react'
import classNames from 'classnames'
import { Btn } from '@components/btns'
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
      <Btn
        className="absolute pt-[2px] lg:pt-0 right-xhalf top-1/2 transform lg:-translate-y-1/2 uppercase animate-fadeIn z-header"
        onClick={() => {
          setCustomOpen(!customOpen)
        }}
        custom={true}
      >
        <div className="flex flex-col gap-[3px] md:gap-[6px] w-[23px] md:w-[37px] h-auto">
          <span
            className={classNames(
              customOpen
                ? 'rotate-45 translate-x-[1px] -translate-y-[2px] bg-white'
                : '',
              'w-full h-[3.5px] md:h-[5px] transform transition-all duration-500 origin-top-left'
            )}
            style={{ backgroundColor: 'var(--theme-text--menu)' }}
          ></span>
          <span
            className={classNames(
              customOpen ? 'opacity-0' : 'opacity-1',
              'w-full h-[3.5px] md:h-[5px] transition-opacity duration-300'
            )}
            style={{ backgroundColor: 'var(--theme-text--menu)' }}
          ></span>
          <span
            className={classNames(
              customOpen ? '-rotate-45 translate-x-[1px] bg-white' : '',
              'w-full h-[3.5px] md:h-[5px] transform transition-all duration-500 origin-bottom-left'
            )}
            style={{ backgroundColor: 'var(--theme-text--menu)' }}
          ></span>
        </div>
      </Btn>

      <div
        className={classNames(
          customOpen
            ? 'opacity-100 pointer-events-all'
            : 'opacity-0 pointer-events-none',
          'flex flex-col justify-between fixed w-dvw h-dvh top-0 right-0 pb-ydouble'
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
              className="flex relative w-full h-dvh top-page px-xhalf text-2xl pointer-events-auto"
            >
              <ul className="flex flex-col items-center justify-center gap-ydouble lg:gap-y relative w-full h-[75dvh] lg:h-[60dvh] text-center">
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
