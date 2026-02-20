import groq from 'groq'
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next'
import type { Page as SanityPage } from '@gen/sanity-schema'
import type { PageProps } from '@lib/next'
import { getPageStaticProps } from '@lib/next'
import { BODY_QUERY, filterDataToSingleItem } from '@studio/lib'

const HOME_QUERY = groq`
  *[_type == "psa" && slug.current == "temp"]{
    _id,
    _type,
    title,
    seo,
    ${BODY_QUERY}
  }
`

export const getStaticProps: GetStaticProps = context =>
  getPageStaticProps({ ...context, query: HOME_QUERY })

const Page: NextPage<PageProps> = ({
  data,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const page: SanityPage = filterDataToSingleItem(data)

  return page?.body && (!page?._id.includes('drafts.') || preview) ? (
    <article className="flex flex-col items-center justify-center w-full h-[90dvh]">
      <span>Coming Soon</span>
    </article>
  ) : null
}

export default Page
