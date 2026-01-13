import { createClient } from 'next-sanity'
import { config } from './config'

export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_PREVIEW_TOKEN,
  withCredentials: true,
})

/**
 * Helper function to return the correct version of the document.
 * In preview mode this returns the preview document
 */
export const filterDataToSingleItem = (data: any, slug?: string): any => {
  if (!Array.isArray(data)) {
    return data
  }
  if (data.length === 1) {
    return data[0]
  }

  // If slug is provided, try to match by slug.current or subdomain
  if (slug) {
    const match = data.find(
      (item: any) => item?.slug?.current === slug || item?.subdomain === slug
    )
    if (match) {
      return match
    }
  }

  return data[0]
}

export default previewClient
