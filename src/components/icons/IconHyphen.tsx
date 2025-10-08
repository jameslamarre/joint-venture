import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconHyphenComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 190 77"
      {...props}
    >
      <path
        fill="#000"
        d="M1.28 1.02C29.937-.063 59.124.283 87.41.63c24.501.3 97.169.346 101.672.392v75.484L.033 74.73 1.257 1.02h.023Z"
      />
    </svg>
  )
}

export const IconHyphen = memo(IconHyphenComponent)

export default IconHyphen
