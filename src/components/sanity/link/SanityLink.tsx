import type { FC, MouseEventHandler } from 'react'
import type { SanityLinkType } from '@studio/lib'
import { getHrefBySanityLink } from '@studio/lib'
import type { LinkProps } from '@components/links'
import { Link } from '@components/links'
import { Cta } from '@components/btns'
import classNames from 'classnames'
import { useRouter } from 'next/router'

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
  const { asPath } = useRouter()

  const buildHref = (): string => {
    // Prefer explicit external link if present
    if (externalLink) return externalLink

    const il: any = internalLink as any

    // microsite page: /microsite/[microsite]/[slug]
    if (il?._type === 'micrositePage') {
      const ms =
        il?.microsite?.slug?.current ||
        il?.microsite?.slug || // in case it's already flattened
        il?.micrositeSlug
      const ps = il?.slug?.current || il?.slug

      if (ms && ps) {
        return `/microsite/${ms}/${ps}`
      } else {
        return `/microsite/${ms}`
      }
    }

    // Fallback to shared resolver for other types
    return getHrefBySanityLink({
      internalLink,
      externalLink,
      anchor,
      query,
    } as SanityLinkType)
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
    if (typeof window === 'undefined') return href

    // Check if current path is a microsite
    const micrositeMatch = asPath.match(/^\/microsite\/([^\/]+)/)
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
      className={classNames(className, cta ? 'block h-full !border-none' : '')}
      onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
    >
      {cta ? (
        <Cta className={className}>
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
