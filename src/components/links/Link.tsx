/* eslint-disable jsx-a11y/anchor-is-valid */

import type { FC } from 'react'
import classNames from 'classnames'
import NextLink from 'next/link'
import type { LinkProps } from './types'
import styles from './link.module.css'

export const Link: FC<LinkProps> = ({
  external,
  active,
  className,
  children,
  ...props
}) => {
  return (
    <NextLink
      className={classNames(
        styles.link,
        { [styles.active]: active },
        className
      )}
      onClick={props.onClick}
      {...props}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {children}
    </NextLink>
  )
}

export default Link
