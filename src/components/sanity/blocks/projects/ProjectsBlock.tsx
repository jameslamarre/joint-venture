import { type FC } from 'react'
import classNames from 'classnames'
import type {
  Project,
  ProjectsBlock as ProjectsBlockType,
} from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block, SanityImage } from '@components/sanity'
import Link from 'next/link'

type ProjectsBlockProps = Omit<SanityBlockElement, keyof ProjectsBlockType> &
  ProjectsBlockType

export const ProjectsBlock: FC<ProjectsBlockProps> = ({
  projects,
  className,
}) => {
  const featuredProjects =
    (projects as unknown as Project[])?.filter(project => project?.featured) ||
    []

  const otherProjects =
    (projects as unknown as Project[])?.filter(project => !project?.featured) ||
    []

  return (
    <Block
      className={classNames(className, 'w-full lg:w-[750px] mx-auto px-xhalf')}
    >
      {featuredProjects && (
        <div className="flex flex-col gap-y w-full">
          {featuredProjects.map((project: Project, index) => (
            <Link
              key={index}
              href={`/film/${project.slug?.current}`}
              className="flex flex-col gap-3 group"
            >
              {project.previewImage && (
                <SanityImage
                  asset={project.previewImage.asset}
                  props={{
                    alt: 'Project image',
                    quality: 85,
                    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw',
                  }}
                  className="relative w-full h-fit object-contain"
                />
              )}

              <div className="border-black">
                <h3 className="w-full pt-2 pb-[5px] px-4 bg-white group-hover:bg-black group-hover:text-white border-bottom font-sans text-sm">
                  {project.title}
                </h3>
                <div className="w-full pt-2 pb-[5px] px-4 group-hover:bg-white font-sans text-xs">
                  <span>+</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {otherProjects && (
        <div className="grid md:grid-cols-2 gap-y">
          {otherProjects.map((project: Project, index) => (
            <Link
              key={index}
              href={`/film/${project.slug?.current}`}
              className="flex flex-col gap-3 group"
            >
              {project.previewImage && (
                <SanityImage
                  asset={project.previewImage.asset}
                  props={{
                    alt: 'Project image',
                    quality: 85,
                    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw',
                  }}
                  className="relative w-full h-auto object-contain"
                />
              )}

              <div className="border-black">
                <h3 className="w-full pt-2 pb-[5px] px-4 bg-white group-hover:bg-black group-hover:text-white border-bottom font-sans text-sm">
                  {project.title}
                </h3>
                <div className="w-full pt-2 pb-[5px] px-4 group-hover:bg-white font-sans text-xs">
                  <span>+</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Block>
  )
}

export default ProjectsBlock
