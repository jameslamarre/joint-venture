import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconFacebookComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 25 24"
      {...props}
    >
      <g clip-path="url(#aspdfjsal)">
        <path
          fill={props.fill || '#000'}
          d="M12.346 0c-6.628 0-12 5.373-12 12 0 5.628 3.874 10.35 9.101 11.647v-7.98H6.973V12h2.474v-1.58c0-4.084 1.849-5.978 5.858-5.978.76 0 2.073.15 2.61.298v3.324c-.284-.03-.776-.044-1.387-.044-1.968 0-2.728.745-2.728 2.683V12h3.92l-.674 3.667H13.8v8.245c5.942-.717 10.546-5.777 10.546-11.912 0-6.627-5.373-12-12-12Z"
        />
      </g>
      <defs>
        <clipPath id="aspdfjsal">
          <path fill="#fff" d="M.346 0h24v24h-24z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export const IconFacebook = memo(IconFacebookComponent)

export default IconFacebook
