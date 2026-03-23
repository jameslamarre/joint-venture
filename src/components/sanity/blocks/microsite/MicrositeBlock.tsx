import { useState, type FC } from 'react'
import classNames from 'classnames'
import type { MicrositeBlock as MicrositeBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement, SanityMediaProps } from '@components/sanity'
import { Block, SanityImage, SanityLink } from '@components/sanity'
import { Cta } from '@components/btns'
import { SanityLinkType } from '@studio/lib'
import { AnimatePresence, motion } from 'framer-motion'
import { SanityEmbed } from '@components/sanity/embed'
import { SanityImageAsset } from '@sanity/asset-utils'

interface MicrositeBlockProps
  extends Omit<SanityBlockElement, keyof MicrositeBlockType>,
    MicrositeBlockType {}

export const MicrositeBlock: FC<MicrositeBlockProps> = ({
  backgroundImage,
  alignment,
  title,
  titleImage,
  mobileImage,
  description,
  subhead,
  laurels,
  ticketsCta,
  trailerCta,
  className,
}) => {
  const [videoPlaying, setVideoPlaying] = useState(false)

  return (
    <Block
      className={classNames(
        className,
        alignment === 'top'
          ? 'items-start'
          : alignment === 'bottom'
          ? 'items-end'
          : 'items-center',
        'flex relative h-[85vh] lg:h-[98vh] top-0 overflow-hidden'
      )}
    >
      <AnimatePresence mode="popLayout">
        {videoPlaying ? (
          <motion.div
            key="trailer-video-key"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full h-full z-above"
          >
            <SanityEmbed
              className="w-full h-full"
              youtube={trailerCta?.youtube}
              vimeo={trailerCta?.vimeo}
              autoplay={true}
            />
          </motion.div>
        ) : (
          <motion.div
            key="microsite-block-content-key"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={classNames(
              alignment === 'top'
                ? 'md:items-start pt-header'
                : alignment === 'bottom'
                ? 'md:items-end pb-ydouble'
                : 'md:items-center',
              'flex items-center relative w-full h-full'
            )}
          >
            {backgroundImage && (
              <div className="fixed inset-0 z-0">
                <div className="absolute w-full h-full bg-black opacity-25 z-base"></div>
                <SanityImage
                  asset={backgroundImage.asset}
                  props={{
                    alt: 'Background image',
                    sizes: '100vw',
                    priority: true,
                    quality: 90,
                  }}
                  className="relative w-full h-full object-cover z-behind"
                />
              </div>
            )}

            {laurels && laurels.length > 0 && (
              <div className="flex flex-col gap-yhalf xl:gap-y justify-center items-center absolute bottom-2 md:bottom-y left-yhalf md:left-y z-base">
                {laurels.map(laurel => (
                  <SanityImage
                    key={laurel._key}
                    asset={laurel.image?.asset as unknown as SanityImageAsset}
                    props={{
                      alt: 'Film laurels',
                      sizes: '220px',
                    }}
                    className={classNames(
                      laurel.size === 'large'
                        ? 'max-w-[110px] md:max-w-[132px] xl:max-w-[160px]'
                        : laurel.size === 'medium'
                        ? 'max-w-[88px] md:max-w-[100px] xl:max-w-[120px]'
                        : 'max-w-[48px] md:max-w-[56px] xl:max-w-[64px]',
                      'w-auto h-auto object-contain'
                    )}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col max-w-[95%] mx-auto text-center text-white z-above">
              {titleImage || mobileImage ? (
                <>
                  {titleImage && (
                    <SanityImage
                      asset={titleImage.asset}
                      props={{
                        alt: 'Film title image',
                        sizes: '(max-width: 640px) 95vw, 90vw',
                      }}
                      className={classNames(
                        mobileImage ? 'hidden sm:block' : '',
                        'w-auto max-w-[1080px] h-fit mb-y object-contain'
                      )}
                    />
                  )}

                  {mobileImage && (
                    <SanityImage
                      asset={mobileImage.asset}
                      props={{
                        alt: 'Film title image',
                        sizes: '(max-width: 640px) 95vw, 90vw',
                      }}
                      className={classNames(
                        'block sm:hidden w-auto h-fit px-x mb-y object-contain'
                      )}
                    />
                  )}
                </>
              ) : (
                title && <h1 className="text-h1 capitalize">{title}</h1>
              )}

              {description && (
                <div className="rich-text max-w-textWrap mx-auto">
                  <p
                    className={classNames(
                      subhead
                        ? 'mb-y md:mb-[calc(var(--space-y)*1.5)]'
                        : 'md:mb-y'
                    )}
                  >
                    {description}
                  </p>
                </div>
              )}

              {subhead && <h2 className="text-xl font-sans">{subhead}</h2>}

              <div className="flex flex-col md:flex-row justify-center gap-x mt-y">
                {ticketsCta && (
                  <SanityLink
                    {...(ticketsCta.link as SanityLinkType)}
                    className="text-black"
                  >
                    <Cta type="button">{ticketsCta.text}</Cta>
                  </SanityLink>
                )}
                {trailerCta && !videoPlaying && (
                  <Cta
                    type="button"
                    onClick={() => setVideoPlaying(true)}
                    className="w-fit mx-auto md:mx-0 text-black"
                  >
                    Play Trailer
                  </Cta>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Block>
  )
}

export default MicrositeBlock
