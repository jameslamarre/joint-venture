import type { FC } from 'react'
import NextImage from 'next/image'
import { useNextSanityImage } from 'next-sanity-image'
import type { SanityImageObject } from '@sanity/image-url/lib/types/types'
import type { SanityImageProps as SanityImagePropsType } from './types'
import { client } from '@studio/lib'

interface SanityImageProps extends SanityImageObject {
  props: SanityImagePropsType
  className?: string
  onLoadingComplete?: () => void
}

export const SanityImage: FC<SanityImageProps> = ({
  asset,
  className,
  props,
  onLoadingComplete,
}) => {
  const imageProps = useNextSanityImage(client, asset)
  const placeholder = props?.lqip ? 'blur' : 'empty'

  // Destructure the width and height from imageProps
  const { width, height } = imageProps || {}

  return imageProps ? (
    <NextImage
      src={imageProps.src}
      loader={imageProps.loader}
      width={width || undefined}
      height={height || undefined}
      placeholder={placeholder}
      blurDataURL={props?.lqip}
      onLoadingComplete={onLoadingComplete}
      className={className}
      sizes={props.sizes}
      quality={props.quality}
      priority={props.priority}
      alt={props.alt}
    />
  ) : null
}

export default SanityImage
