import { getClient } from '../lib/client'
import type { PageDocument } from '../types'

const PREVIEW_SECRET = process.env.SANITY_STUDIO_PREVIEW_SECRET
const APP_URL = process.env.SANITY_STUDIO_NEXT_URL

type pageTypes = 'page' | 'project' | 'micrositePage' | 'microsite' | 'psa'

const getBaseDocumentSlug = (docType: pageTypes): string => {
  switch (docType) {
    case 'project':
      return '/film'
    case 'psa':
      return '/psa'
    case 'microsite':
      return '/microsite'
    case 'micrositePage':
      return '/microsite'
    default:
      return ''
  }
}

export const resolveProductionUrl = async (
  doc: PageDocument
): Promise<string> => {
  const previewUrl = new URL(APP_URL)
  const typeSlug = getBaseDocumentSlug(doc['_type'] as pageTypes)
  const docSlug = doc?.slug?.current

  let slug = `${typeSlug}/${docSlug ?? ''}`

  // If it's a micrositePage, fetch the parent microsite slug
  if (doc._type === 'micrositePage' && (doc.microsite as any)?._ref) {
    const client = getClient()
    const microsite = await client.fetch(`*[_id == $ref][0]{ slug }`, {
      ref: (doc.microsite as any)._ref,
    })

    if (microsite?.slug?.current) {
      slug = `${typeSlug}/${microsite.slug.current}/${docSlug ?? ''}`
    }
  } else if (typeSlug === '/microsite') {
    slug = `${typeSlug}/ifyouseesomething/${docSlug ?? ''}`
  }

  previewUrl.pathname = '/api/preview'
  previewUrl.searchParams.append('secret', PREVIEW_SECRET)
  previewUrl.searchParams.append('slug', slug)
  return previewUrl.toString()
}

export default resolveProductionUrl
