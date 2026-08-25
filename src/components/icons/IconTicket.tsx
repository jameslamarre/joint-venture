import type { SVGProps } from 'react'
import { memo } from 'react'

export const IconTicketComponent = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 72 72"
      {...props}
    >
      <g
        stroke={props.stroke || '#a59f8d'}
        stroke-miterlimit="10"
        clip-path="url(#asdhfsakjlh)"
      >
        <path
          stroke-width="3"
          d="M51.059 35.714a4.607 4.607 0 0 1 4.255-4.592.38.38 0 0 0 .351-.382l.004-6.16a.384.384 0 0 0-.384-.383h-9.812c-.362 0-.72.084-1.043.246a2.33 2.33 0 0 1-2.089.004 2.34 2.34 0 0 0-1.043-.247l-25.161-.003a.384.384 0 0 0-.384.384v6.156a.38.38 0 0 0 .352.382 4.606 4.606 0 0 1 0 9.184.38.38 0 0 0-.352.382v6.156a.384.384 0 0 0 .384.384H41.3c.362 0 .72-.084 1.044-.246a2.33 2.33 0 0 1 2.089-.004c.323.162.68.247 1.042.246h9.813a.384.384 0 0 0 .383-.383v-6.156a.38.38 0 0 0-.351-.382 4.607 4.607 0 0 1-4.262-4.586Z"
        />
        <path
          stroke-linecap="round"
          stroke-width="2"
          d="M43.387 27.267v-2.303m0 8.444v-1.535m0 7.676v-1.535m0 8.444v-2.303"
        />
      </g>
    </svg>
  )
}

export const IconTicket = memo(IconTicketComponent)

export default IconTicket
