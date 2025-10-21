import type { FC } from 'react'
import { PortableText } from '@portabletext/react'
import type { SanityBlockElement } from '@components/sanity'
import { blockTypes, blockMarks, blockBlock } from '@components/sanity'
import {
  TextBlock,
  FiguresBlock,
  MediaBlock,
  AccordionBlock,
  ProjectsBlock,
  EmbedBlock,
  TextAndImageBlock,
  ScrollingTextBlock,
  NewsletterBlock,
} from '.'
import classNames from 'classnames'

export const BlockContent: FC<SanityBlockElement> = ({
  blocks,
  className,
  style,
}) => {
  return blocks ? (
    <div className={className} style={style}>
      <PortableText
        value={blocks}
        components={{
          types: {
            ...blockTypes,
            accordionBlock: ({ index, value }) => (
              <AccordionBlock index={index} {...value} />
            ),
            dividerBlock: ({ index, value }) => (
              <div className="px-x my-ydouble">
                <div
                  className={classNames(
                    value.border ? 'border-bottom--white' : ''
                  )}
                ></div>
              </div>
            ),
            embedBlock: ({ index, value }) => (
              <EmbedBlock index={index} {...value} />
            ),
            figuresBlock: ({ index, value }) => (
              <FiguresBlock index={index} {...value} />
            ),
            mediaBlock: ({ index, value }) => (
              <MediaBlock index={index} {...value} />
            ),
            newsletterBlock: ({ index, value }) => (
              <NewsletterBlock index={index} {...value} />
            ),
            projectsBlock: ({ index, value }) => (
              <ProjectsBlock index={index} {...value} />
            ),
            scrollingTextBlock: ({ index, value }) => (
              <ScrollingTextBlock index={index} {...value} />
            ),
            textBlock: ({ index, value }) => (
              <TextBlock index={index} {...value} />
            ),
            textAndImageBlock: ({ index, value }) => (
              <TextAndImageBlock index={index} {...value} />
            ),
          },
          marks: blockMarks,
          block: blockBlock,
        }}
      />
    </div>
  ) : null
}

export default BlockContent
