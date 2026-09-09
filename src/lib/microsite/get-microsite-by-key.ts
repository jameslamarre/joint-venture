import groq from 'groq'

import { LINK_QUERY, client } from '@studio/lib'

const MICROSITE_BY_KEY_QUERY = groq`
  *[_type == "microsite" && (slug.current == $key || subdomain == $key)][0]{
    _id,
    _type,
    title,
    slug,
    subdomain,
    newsletterId,
    movieGluId,
    description,
    image,
    siteKeywords,
    theme,
    mainMenu->{
      items[]{
        _key,
        text,
        link{
          ${LINK_QUERY}
        }
      }
    },
    footerMenu->{
      items[]{
        _key,
        text,
        link{
          ${LINK_QUERY}
        }
      }
    },
    instagramLink,
    youtubeLink,
    tiktokLink,
    facebookLink
  }
`

export type MicrositeShellData = {
  _id: string
  _type: 'microsite'
  title?: string
  slug?: {
    current?: string
  }
  subdomain?: string
  newsletterId?: string
  movieGluId?: string | number | null
  description?: string
  image?: unknown
  siteKeywords?: string
  theme?: 'stone' | 'yellow' | 'blue' | 'dark'
  mainMenu?: unknown
  footerMenu?: unknown
  instagramLink?: string
  youtubeLink?: string
  tiktokLink?: string
  facebookLink?: string
}

export const getMicrositeByKey = async (
  key: string
): Promise<MicrositeShellData | null> => {
  if (!key?.trim()) {
    return null
  }

  const microsite = await client.fetch(MICROSITE_BY_KEY_QUERY, {
    key: key.trim(),
  })

  return microsite ?? null
}
