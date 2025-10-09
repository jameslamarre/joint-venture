import { MdPermMedia } from 'react-icons/md'
import type { Rule } from '@sanity/types'

export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: MdPermMedia,
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
      title: 'Image',
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
          { title: 'Stone', value: 'stone' },
          { title: 'Green', value: 'green' },
        ],
        layout: 'radio',
      },
      initialValue: 'green',
    },
    {
      name: 'trailer',
      title: 'Trailer',
      type: 'embed',
      options: {
        collapsed: true,
      },
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'directedBy',
      title: 'Directed By',
      type: 'string',
    },
    {
      name: 'writtenBy',
      title: 'Written By',
      type: 'string',
    },
    {
      name: 'producedBy',
      title: 'Produced By',
      type: 'string',
    },
    {
      name: 'starring',
      title: 'Starring',
      type: 'string',
    },
    {
      name: 'otherFields',
      title: 'Other Fields',
      type: 'array',
      description:
        'Add any other fields you want to display with project details.',
      of: [
        {
          name: 'other',
          type: 'object',
          descroption: 'Custom field, ex. Release Date, Duration, etc.',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'synopsis',
      title: 'Synopsis',
      type: 'plainText',
    },
    {
      name: 'cta',
      title: 'CTA',
      type: 'cta',
      options: {
        collapsed: true,
      },
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'metadata',
    },
  ],
}
