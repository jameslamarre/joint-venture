import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconPlayComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 56 56"
      {...props}
    >
      <circle cx="28" cy="28" r="27.5" stroke="#fff" />
      <path fill="#fff" d="m35 27.5-11.25 6.495v-12.99L35 27.5Z" />
    </svg>
  )
}

export const IconPlay = memo(IconPlayComponent)

export default IconPlay
