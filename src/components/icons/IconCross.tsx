import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconCrossComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 81 40"
      {...props}
    >
      <path stroke="#fff" d="m80 .5-79 39M1 .5l79 39" />
    </svg>
  )
}

export const IconCross = memo(IconCrossComponent)

export default IconCross
