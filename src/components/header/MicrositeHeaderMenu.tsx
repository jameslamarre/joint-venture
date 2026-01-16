/* eslint-disable @next/next/no-img-element */
import { type FC, type HTMLProps } from 'react'
import classNames from 'classnames'
import type { HeaderMenuProps } from './types'
import { AnimatePresence, motion } from 'framer-motion'
import { SanityLink } from '@components/sanity'
import { SanityLinkType } from '@studio/lib'
import { useRouter } from 'next/router'
import { RoughNotation } from 'react-rough-notation'
import { isMobile } from 'react-device-detect'
import { Socials } from '@components/socials'
import Link from 'next/link'
import { IconLogoFull } from '@components/icons'

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

  // Helper to check if link is active
  const isActiveLink = (link: SanityLinkType) => {
    const slug = link.internalLink?.slug?.current
    if (!slug || !asPath) return false

    // Strip microsite prefix for comparison
    const micrositeMatch = asPath.match(/^\/microsite\/([^\/]+)/)
    const normalizedPath = micrositeMatch
      ? asPath.replace(`/microsite/${micrositeMatch[1]}`, '')
      : asPath

    return normalizedPath.includes(`/${slug}`)
  }

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
              <ul className="flex flex-col items-center justify-center gap-y lg:gap-y relative w-full h-[80dvh] lg:h-[70dvh] text-center">
                {mainMenu?.items?.map(({ _key, text, link }, index) => {
                  return text && link ? (
                    <li key={_key}>
                      <SanityLink
                        onClick={
                          setCustomOpen ? () => setCustomOpen(false) : undefined
                        }
                        {...(link as SanityLinkType)}
                        className="inline-block text-[var(--theme-text)] hover:text-[var(--theme-highlight)] uppercase"
                      >
                        {isActiveLink(link as SanityLinkType) ? (
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

              <div className="absolute flex flex-col justify-center items-center gap-yhalf left-1/2 bottom-y lg:bottom-ydouble transform -translate-x-1/2">
                <Link href="https://www.ajointventure.com" target="_blank">
                  <IconLogoFull className="w-auto h-[100px] md:h-[88px] fill-[var(--theme-text)]" />
                </Link>

                {socials && (
                  <Socials
                    socials={socials}
                    className="flex justify-center items-center gap-x"
                  />
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MicrositeHeaderMenu
