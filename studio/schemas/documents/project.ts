import { MdPermMedia } from 'react-icons/md'
import type { Rule } from 'sanity'
import { group } from 'console'

export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: MdPermMedia,
  groups: [
    {
      name: 'carousel',
      title: 'Carousel',
    },
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
      name: 'posterImage',
      title: 'Poster Image',
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
      initialValue: 'yellow',
    },
    {
      name: 'carouselImage',
      title: 'Carousel Image',
      type: 'image',
      options: {
        hotspot: false,
      },
      group: 'carousel',
      description:
        'Optional image used in carousels, if different from Preview Image',
    },
    {
      name: 'video',
      title: 'Carousel Video',
      type: 'video',
      group: 'carousel',
      description: 'Optional video used in carousels',
    },
    {
      name: 'titleImg',
      title: 'Carousel Title Image',
      type: 'image',
      group: 'carousel',
      description: 'Optional image used for title in carousels instead of text',
    },
    {
      name: 'titleImgMobile',
      title: 'Carousel Title Mobile Image',
      type: 'image',
      group: 'carousel',
      description:
        'Optional image used for title in carousels instead of text on mobile devices',
    },
    {
      name: 'subhead',
      title: 'Carousel Subhead',
      type: 'string',
      group: 'carousel',
      description: 'Optional subhead displayed in carousels',
      validation: (Rule: Rule): Rule => Rule.max(50),
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
      name: 'executiveProducedBy',
      title: 'Executive Produced By',
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
