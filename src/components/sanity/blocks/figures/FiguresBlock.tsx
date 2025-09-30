import { type FC } from 'react'
import classNames from 'classnames'
import type { FiguresBlock as FiguresBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement, SanityMediaProps } from '@components/sanity'
import { Block, RichText, SanityMedia } from '@components/sanity'
import { TypedObject } from '@portabletext/types'

interface FiguresBlockProps
  extends Omit<SanityBlockElement, keyof FiguresBlockType>,
    FiguresBlockType {}

export const FiguresBlock: FC<FiguresBlockProps> = ({
  header,
  figures,
  columns,
  className,
  index,
}) => {
  return (
    <Block
      className={classNames(
        className,
        index === 0 ? '' : 'pt-y',
        'relative w-full mx-auto mt-block max-w-wrap px-x lg:px-0'
      )}
    >
      {header && (
        <RichText
          blocks={header}
          className="text-center lg:text-left mx-auto mb-y"
        />
      )}

      <div
        style={{
          gridTemplateColumns:
            columns === 1
              ? 'repeat(1, minmax(0, 1fr))'
              : columns === 2
              ? 'repeat(2, minmax(0, 1fr))'
              : 'repeat(3, minmax(0, 1fr))',
        }}
        className="grid gap-xhalf gap-y-y relative w-full overflow-hidden"
      >
        {figures?.map(({ media }, index) => {
          return media ? (
            <div key={`figure-${index}`} className="w-full">
              <div className="flex flex-col gap-yhalf">
                <SanityMedia
                  {...(media as SanityMediaProps)}
                  imageProps={{
                    alt: media?.alt || 'figure image',
                    sizes: '(max-width: 768px) 100vw, 1280px',
                  }}
                  className="aspect-square object-cover w-full h-auto"
                />
                {media?.caption && (
                  <RichText
                    blocks={media?.caption as TypedObject | TypedObject[]}
                  />
                )}
              </div>
            </div>
          ) : null
        })}
      </div>
    </Block>
  )
}

export default FiguresBlock
