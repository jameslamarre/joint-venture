import type { Ref, FC } from 'react'
import classNames from 'classnames'
import type { CtaProps } from './types'

export const Cta: FC<CtaProps> = props => {
  return (
    <button
      type={props.type || 'button'}
      className={classNames(
        props.className,
        'inline-flex items-center justify-center uppercase underline'
      )}
      ref={props.innerRef as Ref<HTMLButtonElement>}
      onClick={props.onClick}
    >
      <span className="relative leading-tight">{props.children}</span>
    </button>
  )
}

export default Cta
