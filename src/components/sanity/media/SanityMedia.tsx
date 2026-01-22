import type { FC } from 'react'
import type { SanityMediaProps } from './types'
import { SanityImage } from './SanityImage'
import SanityVideo from './SanityVideo'
import { SanityEmbed } from '../embed'

export const SanityMedia: FC<SanityMediaProps> = ({
  image,
  imageProps,
  video,
  embed,
  className,
  onLoadingComplete,
}) => {
  if (image?.asset && imageProps)
    return (
      <SanityImage
        asset={image.asset}
        props={imageProps}
        onLoadingComplete={onLoadingComplete}
        className={className}
      />
    )
  if (video?.files?.length)
    return <SanityVideo id="sanity-video" video={video} className={className} />
  if (embed) {
    return (
      <SanityEmbed {...embed} className="w-full h-auto aspect-[16/8] px-x" />
    )
  }
  return null
}

export default SanityMedia
