import { type FC, useState } from 'react'
import classNames from 'classnames'
import type {
  Project,
  ProjectsBlock as ProjectsBlockType,
} from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block, SanityImage } from '@components/sanity'
import Link from 'next/link'
import { useView } from '@contexts/view'
import { RoughNotation } from 'react-rough-notation'
import ProjectsCarousel from './ProjectsCarousel'

export type ProjectsBlockProps = Omit<
  SanityBlockElement,
  keyof ProjectsBlockType
> &
  ProjectsBlockType

export const ProjectsBlock: FC<ProjectsBlockProps> = ({
  projects,
  carousel,
  className,
}) => {
  const [hoveredProjectKey, setHoveredProjectKey] = useState<string | null>(
    null
  )

  const featuredProjects =
    (projects as unknown as Project[])?.filter(project => project?.featured) ||
    []

  const otherProjects =
    (projects as unknown as Project[])?.filter(project => !project?.featured) ||
    []

  const [view, updateView] = useView() as any

  return (
    <Block className={classNames(className)}>
      {carousel ? (
        <ProjectsCarousel projects={projects as unknown as Project[]} />
      ) : (
        <div className="flex flex-col gap-y w-full xl:w-[1100px] mx-auto md:px-x xl:px-xhalf pb-page">
          {featuredProjects && (
            <div className="flex flex-col gap-y w-full">
              {featuredProjects.map((project: Project, index) => {
                const projectKey = project.slug?.current || `featured-${index}`

                return (
                  <Link
                    key={index}
                    href={`/film/${project.slug?.current}`}
                    onMouseEnter={() => setHoveredProjectKey(projectKey)}
                    onMouseLeave={() => setHoveredProjectKey(null)}
                    onFocus={() => setHoveredProjectKey(projectKey)}
                    onBlur={() => setHoveredProjectKey(null)}
                    onClick={() => {
                      updateView({
                        ...view,
                        nextPage: 'film',
                        page: 'films',
                      })
                    }}
                    className="flex flex-col gap-3 group"
                  >
                    <RoughNotation
                      type="box"
                      show={hoveredProjectKey === projectKey}
                      color="#A90736"
                      animationDuration={500}
                      padding={10}
                      iterations={2}
                      strokeWidth={2.5}
                    >
                      <div className="flex flex-col gap-3">
                        {project.previewImage && (
                          <SanityImage
                            asset={project.previewImage.asset}
                            props={{
                              alt: 'Project image',
                              quality: 85,
                              sizes:
                                '(max-width: 640px) 100vw, (max-width: 1024px) 50vw',
                            }}
                            className="relative w-full h-fit object-contain rounded-[60px]"
                          />
                        )}

                        <div className="text-textColorTables">
                          <h3 className="w-full px-4 text-center font-sans text-sm">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </RoughNotation>
                  </Link>
                )
              })}
            </div>
          )}

          {otherProjects && (
            <div className="grid md:grid-cols-2 gap-x-x gap-y-y md:gap-y-ydouble">
              {otherProjects.map((project: Project, index) => {
                const projectKey = project.slug?.current || `other-${index}`

                return (
                  <Link
                    key={index}
                    href={`/film/${project.slug?.current}`}
                    onMouseEnter={() => setHoveredProjectKey(projectKey)}
                    onMouseLeave={() => setHoveredProjectKey(null)}
                    onFocus={() => setHoveredProjectKey(projectKey)}
                    onBlur={() => setHoveredProjectKey(null)}
                    className="flex flex-col gap-3 group"
                  >
                    <RoughNotation
                      type="box"
                      show={hoveredProjectKey === projectKey}
                      color="#A90736"
                      animationDuration={500}
                      padding={10}
                      iterations={2}
                      strokeWidth={2.5}
                    >
                      <div className="flex flex-col gap-3">
                        {project.previewImage && (
                          <SanityImage
                            asset={project.previewImage.asset}
                            props={{
                              alt: 'Project image',
                              quality: 85,
                              sizes:
                                '(max-width: 640px) 100vw, (max-width: 1024px) 50vw',
                            }}
                            className="relative w-full h-auto aspect-video object-cover rounded-[60px]"
                          />
                        )}

                        <div className="text-textColorTables">
                          <h3 className="w-full px-4 text-center font-sans text-sm">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </RoughNotation>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </Block>
  )
}

export default ProjectsBlock
