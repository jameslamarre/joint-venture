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
  const href = getHrefBySanityLink({
    internalLink,
    externalLink,
    anchor,
    query,
  } as SanityLinkType)
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
