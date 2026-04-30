import type { Rule } from 'sanity'
import { IoIosImages } from 'react-icons/io'

export default {
  name: 'figuresBlock',
  type: 'object',
  title: 'Figures Block',
  icon: IoIosImages,
  fields: [
    {
      title: 'header',
      name: 'header',
      type: 'richText',
    },
    {
      name: 'figures',
      title: 'Figures',
      type: 'array',
      of: [{ type: 'figure', title: 'Figure' }],
      validation: (Rule: Rule): Rule => Rule.required().min(1),
    },
    {
      title: 'Column Count',
      name: 'columns',
      type: 'number',
      initialValue: 1,
      validation: (Rule: Rule): Rule => Rule.required().min(1).max(3),
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Figures block' }),
  },
}
