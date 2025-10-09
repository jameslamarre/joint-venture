import groq from 'groq'
import type {
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticProps,
  NextPage,
} from 'next'
import type { Project as SanityProject } from '@gen/sanity-schema'
import type { PageProps } from '@lib/next'
import { getPageStaticProps } from '@lib/next'
import {
  BODY_QUERY,
  client,
  CTA_QUERY,
  filterDataToSingleItem,
} from '@studio/lib'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import PageTransition from '@components/transition/PageTransition'

type PageRefType = React.ForwardedRef<HTMLDivElement>

const ALL_SLUGS_QUERY = groq`*[_type == "project" && defined(slug.current)][].slug.current`
const PROJECT_QUERY = groq`
  *[_type == "project" && slug.current == $slug]{
    _id,
    _type,
    title,
    seo,
    initialColor,
    previewImage,
    trailer, 
    featured, 
    directedBy,
    writtenBy,
    producedBy,
    starring,
    otherFields,
    synopsis,
    cta{
      ${CTA_QUERY}
    },
    ${BODY_QUERY}
  }
`

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await client.fetch(ALL_SLUGS_QUERY)
  return {
    paths: pages.map((slug: string) => `/film/${slug}`),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = context =>
  getPageStaticProps({ ...context, query: PROJECT_QUERY })

const Project: NextPage<PageProps> = (
  { data, preview }: InferGetStaticPropsType<typeof getStaticProps>,
  ref: PageRefType
) => {
  const project: SanityProject = filterDataToSingleItem(data)

  return !project?._id.includes('drafts.') || preview ? (
    <PageTransition ref={ref}>
      <article>
        <div className="px-x">
          <h1>{project.title}</h1>
        </div>
      </article>
    </PageTransition>
  ) : null
}

export default forwardRef(Project as ForwardRefRenderFunction<unknown, {}>)
