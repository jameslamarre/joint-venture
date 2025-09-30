import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconCarrotComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 5 8"
      {...props}
    >
      <path
        stroke={props.stroke || '#000'}
        strokeWidth={props.strokeWidth || '1'}
        d="M.535.464 4.071 4 .535 7.535"
      />
    </svg>
  )
}

export const IconCarrot = memo(IconCarrotComponent)

export default IconCarrot
