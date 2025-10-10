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
import { SanityImage } from '@components/sanity'
import { motion } from 'framer-motion'
import { IconLogo } from '@components/icons'

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
      <article className="max-w-app mx-auto">
        <div className="flex flex-col gap-yhalf pt-yhalf pb-y px-yhalf">
          {project.previewImage && (
            <SanityImage
              asset={project.previewImage.asset}
              props={{
                alt: 'Project image',
                quality: 85,
                sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw',
              }}
              className="relative aspect-video w-full h-fit object-contain"
            />
          )}

          <div className="flex items-center gap-0 bg-white border-top border-left md:border-right">
            <div className="hidden md:flex items-center justify-center order-2 w-[140px] md:w-[210px] h-[-webkit-fill-available] px-xdouble xl:px-0 border-bottom">
              <div className="p-2 bg-black rounded-full z-above">
                <IconLogo className="w-[80px] md:w-[114px] h-auto [&_path]:fill-white" />
              </div>
            </div>
            <div className="flex flex-col gap-0 w-full">
              {project.title && (
                <div className="px-2 border-right ruled-lines">
                  <h4 className="inline text-h4 mr-1">Title:</h4>
                  <p className="inline">{project.title}</p>
                </div>
              )}
              {project.directedBy && (
                <div className="px-2 border-right ruled-lines">
                  <h4 className="inline text-h4 mr-1">Directed by:</h4>
                  <p className="inline">{project.directedBy}</p>
                </div>
              )}
              {project.writtenBy && (
                <div className="px-2 border-right ruled-lines">
                  <h4 className="inline text-h4 mr-1">Written by:</h4>
                  <p className="inline">{project.writtenBy}</p>
                </div>
              )}
              {project.producedBy && (
                <div className="px-2 border-right ruled-lines">
                  <h4 className="inline text-h4 mr-1">Produced by:</h4>
                  <p className="inline">{project.producedBy}</p>
                </div>
              )}
              {project.starring && (
                <div className="px-2 border-right ruled-lines">
                  <h4 className="inline text-h4 mr-1">Starring:</h4>
                  <p className="inline">{project.starring}</p>
                </div>
              )}

              {project.otherFields &&
                project.otherFields.map(other => (
                  <div
                    key={other._key}
                    className="px-2 border-right ruled-lines"
                  >
                    <h4 className="inline text-h4 mr-1">{other.title}:</h4>
                    <p className="inline">{other.value}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </article>
    </PageTransition>
  ) : null
}

export default forwardRef(Project as ForwardRefRenderFunction<unknown, {}>)
