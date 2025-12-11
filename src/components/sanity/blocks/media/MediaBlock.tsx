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

export const MediaBlock: FC<MediaBlockProps> = ({
  media,
  index,
  className,
}) => {
  return (
    <Block
      className={classNames(
        className,
        'relative w-[100vw] max-w-microsite -ml-x lg:-ml-xhalf xl:ml-auto mx-auto object-cover'
      )}
    >
      <SanityMedia
        {...(media as SanityMediaProps)}
        className={classNames(
          index === 0 ? 'max-h-[50vh]' : 'max-h-[85vh]',
          'relative max-w-full min-w-full h-auto min-h-[350px] object-cover'
        )}
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
