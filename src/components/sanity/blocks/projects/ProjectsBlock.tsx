import { type FC } from 'react'
import classNames from 'classnames'
import type { ProjectsBlock as ProjectsBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block } from '@components/sanity'

type ProjectsBlockProps = Omit<SanityBlockElement, keyof ProjectsBlockType> &
  ProjectsBlockType

export const ProjectsBlock: FC<ProjectsBlockProps> = ({
  projects,
  className,
}) => {
  return <Block className={classNames(className, '')}></Block>
}

export default ProjectsBlock
