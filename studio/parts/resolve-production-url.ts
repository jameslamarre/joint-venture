import type { PageDocument } from '../types'

const PREVIEW_SECRET = process.env.SANITY_STUDIO_PREVIEW_SECRET
const APP_URL = process.env.SANITY_STUDIO_NEXT_URL

type pageTypes = 'page' | 'project' | 'micrositePage' | 'microsite'

const getBaseDocumentSlug = (docType: pageTypes): string => {
  switch (docType) {
    case 'project':
      return '/film'
    case 'microsite':
      return '/microsite'
    case 'micrositePage':
      return '/microsite'
    default:
      return ''
  }
}

export const resolveProductionUrl = (doc: PageDocument): string => {
  const previewUrl = new URL(APP_URL)
  const typeSlug = getBaseDocumentSlug(doc['_type'] as pageTypes)
  const docSlug = doc?.slug?.current
  const slug =
    typeSlug === '/microsite'
      ? `${typeSlug}/ifyouseesomething/${docSlug ?? ''}`
      : `${typeSlug}/${docSlug ?? ''}`
  previewUrl.pathname = '/api/preview'
  previewUrl.searchParams.append('secret', PREVIEW_SECRET)
  previewUrl.searchParams.append('slug', slug)
  return previewUrl.toString()
}

export default resolveProductionUrl
