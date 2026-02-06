import { type FC } from 'react'
import classNames from 'classnames'
import type {
  Project,
  ProjectsBlock as ProjectsBlockType,
} from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block, SanityImage } from '@components/sanity'
import Link from 'next/link'
import { useView } from '@contexts/view'
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
  const [view, updateView] = useView() as any

  return (
    <Block className={classNames(className)}>
      {carousel ? (
        <ProjectsCarousel projects={projects as unknown as Project[]} />
      ) : (
        <div className="flex flex-col gap-y w-full lg:w-[750px] mx-auto px-2 md:px-xhalf pb-page">
          {projects && (
            <div className="grid md:grid-cols-2 gap-y">
              {(projects as unknown as Project[]).map(
                (project: Project, index) => (
                  <Link
                    key={index}
                    onClick={() => {
                      updateView({
                        ...view,
                        nextPage: 'film',
                        page: 'films',
                      })
                    }}
                    href={`/film/${project.slug?.current}`}
                    className="flex flex-col gap-3 group"
                  >
                    {(project.posterImage || project.previewImage) && (
                      <SanityImage
                        asset={
                          (project.posterImage?.asset ||
                            project.previewImage?.asset) as any
                        }
                        props={{
                          alt: 'Project image',
                          quality: 85,
                          sizes:
                            '(max-width: 640px) 100vw, (max-width: 1024px) 50vw',
                        }}
                        className="relative w-full h-full aspect-[6/9] object-cover"
                      />
                    )}

                    <div className="border-black text-textColorTables">
                      <h3 className="w-full pt-2 pb-[5px] px-4 bg-white group-hover:bg-black group-hover:text-white border-bottom font-sans text-sm">
                        {project.title}
                      </h3>
                      <div className="w-full pt-2 pb-[5px] px-4 group-hover:bg-white font-sans text-xs">
                        <span>+</span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      )}
    </Block>
  )
}

export default ProjectsBlock
