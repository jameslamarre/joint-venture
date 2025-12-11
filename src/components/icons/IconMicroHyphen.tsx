import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconMicroHyphenComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 345 69"
      {...props}
    >
      <path
        fill={props.fill || '#000'}
        d="M2.565.826C54.788-.145 107.978.165 159.528.475c44.648.269 177.077.31 185.283.351v67.6L.293 66.835 2.523.826z"
      />
    </svg>
  )
}

export const IconMicroHyphen = memo(IconMicroHyphenComponent)

export default IconMicroHyphen
