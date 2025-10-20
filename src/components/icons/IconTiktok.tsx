import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconTiktokComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18.86 10.47a4.281 4.281 0 0 1-3.977-1.916l.001 6.593a4.873 4.873 0 1 1-4.873-4.873c.102 0 .202.01.302.016v2.4c-.1-.011-.199-.03-.302-.03a2.487 2.487 0 0 0 0 4.974c1.374 0 2.587-1.082 2.587-2.456l.024-11.196h2.297a4.279 4.279 0 0 0 3.944 3.82v2.668"
      ></path>
    </svg>
  )
}

export const IconTiktok = memo(IconTiktokComponent)

export default IconTiktok
