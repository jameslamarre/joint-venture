import { type FC } from 'react'
import classNames from 'classnames'
import type { MediaBlock as MediaBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement, SanityMediaProps } from '@components/sanity'
import { Block, SanityMedia } from '@components/sanity'

interface MediaBlockProps
  extends Omit<SanityBlockElement, keyof MediaBlockType>,
    MediaBlockType {
  bgColor?: 'black' | 'white'
}

export const MediaBlock: FC<MediaBlockProps> = ({ media, className }) => {
  return (
    <Block
      className={classNames(
        className,
        'relative w-full max-w-app px-xhalf xl:px-0 mt-y mx-auto'
      )}
    >
      <SanityMedia
        {...(media as SanityMediaProps)}
        className="relative max-w-full min-w-full h-auto object-cover"
        imageProps={{
          alt: media?.alt as string,
          lqip: (media as any)?.metadata?.lqip as string,
          sizes: '(max-width: 768px) 100vw, 1280px',
          quality: 85,
        }}
      />
    </Block>
  )
}

export default MediaBlock
