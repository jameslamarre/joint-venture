import { GrDocument } from 'react-icons/gr'
import type { Rule } from '@sanity/types'

export default {
  name: 'microsite',
  title: 'Microsite',
  type: 'document',
  icon: GrDocument,
  groups: [
    {
      name: 'global',
      title: 'Global Settings',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'menus',
      title: 'Menus',
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
    {
      name: 'subdomain',
      title: 'Subdomain Name',
      type: 'string',
      group: 'global',
      validation: (Rule: Rule): Rule => Rule.required(),
      description:
        'The subdomain name for the microsite (e.g., ifyouseesomething for ifyouseesomething.ajointventure.com).',
    },
    {
      name: 'slug',
      title: 'Microsite Slug',
      type: 'slug',
      group: 'global',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: Rule): Rule => Rule.required(),
      description: 'Used for the URL path (e.g., "ifyouseesomething")',
    },
    {
      name: 'newsletterId',
      title: 'Newsletter Id',
      type: 'string',
      group: 'global',
    },
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
    {
      name: 'homePage',
      title: 'Home Page',
      type: 'reference',
      to: [{ type: 'micrositePage' }],
      group: 'content',
      description:
        'The page that will be displayed as the home page of this microsite',
    },
    {
      name: 'pages',
      title: 'Pages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'micrositePage' }] }],
      group: 'content',
    },
    {
      name: 'mainMenu',
      title: 'Main Menu',
      type: 'reference',
      description: 'Select menu for main navigation',
      to: { type: 'menus' },
      group: 'menus',
    },
    {
      name: 'footerMenu',
      title: 'Footer Menu',
      type: 'reference',
      description: 'Select menu for footer navigation',
      to: { type: 'menus' },
      group: 'menus',
    },
  ],
}
