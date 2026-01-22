import classNames from 'classnames'
import type { FC } from 'react'
import type { SanityEmbedProps } from './types'

export const SanityEmbed: FC<SanityEmbedProps> = ({
  vimeo,
  youtube,
  autoplay,
  className,
}) => {
  return (
    <>
      {vimeo?.vimeoId?.length ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeo.vimeoId}`}
          allow="autoplay; fullscreen; picture-in-picture"
          frameBorder={0}
          allowFullScreen
          className={classNames(className)}
        ></iframe>
      ) : (
        youtube?.youtubeId?.length && (
          <iframe
            src={`https://www.youtube.com/embed/${youtube.youtubeId}?autoplay=${
              autoplay ? '1' : '0'
            }&showinfo=0`}
            allow="autoplay; fullscreen; picture-in-picture"
            frameBorder={0}
            allowFullScreen
            className={classNames(className)}
          ></iframe>
        )
      )}
    </>
  )
}

export default SanityEmbed
