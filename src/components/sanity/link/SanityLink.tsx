import type { FC, MouseEventHandler } from 'react'
import type { SanityLinkType } from '@studio/lib'
import { getHrefBySanityLink } from '@studio/lib'
import type { LinkProps } from '@components/links'
import { Link } from '@components/links'
import { Cta } from '@components/btns'
import classNames from 'classnames'

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

const normalizeDynamicMicrositeHref = (href: string): string => {
  const trimmedHref = href.trim()

  if (!trimmedHref.startsWith('/')) {
    return trimmedHref
  }

  const micrositeKey = getMicrositeKeyFromCurrentLocation()

  if (!micrositeKey) {
    return trimmedHref
  }

  const withMicrosite = trimmedHref.replace(
    /\[(microsite)\]|%5Bmicrosite%5D/gi,
    micrositeKey
  )
  const withoutSlugToken = withMicrosite.replace(
    /\/\[(slug)\]|\/%5Bslug%5D/gi,
    ''
  )
  const normalized = withoutSlugToken.replace(/\/+/g, '/')

  return normalized || '/'
}

type SanityLinkProps = SanityLinkType &
  Omit<LinkProps, 'href'> & {
    text?: string
    cta?: boolean
    smallCta?: boolean
  }

export const SanityLink: FC<SanityLinkProps> = ({
  text,
  internalLink,
  query,
  externalLink,
  anchor,
  cta = false,
  onClick,
  className,
  children,
}) => {
  const buildHref = (): string => {
    // Prefer explicit external link if present
    if (externalLink) return normalizeDynamicMicrositeHref(externalLink)

    const il: any = internalLink as any

    // microsite page: /microsite/[microsite]/[slug]
    if (il?._type === 'micrositePage') {
      const rawMicrosite =
        il?.micrositeSlug ||
        il?.microsite?.slug?.current ||
        il?.microsite?.slug || // in case it's already flattened
        il?.micrositeSlug
      const rawPageSlug = il?.slug?.current || il?.slug
      const ms =
        rawMicrosite && !isDynamicRouteToken(rawMicrosite)
          ? rawMicrosite
          : getMicrositeKeyFromCurrentLocation()
      const ps =
        rawPageSlug && !isDynamicRouteToken(rawPageSlug)
          ? rawPageSlug
          : undefined
      const isMicrositeHome = il?.isMicrositeHome === true

      if (ms && isMicrositeHome) {
        return normalizeDynamicMicrositeHref(`/microsite/${ms}`)
      }

      if (ms && ps) {
        return normalizeDynamicMicrositeHref(`/microsite/${ms}/${ps}`)
      }

      if (ms) {
        return normalizeDynamicMicrositeHref(`/microsite/${ms}`)
      }

      return '/'
    }

    // Fallback to shared resolver for other types
    return normalizeDynamicMicrositeHref(
      getHrefBySanityLink({
        internalLink,
        externalLink,
        anchor,
        query,
      } as SanityLinkType)
    )
  }

  const withQueryAndAnchor = (base: string): string => {
    let href = base
    if (query && typeof query === 'object' && Object.keys(query).length) {
      const qs = new URLSearchParams(
        query as unknown as Record<string, string>
      ).toString()
      href += (href.includes('?') ? '&' : '?') + qs
    }
    if (anchor) href += `#${anchor}`
    return href
  }

  const normalizeMicrositePath = (href: string): string => {
    // Only normalize in production/client-side when we're in a microsite context
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production')
      return href

    // Check if we're on a microsite subdomain
    const hostname = window.location.hostname
    const micrositeMatch = hostname.match(/^(.+)\.ajointventure\.com$/)
    if (!micrositeMatch) return href

    const micrositeName = micrositeMatch[1]

    // If the href contains the microsite prefix, strip it
    const micrositePrefix = `/microsite/${micrositeName}`
    if (href.startsWith(micrositePrefix)) {
      return href.replace(micrositePrefix, '') || '/'
    }

    return href
  }

  const href = normalizeMicrositePath(withQueryAndAnchor(buildHref()))
  const external = !!externalLink

  return (
    <Link
      href={href}
      external={external}
      className={classNames(className, cta ? '' : '')}
      onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
    >
      {cta ? (
        <Cta type="button">
          {text}
          {children}
        </Cta>
      ) : (
        <>
          {text}
          {children}
        </>
      )}
    </Link>
  )
}

export default SanityLink
