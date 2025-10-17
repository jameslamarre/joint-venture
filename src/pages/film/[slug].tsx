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
import {
  forwardRef,
  ForwardRefRenderFunction,
  useState,
  useEffect,
} from 'react'
import PageTransition from '@components/transition/PageTransition'
import { SanityImage } from '@components/sanity'
import { motion, AnimatePresence } from 'framer-motion'
import { IconLogo } from '@components/icons'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useView, ViewProps } from '@contexts/view/ViewContext'
import { Cta } from '@components/btns'
import { SanityEmbed } from '@components/sanity/embed'

type PageRefType = React.ForwardedRef<HTMLDivElement>

interface ProjectProps extends SanityProject {
  projectList: { slug: { current: string }; title: string }[]
}

const ALL_SLUGS_QUERY = groq`*[_type == "project" && defined(slug.current)][].slug.current`
const PROJECT_QUERY = groq`
  *[_type == "project" && slug.current == $slug]{
    _id,
    _type,
    title,
    seo,
    "projectList": *[_type == "page" && slug.current == "films"][0].body[_type == "projectsBlock"][0].projects[]->{
      _id,
      _type,
      slug,
      title
    },
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
  const router = useRouter()
  const project: ProjectProps = filterDataToSingleItem(data)

  const [videoPlaying, setVideoPlaying] = useState(false)

  const [view, updateView] = useView() as [
    ViewProps,
    React.Dispatch<React.SetStateAction<ViewProps>>
  ]

  const [slideDirection, setSlideDirection] = useState<number | null>(null)

  const moveToProject = (newPosition: number, direction: number) => {
    if (newPosition >= 0 && newPosition < project.projectList.length) {
      setSlideDirection(direction)
      const targetSlug = project.projectList[newPosition].slug.current
      updateView({
        ...view,
        nextPage: 'film',
        previousPage: 'film',
      })
      router.push(`/film/${targetSlug}`)
    }
  }

  const goToPrevious = () => {
    view?.previousFilm !== undefined && moveToProject(view.previousFilm, -1)
  }

  const goToNext = () => {
    view?.nextFilm !== undefined && moveToProject(view.nextFilm, 1)
  }

  let fieldLength = 1
  if (project) {
    if (project.directedBy) fieldLength++
    if (project.writtenBy) fieldLength++
    if (project.producedBy) fieldLength++
    if (project.starring) fieldLength++
    if (project.otherFields) fieldLength += project.otherFields.length
  }

  const contentMotion = {
    outgoing: (dir: number) => ({
      clipPath:
        view?.nextPage !== 'film'
          ? 'inset(0 0 0 100%)'
          : dir < 0
          ? 'inset(0 0 0 100%)'
          : 'inset(0 100% 0 0)',
      opacity: 0.8,
    }),
    visible: {
      clipPath: 'inset(0 0 0 0)',
      opacity: 1,
    },
    incoming: () => ({
      clipPath:
        view?.previousFilm === undefined
          ? 'inset(0 0 0 0)'
          : (view?.film as number) > (view?.previousFilm as number)
          ? 'inset(0 100% 0 0)'
          : 'inset(0 0 0 100%)',
      opacity: 0.8,
    }),
  }

  useEffect(() => {
    if (project.projectList) {
      const position = project.projectList.findIndex(
        p => p.slug.current === router.query.slug
      )

      updateView({
        ...view,
        film: position,
        previousFilm:
          position > project.projectList.length - 1 ? position - 1 : 0,
        nextFilm: position < project.projectList.length - 1 ? position + 1 : 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug, project.projectList])

  return !project?._id.includes('drafts.') || preview ? (
    <PageTransition ref={ref}>
      <article className="max-w-app mx-auto pt-header md:pt-0">
        <div className="flex flex-col gap-yhalf pt-yhalf pb-y px-yhalf">
          <AnimatePresence custom={slideDirection} mode="wait">
            <motion.div
              key={router.query.slug as string}
              custom={slideDirection}
              variants={contentMotion}
              initial="incoming"
              animate="visible"
              exit="outgoing"
              transition={{
                type: 'tween',
                duration: 0.6,
                ease: 'easeInOut',
              }}
            >
              {project.previewImage && (
                <div className="relative">
                  <div className="relative w-full h-fit leading-[0] aspect-video bg-darkgray">
                    <AnimatePresence mode="popLayout">
                      {!videoPlaying ? (
                        <motion.div
                          key="trailer-image-key"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-full h-auto leading-[0] z-above"
                        >
                          <SanityImage
                            asset={project.previewImage.asset}
                            props={{
                              alt: 'Project image',
                              quality: 85,
                              sizes:
                                '(max-width: 640px) 100vw, (max-width: 1024px) 50vw',
                            }}
                            className="relative w-full h-fit aspect-video object-fill"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="trailer-video-key"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="w-full h-full z-above"
                        >
                          <SanityEmbed
                            className="w-full h-full"
                            youtube={project?.trailer?.youtube}
                            vimeo={project.trailer?.vimeo}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {project.trailer && !videoPlaying && (
                      <Cta
                        className="absolute bottom-ydouble left-1/2 transform -translate-x-1/2"
                        onClick={() => setVideoPlaying(true)}
                      >
                        Play trailer
                      </Cta>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex justify-between items-center w-full mt-2 mb-y border-top border-bottom">
                    <button
                      onClick={goToPrevious}
                      disabled={view?.film === 0}
                      className="w-full px-2 disabled:pointer-events-none hover:bg-white border-left border-right text-left"
                    >
                      <span
                        className={classNames(
                          view?.film === 0 ? 'opacity-20' : '',
                          'inline-block py-1 leading-none uppercase font-sans'
                        )}
                      >
                        Previous
                      </span>
                    </button>

                    <button
                      onClick={goToNext}
                      disabled={
                        (view?.film as number) >= project.projectList.length - 1
                      }
                      className="w-full px-2 disabled:opacity-20 hover:bg-white border-right text-right"
                    >
                      <span className="inline-block py-1 leading-none uppercase font-sans">
                        Next
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-0 bg-white border-top border-left md:border-right">
                <div className="hidden md:flex items-center justify-center order-2 w-[140px] md:w-[210px] h-[-webkit-fill-available] px-xdouble xl:px-0 border-bottom">
                  <div className="p-2 bg-black rounded-full z-above">
                    <IconLogo
                      className={classNames(
                        fieldLength > 4 ? 'md:w-[114px]' : '',
                        fieldLength === 4 ? 'md:w-[5.25em]' : '',
                        fieldLength === 3 ? 'md:w-[4.25em]' : '',
                        fieldLength === 2 ? 'md:w-[3em]' : '',
                        fieldLength === 1 ? 'md:w-[2em]' : '',
                        'h-auto [&_path]:fill-white'
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-0 w-full">
                  {project.title && (
                    <div className="px-2 border-right ruled-lines">
                      <h4 className="inline-block w-[200px] text-h4 mr-1">
                        Title:
                      </h4>
                      <p className="inline">{project.title}</p>
                    </div>
                  )}
                  {project.directedBy && (
                    <div className="px-2 border-right ruled-lines">
                      <h4 className="inline-block w-[200px] text-h4 mr-1">
                        Directed by:
                      </h4>
                      <p className="inline">{project.directedBy}</p>
                    </div>
                  )}
                  {project.writtenBy && (
                    <div className="px-2 border-right ruled-lines">
                      <h4 className="inline-block w-[200px] text-h4 mr-1">
                        Written by:
                      </h4>
                      <p className="inline">{project.writtenBy}</p>
                    </div>
                  )}
                  {project.producedBy && (
                    <div className="px-2 border-right ruled-lines">
                      <h4 className="inline-block w-[200px] text-h4 mr-1">
                        Produced by:
                      </h4>
                      <p className="inline">{project.producedBy}</p>
                    </div>
                  )}
                  {project.starring && (
                    <div className="px-2 border-right ruled-lines">
                      <h4 className="inline-block w-[200px] text-h4 mr-1">
                        Starring:
                      </h4>
                      <p className="inline">{project.starring}</p>
                    </div>
                  )}

                  {project.otherFields &&
                    project.otherFields.map(other => (
                      <div
                        key={other._key}
                        className="px-2 border-right ruled-lines"
                      >
                        <h4 className="inline-block w-[200px] text-h4 mr-1">
                          {other.title}:
                        </h4>
                        <p className="inline">{other.value}</p>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </article>
    </PageTransition>
  ) : null
}

export default forwardRef(Project as ForwardRefRenderFunction<unknown, {}>)
