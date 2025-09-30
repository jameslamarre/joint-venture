import { type FC } from 'react'
import classNames from 'classnames'
import type { TextAndImageBlock as TextAndImageBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement, SanityVideoType } from '@components/sanity'
import { Block, RichText, SanityMedia } from '@components/sanity'
import { TypedObject } from '@portabletext/types'

type TextAndImageBlockProps = Omit<
  SanityBlockElement,
  keyof TextAndImageBlockType
> &
  TextAndImageBlockType

export const TextAndImageBlock: FC<TextAndImageBlockProps> = ({
  text,
  media,
  showImageFirst,
  index,
  className,
}) => {
  return (
    <Block className={classNames(className, 'px-x')}>
      <div className="grid grid-cols-1 md:grid-cols-2 items-start md:items-center gap-y md:gap-xhalf">
        <div
          className={classNames(
            showImageFirst ? 'order-1' : 'order-1 md:order-2',
            'relative'
          )}
        >
          <SanityMedia
            imageProps={{
              alt: media?.alt as string,
              quality: 75,
              sizes: '(max-width: 1024px) 100vw, 50vw',
            }}
            image={(media as any).image as any}
            video={(media as any).video as SanityVideoType}
            className="max-w-full w-auto h-auto min-h-[300px] object-cover"
          />
        </div>

        <div
          className={classNames(
            showImageFirst ? 'order-2' : 'order-2 md:order-1',
            'w-full'
          )}
        >
          <RichText
            blocks={text as TypedObject[] | TypedObject}
            className="w-full text-left"
          />
        </div>
      </div>
    </Block>
  )
}

export default TextAndImageBlock
