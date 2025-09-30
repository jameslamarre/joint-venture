import { GrVideo } from 'react-icons/gr'
import type { Rule } from '@sanity/types'

export default {
  name: 'youtube',
  title: 'Youtube embed',
  type: 'document',
  icon: GrVideo,
  fields: [
    {
      name: 'youtubeId',
      title: 'Youtube Video ID',
      type: 'string',
    },
  ],
}
