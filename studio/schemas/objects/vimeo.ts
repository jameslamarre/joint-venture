import { GrVideo } from 'react-icons/gr'

export default {
  name: 'vimeo',
  title: 'Vimeo embed',
  type: 'document',
  icon: GrVideo,
  fields: [
    {
      name: 'vimeoId',
      title: 'Vimeo Video ID',
      type: 'string',
    },
  ],
}
