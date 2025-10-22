import type { FC } from 'react'
import classNames from 'classnames'
import type { NewsletterBlock as NewsletterBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block } from '@components/sanity'
import { NewsletterForm } from '@components/newsletter-form'
import Link from 'next/link'
import IconInstagram from '@components/icons/IconInstagram'
import IconTiktok from '@components/icons/IconTiktok'
import { IconFacebook, IconYoutube } from '@components/icons'

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
      <div className="flex flex-col gap-yhalf w-full md:max-w-[calc(var(--wrap)+var(--space-x))] px-2 md:px-0 mx-auto">
        {header && (
          <h3 className="text-md font-sans uppercase text-center">{header}</h3>
        )}

        <NewsletterForm
          newsletterId={audienceId as string}
          successMessage={successMessage}
          className="text-center"
        />

        <div className="flex items-center gap-x mx-auto mt-ydouble md:mt-ytrio">
          <Link
            href="https://www.instagram.com/itsajointventure/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red"
          >
            <IconInstagram className="w-auto h-7 md:h-8 mx-auto" />
          </Link>

          <Link
            href="https://www.youtube.com/@ItsAJointVenture"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red"
          >
            <IconYoutube className="w-auto h-5 md:h-6 mx-auto" />
          </Link>

          <Link
            href="https://www.tiktok.com/@itsajointventure"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red"
          >
            <IconTiktok className="w-auto h-7 md:h-8 mx-auto" />
          </Link>

          <Link
            href="https://www.facebook.com/ItsAJointventure"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red"
          >
            <IconFacebook className="w-auto h-5 md:h-6 mx-auto" />
          </Link>
        </div>
      </div>
    </Block>
  )
}

export default NewsletterBlock
