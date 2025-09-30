import type { Ref, FC } from 'react'
import classNames from 'classnames'
import type { CtaProps } from './types'

export const Cta: FC<CtaProps> = props => {
  return (
    <button
      type={props.type || 'button'}
      className={classNames(
        props.className,
        props.small
          ? 'w-[calc(var(--btn-width)/1.33)] h-[calc(var(--btn-width)/1.33)] px-3 text-h4'
          : 'w-btnWidth h-btnWidth px-4 text-h3',
        props.color === 'yellow'
          ? 'bg-yellow text-black hover:bg-white hover:text-black border-black'
          : 'bg-black text-white hover:bg-white hover:text-black',
        'inline-flex items-center justify-center rounded-full uppercase underline'
      )}
      ref={props.innerRef as Ref<HTMLButtonElement>}
      onClick={props.onClick}
    >
      <span className="relative leading-tight">{props.children}</span>
    </button>
  )
}

export default Cta
