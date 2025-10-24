import { useState, type FC } from 'react'
import classNames from 'classnames'
import type { MicrositeBlock as MicrositeBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement, SanityMediaProps } from '@components/sanity'
import { Block, SanityImage, SanityLink } from '@components/sanity'
import { Cta } from '@components/btns'
import { SanityLinkType } from '@studio/lib'
import { AnimatePresence, motion } from 'framer-motion'
import { SanityEmbed } from '@components/sanity/embed'

interface MicrositeBlockProps
  extends Omit<SanityBlockElement, keyof MicrositeBlockType>,
    MicrositeBlockType {}

export const MicrositeBlock: FC<MicrositeBlockProps> = ({
  backgroundImage,
  title,
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
        'flex items-center justify-center relative h-[85vh] lg:h-[98vh] top-0 overflow-hidden'
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
            />
          </motion.div>
        ) : (
          <motion.div
            key="microsite-block-content-key"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center relative w-full h-full"
          >
            {backgroundImage && (
              <div className="absolute inset-0 z-0">
                <div className="absolute w-full h-full bg-black opacity-25 z-base"></div>
                <SanityImage
                  asset={backgroundImage.asset}
                  props={{
                    alt: 'Background image',
                    sizes: '100vw',
                    priority: true,
                  }}
                  className="relative w-full h-full object-cover z-behind"
                />
              </div>
            )}

            {laurels && (
              <div className="absolute bottom-y left-y z-base">
                <SanityImage
                  asset={laurels.asset}
                  props={{
                    alt: 'Film laurels',
                    sizes: '180px',
                  }}
                  className="w-auto max-w-[140px] md:max-w-[180px] h-auto object-contain"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col max-w-[95%] mx-auto text-center text-white z-above">
              {title && <h1 className="text-h1 capitalize">{title}</h1>}
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
