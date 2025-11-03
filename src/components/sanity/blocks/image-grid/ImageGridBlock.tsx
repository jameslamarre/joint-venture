import { useRef, type FC } from 'react'
import classNames from 'classnames'
import type { ImageGridBlock as ImageGridBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block, SanityImage } from '@components/sanity'
import Link from 'next/link'
import { SanityImageAsset } from '@sanity/asset-utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import { type SwiperOptions } from 'swiper/types'
import { Navigation } from 'swiper/modules'
import SCREENS from '@globals/screens'

interface ImageGridBlockProps
  extends Omit<SanityBlockElement, keyof ImageGridBlockType>,
    ImageGridBlockType {}

export const ImageGridBlock: FC<ImageGridBlockProps> = ({
  images,
  carousel,
  className,
}) => {
  const slidesRef = useRef(null)

  return (
    <Block
      className={classNames(
        className,
        'relative w-full max-w-textWrap mt-2 mx-auto'
      )}
    >
      {images && carousel ? (
        <Swiper
          ref={slidesRef}
          data-testid="image-carousel"
          modules={[Navigation]}
          loop={false}
          spaceBetween={16}
          resistance={false}
          slidesPerView="auto"
          speed={400}
          navigation={{
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
          }}
          className={classNames('w-full overflow-hidden')}
        >
          {images.map((image, index) => (
            <SwiperSlide key={`still-images-${index}`}>
              <Link
                href={(image.asset as unknown as SanityImageAsset).url}
                target="_blank"
                key={`still-images-${index}`}
                className="w-full"
              >
                <SanityImage
                  asset={image.asset}
                  props={{
                    alt: 'image still',
                    sizes: '(max-width: 768px) 99vw, 50vw',
                  }}
                  className="w-full h-auto object-cover"
                />
              </Link>
            </SwiperSlide>
          ))}

          <div
            className="flex justify-between items-center w-full mt-y mb-y"
            style={{
              borderTop: '1px solid var(--theme-text)',
              borderBottom: '1px solid var(--theme-text)',
              borderRight: '1px solid var(--theme-text)',
            }}
          >
            <button
              className="swiper-prev w-full px-2 disabled:pointer-events-none hover:bg-white hover:text-textColorTables text-left"
              style={{
                borderLeft: '1px solid var(--theme-text)',
                borderRight: '1px solid var(--theme-text)',
              }}
            >
              <span
                className={classNames(
                  'inline-block py-1 leading-none uppercase font-sans'
                )}
              >
                Previous
              </span>
            </button>

            <button className="swiper-next w-full px-2 disabled:opacity-20 hover:bg-white hover:text-textColorTables text-right">
              <span className="inline-block py-1 leading-none uppercase font-sans">
                Next
              </span>
            </button>
          </div>
        </Swiper>
      ) : (
        images && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-xhalf">
            {images.map((image, index) => (
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
        )
      )}
    </Block>
  )
}

export default ImageGridBlock
