import { type FC, type HTMLProps } from 'react'
import type { FooterProps } from './types'
import classNames from 'classnames'
import { IconLogoStack } from '@components/icons'
import { NewsletterForm } from '@components/newsletter-form'
import { SanityLink } from '@components/sanity'
import { SanityLinkType } from '@studio/lib'
import Link from 'next/link'
import { Socials } from '@components/socials'

export const Footer: FC<FooterProps & HTMLProps<HTMLDivElement>> = ({
  footerMenu,
  newsletterId,
  socials,
  className,
}) => {
  return (
    <footer
      style={{ color: 'var(--theme-bg)', backgroundColor: 'var(--theme-text)' }}
      className={classNames(
        className,
        footerMenu?.items && footerMenu?.items.length > 0
          ? 'flex-col'
          : 'flex-col lg:flex-row lg:justify-between lg:items-end',
        'flex gap-y md:gap-ydouble w-full pt-y md:pt-ydouble pb-y px-xhalf mx-auto font-sans z-above'
      )}
    >
      <div
        className={classNames(
          footerMenu?.items && footerMenu?.items.length > 0
            ? 'lg:order-1'
            : 'lg:order-2',
          'flex flex-col lg:grid lg:grid-cols-3 gap-x-x w-full h-fit'
        )}
      >
        <div
          className={classNames(
            footerMenu?.items && footerMenu?.items.length > 0
              ? 'lg:col-span-1'
              : 'lg:col-span-2 lg:col-start-2',
            'w-full h-fit border-stone'
          )}
        >
          <NewsletterForm
            newsletterId={newsletterId as string}
            className="border-none text-center lg:text-left"
          />
        </div>

        <ul
          className={classNames(
            footerMenu?.items && footerMenu?.items.length > 4
              ? 'lg:columns-3'
              : 'lg:columns-auto lg:flex lg:flex-row lg:justify-end lg:items-end lg:gap-x-[calc(var(--space-x)*1.5)]',
            'lg:col-span-2 flex flex-col lg:inline-block gap-x-x gap-y-yhalf lg:columns-2 mt-y lg:mt-0 text-center lg:text-left'
          )}
        >
          {footerMenu?.items?.map(({ _key, text, link }) => {
            return text && link ? (
              <li
                key={_key}
                className={classNames(
                  footerMenu?.items && footerMenu?.items.length > 4
                    ? ''
                    : 'lg:text-right lg:items-end lg:justify-end',
                  ''
                )}
              >
                <SanityLink
                  text={text}
                  {...(link as SanityLinkType)}
                  style={{ color: 'var(--theme-bg)' }}
                  className={classNames(
                    'inline-block lg:mb-y text-sm lg:text-xs xl:text-sm hover:text-[var(--theme-highlight)] uppercase'
                  )}
                />
              </li>
            ) : null
          })}
        </ul>
      </div>

      <div
        className={classNames(
          footerMenu?.items && footerMenu?.items.length > 0
            ? 'lg:order-2'
            : 'lg:order-1',
          'block md:flex md:justify-between md:items-end relative w-full'
        )}
      >
        <Link
          href="https://www.ajointventure.com"
          target="_blank"
          className="block w-[48%] md:w-fit"
        >
          <IconLogoStack
            className="block w-full md:w-[200px]"
            fill="var(--theme-bg)"
          />
        </Link>

        {socials && (
          <Socials
            socials={socials}
            youtubeFill="var(--theme-text)"
            className="flex flex-row items-center justify-start gap-xhalf w-fit mt-yhalf"
          />
        )}
      </div>
    </footer>
  )
}

export default Footer
