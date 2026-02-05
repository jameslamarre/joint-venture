import type { Rule } from '@sanity/types'
import { AiOutlinePlusSquare } from 'react-icons/ai'

export default {
  name: 'projectsBlock',
  type: 'object',
  title: 'Projects Block',
  icon: AiOutlinePlusSquare,
  fields: [
    {
      name: 'carousel',
      title: 'Display as Carousel',
      type: 'boolean',
      description:
        'If enabled, projects will be displayed in a full-bleed carousel',
      initialValue: false,
    },
    {
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      validation: (Rule: Rule): Rule => Rule.required().min(1),
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Projects block' }),
  },
}
