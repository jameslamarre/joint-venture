import { GrLink } from 'react-icons/gr'
import type { Rule } from 'sanity'
import type { Link } from '@gen/sanity-schema'

export default {
  name: 'link',
  type: 'object',
  title: 'Link',
  icon: GrLink,
  fields: [
    {
      name: 'internalLink',
      type: 'object',
      title: 'Internal link',
      fields: [
        {
          name: 'reference',
          type: 'reference',
          to: [
            { type: 'page' },
            { type: 'project' },
            { type: 'micrositePage' },
          ],
          weak: true,
        },
      ],
    },
    {
      name: 'externalLink',
      type: 'url',
      title: 'External Link',
      validation: (Rule: Rule): Rule =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    },
  ],
  validation: (Rule: Rule): Rule =>
    Rule.custom<Link>(({ internalLink, externalLink }) => {
      if (!internalLink && !externalLink) {
        return 'An internal or external link is required'
      }
      if (internalLink && externalLink) {
        return 'Internal and external links are mutually exclusive'
      }
      return true
    }),
}
