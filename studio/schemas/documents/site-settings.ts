import { GrSettingsOption } from 'react-icons/gr'
import type { Rule } from '@sanity/types'

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: GrSettingsOption,
  groups: [
    {
      name: 'global',
      title: 'Global Settings',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Site Title',
      type: 'string',
      group: 'global',
      validation: (Rule: Rule): Rule => Rule.required(),
    },
    // {
    //   name: 'footerSocials',
    //   title: 'Footer Socials',
    //   group: 'global',
    //   type: 'array',
    //   of: [
    //     {
    //       name: 'social',
    //       title: 'Social',
    //       type: 'object',
    //       fields: [
    //         {
    //           name: 'title',
    //           title: 'Title',
    //           type: 'string',
    //         },
    //         {
    //           name: 'url',
    //           title: 'URL',
    //           type: 'url',
    //         },
    //         {
    //           name: 'icon',
    //           title: 'Icon',
    //           type: 'image',
    //         },
    //       ],
    //     },
    //   ],
    //   description: 'Social media links to display in the footer',
    // },
    {
      name: 'description',
      title: 'Site Description',
      type: 'text',
      group: 'seo',
      validation: (Rule: Rule): Rule => Rule.required(),
    },
    {
      name: 'image',
      title: 'Site Image',
      type: 'image',
      group: 'seo',
    },
    {
      name: 'siteKeywords',
      type: 'string',
      description: 'Phrase that you want your site to rank for.',
      title: 'Keyphrase',
      group: 'seo',
    },
  ],
  // eslint-disable-next-line camelcase
  // __experimental_actions: ['update', 'publish'],
}
