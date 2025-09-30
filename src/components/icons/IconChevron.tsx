import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconChevronComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 5 8"
      {...props}
    >
      <path stroke="#fff" d="M.535.464 4.071 4 .535 7.536" />
    </svg>
  )
}

export const IconChevron = memo(IconChevronComponent)

export default IconChevron
