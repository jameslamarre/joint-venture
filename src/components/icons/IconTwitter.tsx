import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconTwitterComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 23 21"
      {...props}
    >
      <path
        fill={props.fill || '#000'}
        d="M17.5.904h3.374l-7.37 8.423 8.67 11.463h-6.789l-5.317-6.952-6.084 6.952H.608l7.883-9.01L.174.904h6.96l4.807 6.354 5.56-6.354ZM16.316 18.77h1.87L6.118 2.817H4.113l12.203 15.954Z"
      />
    </svg>
  )
}

export const IconTwitter = memo(IconTwitterComponent)

export default IconTwitter
