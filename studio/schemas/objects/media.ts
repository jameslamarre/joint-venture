import { IoIosImage } from 'react-icons/io'
import type { PreviewValue } from '@sanity/types'

interface MediaSelectProps {
  image?: string
}

const MediaObject = {
  name: 'media',
  title: 'Media',
  type: 'object',
  icon: IoIosImage,
  fields: [
    {
      name: 'image',
      type: 'image',
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
      description: 'Describe the image for better accessibility',
    },
    {
      name: 'embed',
      title: 'Embed',
      type: 'embed',
    },
  ],
  preview: {
    select: {
      imageUrl: 'image',
    },
    prepare({ image }: MediaSelectProps): PreviewValue {
      let title = 'Media'
      if (image) title = 'Image'
      return {
        title,
        media: image,
      }
    },
  },
}

export default MediaObject
