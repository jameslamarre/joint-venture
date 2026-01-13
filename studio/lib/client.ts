import { createClient } from 'next-sanity'
import config from './config'
import type { SanityClient } from 'sanity'

export const client = createClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'glavz1o5',
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
})

export const rwClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true,
  perspective: 'previewDrafts',
})

export const getClient = (previewToken?: string): SanityClient => {
  const client = createClient(config)
  // Cast to ensure compatibility between different Sanity client versions
  return (previewToken
    ? client.withConfig({
        token: process.env.SANITY_PREVIEW_TOKEN,
        useCdn: false,
        ignoreBrowserTokenWarning: true,
        perspective: 'previewDrafts',
      })
    : client) as unknown as SanityClient
}

export default client
