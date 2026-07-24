import groq from 'groq'
import type {
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticProps,
  NextPage,
} from 'next'
import type { Page as SanityPage } from '@gen/sanity-schema'
import type { PageProps } from '@lib/next'
import { getPageStaticProps } from '@lib/next'
import { BODY_QUERY, client, filterDataToSingleItem } from '@studio/lib'
import { BlockContent } from '@components/sanity'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

type PageRefType = React.ForwardedRef<HTMLDivElement>

const ALL_SLUGS_QUERY = groq`*[_type == "job" && defined(slug.current)][].slug.current`
const PAGE_QUERY = groq`
  *[_type == "job" && slug.current == $slug]{
    _id,
    _type,
    title,
    initialColor,
    seo,
    ${BODY_QUERY}
  }
`

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await client.fetch(ALL_SLUGS_QUERY)
  return {
    paths: pages.map((slug: string) => `/jobs/${slug}`),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = context =>
  getPageStaticProps({ ...context, query: PAGE_QUERY })

const Page: NextPage<PageProps> = (
  { data, preview }: InferGetStaticPropsType<typeof getStaticProps>,
  ref: PageRefType
) => {
  const { asPath } = useRouter()
  const page: SanityPage = filterDataToSingleItem(data)

  return page?.body && (!page?._id.includes('drafts.') || preview) ? (
    <article key={`page-${asPath}`} className="py-page px-x">
      <BlockContent
        blocks={page?.body}
        className="flex flex-col relative w-full"
      />

      <div className="relative block w-full max-w-textWrap mx-auto">
        <Link href="/jobs">← Back to all job listings</Link>
      </div>
    </article>
  ) : null
}

export default forwardRef(Page as ForwardRefRenderFunction<unknown, {}>)
