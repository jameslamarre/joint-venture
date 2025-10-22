/* eslint-disable @next/next/no-img-element */
import { type FC, type HTMLProps } from 'react'
import classNames from 'classnames'
import type { HeaderMenuProps } from './types'
import { AnimatePresence, motion } from 'framer-motion'
import { SanityLink } from '@components/sanity'
import { SanityLinkType } from '@studio/lib'
import { useRouter } from 'next/router'
import {
  IconFacebook,
  IconInstagram,
  IconTiktok,
  IconYoutube,
} from '@components/icons'
import Link from 'next/link'
import { RoughNotation } from 'react-rough-notation'
import { isMobile } from 'react-device-detect'

export const MicrositeHeaderMenu: FC<
  HeaderMenuProps & HTMLProps<HTMLDivElement>
> = ({
  customOpen = false,
  setCustomOpen,
  onOpen,
  mainMenu,
  socials,
  className,
}) => {
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
              className="flex relative w-full h-dvh px-xhalf text-xl md:text-2xl pointer-events-auto"
            >
              <ul className="flex flex-col items-center justify-center gap-y lg:gap-y relative w-full h-[95dvh] lg:h-[70dvh] text-center">
                {mainMenu?.items?.map(({ _key, text, link }, index) => {
                  return text && link ? (
                    <li key={_key}>
                      <SanityLink
                        onClick={
                          setCustomOpen ? () => setCustomOpen(false) : undefined
                        }
                        {...(link as SanityLinkType)}
                        className="inline-block text-black hover:text-white uppercase"
                      >
                        {asPath !== '' &&
                        asPath.includes(
                          `/${
                            (link as SanityLinkType)?.internalLink?.slug
                              ?.current
                          }`
                        ) ? (
                          <RoughNotation
                            type="underline"
                            show={true}
                            color="#A90736"
                            strokeWidth={isMobile ? 2.5 : 4}
                            iterations={1}
                            padding={isMobile ? -2 : -6}
                            animationDelay={100}
                            animationDuration={600}
                          >
                            {text}
                          </RoughNotation>
                        ) : (
                          <span>{text}</span>
                        )}
                      </SanityLink>
                    </li>
                  ) : null
                })}
              </ul>

              {socials && (
                <ul className="absolute flex justify-center items-center gap-x left-1/2 bottom-y lg:bottom-ydouble transform -translate-x-1/2">
                  {socials.instagram && (
                    <li>
                      <Link
                        href={socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-auto h-fit hover:text-red"
                      >
                        <IconInstagram className="w-auto h-10" />
                      </Link>
                    </li>
                  )}

                  {socials.youtube && (
                    <li>
                      <Link
                        href={socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-auto h-fit hover:text-red"
                      >
                        <IconYoutube className="w-auto h-7" />
                      </Link>
                    </li>
                  )}

                  {socials.tiktok && (
                    <li>
                      <Link
                        href={socials.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-auto h-fit hover:text-red"
                      >
                        <IconTiktok className="w-auto h-10" />
                      </Link>
                    </li>
                  )}

                  {socials.facebook && (
                    <li>
                      <Link
                        href={socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-auto h-fit hover:text-red"
                      >
                        <IconFacebook className="w-auto h-7" />
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MicrositeHeaderMenu
