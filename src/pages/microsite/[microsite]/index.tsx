import groq from 'groq'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import type { Microsite as SanityMicrosite } from '@gen/sanity-schema'
import type { PageProps } from '@lib/next'
import { getPageStaticProps } from '@lib/next'
import {
  BODY_QUERY,
  client,
  filterDataToSingleItem,
  LINK_QUERY,
} from '@studio/lib'
import { BlockContent } from '@components/sanity'

const ALL_MICROSITES_QUERY = groq`
  *[_type == "microsite" && defined(slug.current)]{
    "slug": slug.current,
    "subdomain": subdomain
  }
`

const HOME_QUERY = groq`
  *[_type == "microsite"]{
    _id,
    _type,
    title,
    slug,
    newsletterId,
    description, 
    image,
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
    facebookLink,
    "page": homePage->{
      _id,
      _type,
      title,
      seo,
      ${BODY_QUERY}
    }
  }
`

export const getStaticPaths: GetStaticPaths = async () => {
  const micros = await client.fetch(ALL_MICROSITES_QUERY)
  const seen = new Set<string>()
  const paths = micros
    .flatMap((m: any) => [m.slug, m.subdomain].filter(Boolean))
    .filter((key: string) => (seen.has(key) ? false : seen.add(key)))
    .map((key: string) => ({ params: { microsite: key } }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = context =>
  getPageStaticProps({ ...context, query: HOME_QUERY })

const MicrositeHome: NextPage<PageProps> = ({
  data,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const site: SanityMicrosite = filterDataToSingleItem(data)

  return (site as any)?.page?.body &&
    (!((site as any)?.page?._id || '').includes('drafts.') || preview) ? (
    <article>
      <BlockContent
        blocks={(site as any).page.body}
        className="flex flex-col w-full"
      />
    </article>
  ) : null
}

export default MicrositeHome
