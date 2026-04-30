import { GrDocument } from 'react-icons/gr'
import type { Rule } from 'sanity'

export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: GrDocument,
  groups: [
    {
      name: 'metadata',
      title: 'Metadata',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule): Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      group: 'metadata',
      options: {
        hotspot: false,
      },
    },
    {
      name: 'initialColor',
      type: 'string',
      title: 'Initial Color',
      description: 'Sets the initial color of the page before any transitions.',
      options: {
        list: [
          { title: 'Khaki', value: 'stone' },
          { title: 'Chartreuse', value: 'yellow' },
        ],
        layout: 'radio',
      },
      initialValue: 'stone',
    },
    {
      name: 'body',
      title: 'Content Blocks',
      type: 'blockContent',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'metadata',
    },
  ],
}
