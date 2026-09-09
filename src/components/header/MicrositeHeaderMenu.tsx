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
import { getMicrositeEventsBasePath } from '@lib/microsite/events-path'

const isDynamicRouteToken = (value?: string): boolean => {
  if (typeof value !== 'string') {
    return false
  }

  const trimmedValue = value.trim()

  if (/^\[[^\]]+\]$/.test(trimmedValue)) {
    return true
  }

  const decodedValue = (() => {
    try {
      return decodeURIComponent(trimmedValue)
    } catch {
      return trimmedValue
    }
  })()

  return /^\[[^\]]+\]$/.test(decodedValue) || /%5B[^%]+%5D/i.test(trimmedValue)
}

const getMicrositeKeyFromCurrentLocation = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const hostMatch = window.location.hostname.match(
    /^([^.]+)\.ajointventure\.com$/
  )

  if (hostMatch?.[1] && !isDynamicRouteToken(hostMatch[1])) {
    return hostMatch[1]
  }

  const pathMatch = window.location.pathname.match(/^\/microsite\/([^/]+)/)

  if (pathMatch?.[1] && !isDynamicRouteToken(pathMatch[1])) {
    return pathMatch[1]
  }

  return undefined
}

export const MicrositeHeaderMenu: FC<
  HeaderMenuProps & HTMLProps<HTMLDivElement>
> = ({
  customOpen = false,
  setCustomOpen,
  onOpen,
  mainMenu,
  movieGluId,
  socials,
  className,
}) => {
  const { asPath, query } = useRouter()
  const normalizedAsPath = asPath.split('?')[0].split('#')[0]

  const micrositeParam = query.microsite
  const rawMicrositeFromQuery = Array.isArray(micrositeParam)
    ? micrositeParam[0]
    : micrositeParam
  const rawMicrositeFromPath =
    asPath.match(/^\/microsite\/([^\/]+)/)?.[1] ?? undefined
  const micrositeFromQuery =
    rawMicrositeFromQuery && !isDynamicRouteToken(rawMicrositeFromQuery)
      ? rawMicrositeFromQuery
      : undefined
  const micrositeFromPath =
    rawMicrositeFromPath && !isDynamicRouteToken(rawMicrositeFromPath)
      ? rawMicrositeFromPath
      : undefined
  const micrositeKey =
    micrositeFromQuery ||
    micrositeFromPath ||
    getMicrositeKeyFromCurrentLocation()

  const hasMovieGluId =
    movieGluId !== null &&
    movieGluId !== undefined &&
    `${movieGluId}`.trim() !== ''

  const ticketsHref = micrositeKey
    ? getMicrositeEventsBasePath(
        micrositeKey,
        typeof window === 'undefined' ? undefined : window.location.host
      )
    : '/events'

  const isTicketsActive =
    asPath === ticketsHref || asPath.startsWith(`${ticketsHref}/`)

  const micrositeHomeHref = (() => {
    if (typeof window !== 'undefined') {
      const hostMatch = window.location.hostname.match(
        /^([^.]+)\.ajointventure\.com$/
      )

      if (hostMatch?.[1] && hostMatch[1] !== 'www') {
        return '/'
      }
    }

    if (micrositeKey) {
      return `/microsite/${micrositeKey}`
    }

    const micrositePathMatch = normalizedAsPath.match(/^\/microsite\/([^/]+)/)

    if (
      micrositePathMatch?.[1] &&
      !isDynamicRouteToken(micrositePathMatch[1])
    ) {
      return `/microsite/${micrositePathMatch[1]}`
    }

    return '/'
  })()

  const isHomeActive =
    normalizedAsPath === micrositeHomeHref ||
    (micrositeHomeHref === '/' && normalizedAsPath === '/')

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
                {mainMenu?.items?.map(({ _key, text, link }) => {
                  const isHomeItem = text?.trim().toLowerCase() === 'home'

                  if (isHomeItem && text) {
                    return (
                      <li key={_key}>
                        <Link
                          href={micrositeHomeHref}
                          onClick={
                            setCustomOpen
                              ? () =>
                                  setTimeout(() => setCustomOpen(false), 150)
                              : undefined
                          }
                          className="inline-block text-[var(--theme-text)] hover:text-[var(--theme-highlight)] uppercase"
                        >
                          {isHomeActive ? (
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
                        </Link>
                      </li>
                    )
                  }

                  return text && link ? (
                    <li key={_key}>
                      <SanityLink
                        onClick={
                          setCustomOpen
                            ? () => setTimeout(() => setCustomOpen(false), 150)
                            : undefined
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

                {hasMovieGluId ? (
                  <li>
                    <Link
                      href={ticketsHref}
                      onClick={
                        setCustomOpen
                          ? () => setTimeout(() => setCustomOpen(false), 150)
                          : undefined
                      }
                      className="inline-block text-[var(--theme-text)] hover:text-[var(--theme-highlight)] uppercase"
                    >
                      {isTicketsActive ? (
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
                          Buy Tickets
                        </RoughNotation>
                      ) : (
                        <span>Buy Tickets</span>
                      )}
                    </Link>
                  </li>
                ) : null}
              </ul>

              <div className="absolute flex flex-col justify-center items-center gap-yhalf left-1/2 bottom-y lg:bottom-ydouble transform -translate-x-1/2">
                <Link href="https://www.ajointventure.com" target="_blank">
                  <IconLogoFull
                    className="w-auto h-[100px] md:h-[88px]"
                    fill="var(--theme-text)"
                  />
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
