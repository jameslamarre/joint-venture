import type { FC } from 'react'
import { PortableText } from '@portabletext/react'
import type { SanityBlockElement } from '@components/sanity'
import { blockTypes, blockMarks, blockBlock } from '@components/sanity'
import {
  TextBlock,
  MediaBlock,
  AccordionBlock,
  ProjectsBlock,
  EmbedBlock,
  TextAndImageBlock,
  ScrollingTextBlock,
  NewsletterBlock,
  MicrositeBlock,
  DoubleColumnBlock,
  ImageGridBlock,
  PsaBlock,
} from '.'
import classNames from 'classnames'
import { TypedObject } from '@portabletext/types'

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
              <div className="px-x my-y md:my-ydouble">
                <div
                  className={classNames(value.border ? 'border-bottom' : '')}
                ></div>
              </div>
            ),
            doubleColumnBlock: ({ index, value }) => (
              <DoubleColumnBlock
                index={index}
                {...value}
                className={
                  index === (blocks as TypedObject[]).length - 1
                    ? 'mb-page'
                    : ''
                }
              />
            ),
            embedBlock: ({ index, value }) => (
              <EmbedBlock
                index={index}
                {...value}
                className={
                  index === (blocks as TypedObject[]).length - 1
                    ? 'mb-page'
                    : ''
                }
              />
            ),
            imageGridBlock: ({ index, value }) => (
              <ImageGridBlock index={index} {...value} />
            ),
            mediaBlock: ({ index, value }) => (
              <MediaBlock
                index={index}
                {...value}
                className={classNames(
                  index === (blocks as TypedObject[]).length - 1
                    ? ''
                    : 'mb-ydouble'
                )}
              />
            ),
            micrositeBlock: ({ index, value }) => (
              <MicrositeBlock index={index} {...value} />
            ),
            newsletterBlock: ({ index, value }) => (
              <NewsletterBlock index={index} {...value} />
            ),
            projectsBlock: ({ index, value }) => (
              <ProjectsBlock index={index} {...value} />
            ),
            psaBlock: ({ index, value }) => (
              <PsaBlock index={index} {...value} />
            ),
            scrollingTextBlock: ({ index, value }) => (
              <ScrollingTextBlock index={index} {...value} />
            ),
            textBlock: ({ index, value }) => (
              <TextBlock
                index={index}
                {...value}
                className={classNames(
                  index === 0 ? 'mt-y lg:mt-page' : '',
                  index === (blocks as TypedObject[]).length - 1
                    ? 'mb-page'
                    : ''
                )}
              />
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
