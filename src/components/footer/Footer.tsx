import { type FC, type HTMLProps } from 'react'
import type { FooterProps } from './types'
import classNames from 'classnames'
import { IconLogoLong, IconLogoOutline } from '@components/icons'
import { NewsletterForm } from '@components/newsletter-form'
import { SanityLink } from '@components/sanity'
import { SanityLinkType } from '@studio/lib'
import Link from 'next/link'

export const Footer: FC<FooterProps & HTMLProps<HTMLDivElement>> = ({
  footerMenu,
  newsletterId,
  className,
}) => {
  return (
    <footer
      style={{ color: 'var(--theme-bg)', backgroundColor: 'var(--theme-text)' }}
      className="flex flex-col gap-header w-full pt-ydouble pb-y px-xhalf mx-auto font-sans z-above"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-x">
        <div className="lg:col-span-1 w-full h-fit border-stone">
          <NewsletterForm
            newsletterId={newsletterId as string}
            className="border-none text-center lg:text-left"
          />
        </div>

        <ul className="lg:col-span-2 flex flex-col md:inline-block gap-x-x gap-y-yhalf md:columns-2 lg:columns-3 mt-y md:mt-0 text-center md:text-left">
          {footerMenu?.items?.map(({ _key, text, link }) => {
            return text && link ? (
              <li key={_key}>
                <SanityLink
                  text={text}
                  {...(link as SanityLinkType)}
                  style={{ color: 'var(--theme-bg)' }}
                  className={classNames(
                    'inline-block md:mb-y text-sm hover:text-[var(--theme-highlight)] uppercase'
                  )}
                />
              </li>
            ) : null
          })}
        </ul>
      </div>

      <Link href="https://www.ajointventure.com" target="_blank">
        <IconLogoLong className="w-full h-auto fill-[var(--theme-bg)]" />
      </Link>
    </footer>
  )
}

export default Footer
