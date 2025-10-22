import type { FC, MouseEventHandler } from 'react'
import type { SanityLinkType } from '@studio/lib'
import { getHrefBySanityLink } from '@studio/lib'
import type { LinkProps } from '@components/links'
import { Link } from '@components/links'
import { Cta } from '@components/btns'
import classNames from 'classnames'

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

  const href = withQueryAndAnchor(buildHref())
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
