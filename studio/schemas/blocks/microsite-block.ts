import { Rule } from '@sanity/types'
import { off } from 'process'
import { BiImage } from 'react-icons/bi'

export default {
  name: 'micrositeBlock',
  type: 'object',
  title: 'Hero Block',
  icon: BiImage,
  fields: [
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
    },
    {
      name: 'alignment',
      type: 'string',
      title: 'Title Alignment',
      options: {
        list: [
          { title: 'Center', value: 'center' },
          { title: 'Top', value: 'top' },
          { title: 'Bottom', value: 'bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'titleImage',
      type: 'image',
      title: 'Title Image',
      description: 'Optional image to use instead of the title text.',
    },
    {
      name: 'mobileImage',
      type: 'image',
      title: 'Mobile Title Image',
      description:
        'Optional image to use instead of the title text on mobile, with a more square aspect ratio.',
    },
    {
      name: 'description',
      type: 'string',
      title: 'Description',
    },
    {
      name: 'subhead',
      type: 'string',
      title: 'Subhead',
    },
    {
      name: 'laurels',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'laurel',
          fields: [
            { name: 'image', type: 'image' },
            {
              name: 'size',
              type: 'string',
              title: 'Size',
              options: { list: ['small', 'medium', 'large'], layout: 'radio' },
              initialValue: 'medium',
            },
          ],
        },
      ],
      title: 'Laurels',
      description:
        'Optional laurels (or other) image to display on the bottom right.',
    },
    {
      name: 'ticketsCta',
      type: 'cta',
      title: 'Tickets CTA',
    },
    {
      name: 'trailerCta',
      type: 'embed',
      title: 'Trailer CTA',
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Hero block' }),
  },
}
