import { type FC, type HTMLProps } from 'react'
import type { FooterProps } from './types'
import classNames from 'classnames'
import { IconLogoOutline } from '@components/icons'
import { NewsletterForm } from '@components/newsletter-form'
import { SanityLink } from '@components/sanity'
import { SanityLinkType } from '@studio/lib'

export const Footer: FC<FooterProps & HTMLProps<HTMLDivElement>> = ({
  footerMenu,
  newsletterId,
  className,
}) => {
  return (
    <footer className="flex flex-col gap-header w-full pt-ydouble pb-y px-xhalf mx-auto bg-black text-stone font-sans">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-x">
        <div className="lg:col-span-1 w-full h-fit border-stone">
          <NewsletterForm
            newsletterId={newsletterId as string}
            className="text-center lg:text-left"
          />
        </div>

        <div className="lg:col-span-2">
          {footerMenu?.items?.map(({ _key, text, link }) => {
            return text && link ? (
              <li key={_key}>
                <SanityLink
                  text={text}
                  {...(link as SanityLinkType)}
                  className={classNames(
                    'inline-block text-stone hover:text-white uppercase'
                  )}
                />
              </li>
            ) : null
          })}
        </div>
      </div>

      <IconLogoOutline className="w-full h-auto" />
    </footer>
  )
}

export default Footer
