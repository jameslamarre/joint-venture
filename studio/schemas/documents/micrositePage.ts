import { GrDocument } from 'react-icons/gr'
import type { Rule } from '@sanity/types'

export default {
  name: 'micrositePage',
  title: 'Microsite Page',
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
      name: 'microsite',
      title: 'Microsite',
      type: 'reference',
      to: { type: 'microsite' },
      validation: (Rule: Rule): Rule => Rule.required(),
    },
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
        isUnique: async (slug: { current: string }, context: any) => {
          const { document } = context
          const micrositeId = document?.microsite?._ref
          if (!document.slug?.current) return true
          const docId = document._id?.replace(/^drafts\./, '')
          const draftId = `drafts.${docId}`
          const existing = await context
            .getClient({ apiVersion: '2023-05-03' })
            .fetch(
              `*[_type == "micrositePage" && slug.current == $slug && microsite._ref == $micrositeId && !(_id in [$docId, $draftId])][0]{_id, title}`,
              {
                slug: document.slug.current,
                micrositeId,
                docId,
                draftId,
              }
            )
          return !existing
        },
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
