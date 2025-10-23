import groq from 'groq'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import type { MicrositePage as SanityMicrositePage } from '@gen/sanity-schema'
import type { PageProps } from '@lib/next'
import { getPageStaticProps } from '@lib/next'
import {
  BODY_QUERY,
  client,
  filterDataToSingleItem,
  LINK_QUERY,
} from '@studio/lib'
import { BlockContent } from '@components/sanity'

const ALL_SLUGS_QUERY = groq`*[_type == "micrositePage" && defined(slug.current) && defined(microsite->slug.current)]{
  "pageSlug": slug.current,
  "micrositeSlug": microsite->slug.current
}`

const PAGE_QUERY = groq`
  *[_type == "micrositePage" && slug.current == $slug]{
    _id,
    _type,
    title,
    seo,
    "microsite": microsite->{
      title,
      subdomain,
      description,
      image,
      slug,
      newsletterId,
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
    },
    ${BODY_QUERY}
  }
`

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await client.fetch(ALL_SLUGS_QUERY)
  return {
    paths: pages.map(
      (page: { micrositeSlug: string; pageSlug: string }) =>
        `/microsite/${page.micrositeSlug}/${page.pageSlug}`
    ),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = context =>
  getPageStaticProps({ ...context, query: PAGE_QUERY })

const MicrositePage: NextPage<PageProps> = ({
  data,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const page: SanityMicrositePage = filterDataToSingleItem(data)

  return page?.body && (!page?._id.includes('drafts.') || preview) ? (
    <article className="pb-page">
      <BlockContent
        blocks={page.body}
        className="flex flex-col w-full px-x lg:px-xhalf"
      />
    </article>
  ) : null
}

export default MicrositePage
