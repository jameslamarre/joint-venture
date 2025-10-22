import { IoIosImage } from 'react-icons/io'
import { PreviewValue } from 'sanity'

interface MediaSelectProps {
  videoPosterUrl?: string
}

export default {
  name: 'embed',
  title: 'Embed',
  type: 'object',
  icon: IoIosImage,
  fields: [
    {
      name: 'vimeo',
      type: 'vimeo',
    },
    {
      name: 'youtube',
      type: 'youtube',
    },
    {
      name: 'poster',
      type: 'image',
      description:
        'Image that displays before the video is fully loaded (where applicable)',
    },
  ],
  preview: {
    select: {
      videoPosterUrl: 'poster.media.image.asset.url',
    },
    prepare({ videoPosterUrl }: MediaSelectProps): PreviewValue {
      const title = 'Video Embed'
      return {
        title,
        media: videoPosterUrl,
      }
    },
  },
}
