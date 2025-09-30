import type { Rule } from '@sanity/types'
import { RiImageEditLine } from 'react-icons/ri'

export default {
  name: 'textAndImageBlock',
  type: 'object',
  title: 'Text and Image Block',
  icon: RiImageEditLine,
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'richText',
      validation: (Rule: Rule): Rule => Rule.required(),
    },
    {
      name: 'media',
      title: 'Media',
      type: 'media',
      validation: (Rule: Rule): Rule => Rule.required(),
    },
    {
      name: 'showImageFirst',
      title: 'Show Image First',
      type: 'boolean',
      initialValue: true,
      desciption: 'Show the image before the text on desktop',
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Text and image' }),
  },
}
