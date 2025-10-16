import type { Ref, FC } from 'react'
import classNames from 'classnames'
import type { CtaProps } from './types'

export const Cta: FC<CtaProps> = props => {
  return (
    <button
      type={props.type || 'button'}
      className={classNames(
        props.className,
        'highlight highlight--hover inline-flex items-center justify-center uppercase font-sans text-lg py-2 px-4'
      )}
      // style={{ backgroundColor: 'var(--theme-highlight)' }}
      ref={props.innerRef as Ref<HTMLButtonElement>}
      onClick={props.onClick}
    >
      <span className="relative leading-none text-sm">{props.children}</span>
    </button>
  )
}

export default Cta
