import { BiVideo } from 'react-icons/bi'
import { PreviewValue } from 'sanity'

interface MediaSelectProps {
  image?: string
  subhead?: string
}

export default {
  name: 'mediaBlock',
  type: 'object',
  title: 'Media Block',
  icon: BiVideo,
  fields: [
    {
      name: 'media',
      type: 'media',
      title: 'Media',
    },
  ],
  preview: {
    select: {
      image: 'media.image',
    },
    prepare({ image }: MediaSelectProps): PreviewValue {
      let title = 'Media'
      image ? (title += ' image') : (title += ' video')
      return {
        title,
        media: image,
      }
    },
  },
}
