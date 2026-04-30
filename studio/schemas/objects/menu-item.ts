import { GrNavigate } from 'react-icons/gr'
import type { Rule } from 'sanity'

export default {
  name: 'menuItem',
  title: 'Menu Item',
  type: 'object',
  icon: GrNavigate,
  fields: [
    {
      name: 'text',
      title: 'Menu Item Text',
      type: 'string',
      validation: (Rule: Rule): Rule => Rule.required(),
      description:
        'The text that will be displayed for this menu item, suggest keeping under 20 characters.',
    },
    {
      name: 'link',
      title: 'Menu Item URL',
      type: 'link',
      validation: (Rule: Rule): Rule => Rule.required(),
    },
  ],
}
