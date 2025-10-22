import { type FC } from 'react'
import classNames from 'classnames'
import type { ImageGridBlock as ImageGridBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block, SanityImage } from '@components/sanity'
import Link from 'next/link'
import { SanityImageAsset } from '@sanity/asset-utils'

interface ImageGridBlockProps
  extends Omit<SanityBlockElement, keyof ImageGridBlockType>,
    ImageGridBlockType {}

export const ImageGridBlock: FC<ImageGridBlockProps> = ({
  images,
  className,
}) => {
  return (
    <Block
      className={classNames(className, 'relative max-w-textWrap mt-2 mx-auto')}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-xhalf">
        {images &&
          images.map((image, index) => (
            <Link
              href={(image.asset as unknown as SanityImageAsset).url}
              target="_blank"
              key={`still-images-${index}`}
            >
              <SanityImage
                asset={image.asset}
                props={{
                  alt: 'image still',
                  sizes: '(max-width: 768px) 50vw, 33vw',
                }}
                className="w-full h-auto object-cover"
              />
            </Link>
          ))}
      </div>
    </Block>
  )
}

export default ImageGridBlock
