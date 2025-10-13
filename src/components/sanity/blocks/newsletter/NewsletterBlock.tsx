import type { FC } from 'react'
import classNames from 'classnames'
import type { NewsletterBlock as NewsletterBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block } from '@components/sanity'
import { NewsletterForm } from '@components/newsletter-form'

type NewsletterBlockProps = Omit<
  SanityBlockElement,
  keyof NewsletterBlockType
> &
  NewsletterBlockType

export const NewsletterBlock: FC<NewsletterBlockProps> = ({
  header,
  audienceId,
  successMessage,
  className,
}) => {
  return (
    <Block className={classNames(className, 'relative py-page')}>
      <div className="flex flex-col gap-yhalf w-full md:max-w-[550px] px-x md:px-xhalf mx-auto">
        {header && (
          <h3 className="text-md font-sans uppercase text-center">{header}</h3>
        )}

        <NewsletterForm
          newsletterId={audienceId as string}
          successMessage={successMessage}
        />
      </div>
    </Block>
  )
}

export default NewsletterBlock
