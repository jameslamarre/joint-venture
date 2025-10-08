import classNames from 'classnames'
import type { SVGProps } from 'react'
import { memo } from 'react'

interface IconHamburgerProps extends SVGProps<SVGSVGElement> {
  open?: boolean
}

export const IconHamburgerComponent = (props: IconHamburgerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 38 26"
      {...props}
    >
      <path
        className={classNames(
          !props.open ? 'rotate-45' : '',
          'transform transition-all duration-500 origin-top-left'
        )}
        fill="#a59f8d"
        d="M.059.02h37.723v4.836H.059z"
      />
      <path
        className={classNames(
          !props.open ? 'opacity-0' : 'opacity-1',
          'transition-opacity duration-300'
        )}
        fill="#a59f8d"
        d="M.059 10.499h37.723v4.836H.059z"
      />
      <path
        className={classNames(
          !props.open ? '-rotate-45' : '',
          'transform transition-all duration-500 origin-bottom-left'
        )}
        fill="#a59f8d"
        d="M.059 20.979h37.723v4.836H.059z"
      />
    </svg>
  )
}

export const IconHamburger = memo(IconHamburgerComponent)

export default IconHamburger
