import type { HTMLAttributes } from 'react'
import type { TypedObject } from '@portabletext/types'
import type { ImageProps } from 'next/image'
import {
  SanityImageAsset,
  SanityImageCrop,
  SanityImageHotspot,
} from 'sanity-codegen'
import { Media, Video } from '@studio/gen/sanity-schema'
import { FileAsset, ImageAsset } from 'sanity'
import { SanityEmbedProps } from '../embed'

export interface SanityVideoType {
  files: {
    _key: string
    asset: FileAsset
  }[]
  poster?: {
    asset: SanityImageAsset
  }
  autoplay?: boolean
  loop?: boolean
}

export interface SanityImageProps extends Omit<ImageProps, 'src'> {
  sizes?: string
  lqip?: string
  options?: { aspectRadio: boolean }
}

export interface SanityVideoProps extends HTMLAttributes<HTMLVideoElement> {
  video: SanityVideoType
  videoEnded?: () => void
  videoError?: () => void
}

export interface SanityMediaProps extends HTMLAttributes<HTMLImageElement> {
  alt?: string
  image?: Media['image']
  imageProps?: SanityImageProps
  onLoadingComplete?: () => void
  video?: SanityVideoType
  mediaRatio?: number | null
  caption?: TypedObject | TypedObject[]
  embed?: SanityEmbedProps
}
