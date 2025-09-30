/* eslint-disable no-console */
import { useRef, type FC, useEffect, useState } from 'react'
import type { SanityVideoProps } from './types'
import { getFileAsset } from '@sanity/asset-utils'
import classNames from 'classnames'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET

export const SanityVideo: FC<SanityVideoProps> = ({
  video,
  videoEnded,
  videoError,
  className,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showControls, setShowControls] = useState(!video.autoplay)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const autoplayAttempted = useRef(false)

  const getFileType = (url: string) => {
    if (url.includes('.webm')) {
      return 'video/webm'
    } else if (url.includes('.m4v')) {
      return 'video/x-m4v'
    } else {
      return 'video/mp4'
    }
  }

  // Detection for iOS - more robust than userAgent
  const isIOSDevice = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod|mac/.test(userAgent) && 'ontouchend' in document
  }

  // Low-level play function with aggressive options for iOS
  const attemptAutoplay = async (videoEl: HTMLVideoElement) => {
    if (autoplayAttempted.current) return
    autoplayAttempted.current = true

    // iOS requires these attributes
    videoEl.playsInline = true
    videoEl.muted = true
    videoEl.setAttribute('playsinline', '')
    videoEl.setAttribute('webkit-playsinline', '')
    videoEl.setAttribute('muted', '')

    try {
      await videoEl.play()
      setIsPlaying(true)
      console.log('Video autoplay successful')
    } catch (err) {
      console.warn(
        'Initial autoplay attempt failed, trying alternate approach',
        err
      )

      videoEl.load()

      try {
        await videoEl.play()
        setIsPlaying(true)
        console.log('Video autoplay succeeded on second attempt')
      } catch (error) {
        console.error('All autoplay attempts failed:', error)
        if (videoError) videoError()
      }
    }
  }

  const handleUserPlay = async (videoEl: HTMLVideoElement) => {
    try {
      videoEl.muted = true
      videoEl.playsInline = true
      await videoEl.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('User-initiated play failed:', error)
      if (videoError) videoError()
    }
  }

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const handleCanPlay = () => {
      setIsLoading(false)
      if (video.autoplay && !isPlaying) {
        attemptAutoplay(videoEl)
      }
    }

    const handleLoadedMetadata = () => {
      // iOS sometimes needs this event instead of canplay
      if (video.autoplay && !isPlaying && isIOSDevice()) {
        attemptAutoplay(videoEl)
      }
    }

    const handleError = (e: Event) => {
      console.error('Video error event:', e)
      setIsLoading(false)
      if (videoError) videoError()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (videoEnded) videoEnded()
    }

    // Add all possible event listeners for broader device support
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoEl.addEventListener('canplay', handleCanPlay)
    videoEl.addEventListener('error', handleError)
    videoEl.addEventListener('ended', handleEnded)

    // Force preload for iOS
    videoEl.preload = 'auto'

    // Cleanup
    return () => {
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoEl.removeEventListener('canplay', handleCanPlay)
      videoEl.removeEventListener('error', handleError)
      videoEl.removeEventListener('ended', handleEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.autoplay, videoEnded, videoError, isPlaying])

  // Effect to handle interaction on page load (iOS requires interaction)
  useEffect(() => {
    let interactionHandler: (() => void) | null = null

    // Only set up for iOS with autoplay
    if (video.autoplay && isIOSDevice()) {
      const videoEl = videoRef.current

      // iOS requires user interaction
      interactionHandler = () => {
        if (videoEl && !isPlaying) {
          attemptAutoplay(videoEl)
        }
        // Remove after first interaction
        ;['touchstart', 'click'].forEach(event => {
          document.removeEventListener(
            event,
            interactionHandler as () => void,
            true
          )
        })
      }

      // Capture phase to get early interaction
      ;['touchstart', 'click'].forEach(event => {
        document.addEventListener(event, interactionHandler as () => void, {
          once: true,
          capture: true,
        })
      })
    }

    return () => {
      if (interactionHandler) {
        ;['touchstart', 'click'].forEach(event => {
          document.removeEventListener(
            event,
            interactionHandler as () => void,
            true
          )
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.autoplay, isPlaying])

  return video?.files?.length ? (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      key={video?.files[0]._key}
      ref={videoRef}
      playsInline
      preload="auto"
      controls
      muted
      {...(video?.loop && { loop: true })}
      {...(video?.poster && { poster: video?.poster.asset.url })}
      {...props}
      className={classNames(
        className,
        isLoading ? 'opacity-0' : 'opacity-100',
        'w-full h-full object-cover transition-opacity duration-500'
      )}
    >
      {video?.files.map(({ _key, asset }) => {
        const videoData = getFileAsset(asset, {
          projectId: PROJECT_ID as string,
          dataset: DATASET as string,
        })
        const mimeType = getFileType(videoData.url)
        return <source key={_key} src={videoData.url} type={mimeType} />
      })}
    </video>
  ) : null
}

export default SanityVideo
