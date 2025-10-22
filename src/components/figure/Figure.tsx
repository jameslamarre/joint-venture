import type { FC } from 'react'
import classNames from 'classnames'
import type { FigureProps } from './types'
import styles from './figure.module.css'

export const Figure: FC<FigureProps> = ({
  children,
  content,
  className,
  ...props
}) => (
  <figure className={classNames(styles.figure, className, 'figure')} {...props}>
    {content}
  </figure>
)

export default Figure
