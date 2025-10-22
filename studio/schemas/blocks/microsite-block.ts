import { Rule } from '@sanity/types'
import { BiImage } from 'react-icons/bi'

export default {
  name: 'micrositeBlock',
  type: 'object',
  title: 'Microsite Block',
  icon: BiImage,
  fields: [
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'subhead',
      type: 'string',
      title: 'Subhead',
    },
    {
      name: 'laurels',
      type: 'image',
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
    prepare: (): { title: string } => ({ title: 'Microsite block' }),
  },
}
