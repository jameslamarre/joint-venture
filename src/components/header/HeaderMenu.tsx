/* eslint-disable @next/next/no-img-element */
import type { FC, HTMLProps } from 'react'
import { Fragment } from 'react'
import classNames from 'classnames'
import type { SanityLinkType } from '@studio/lib'
import { SanityLink } from '@components/sanity'
import { Btn } from '@components/btns'
import type { HeaderMenuProps } from './types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IconHamburger } from '@components/icons'

export const HeaderMenu: FC<HeaderMenuProps & HTMLProps<HTMLDivElement>> = ({
  customOpen = false,
  setCustomOpen,
  onOpen,
  mainMenu,
  className,
}) => {
  return (
    <div className={className}>
      <Btn
        className="absolute right-0 top-1/2 transform -translate-y-1/2 uppercase animate-fadeIn z-header"
        onClick={() => {
          setCustomOpen(!customOpen)
        }}
        custom={true}
      >
        <div className="flex flex-col gap-[6px] w-[37px] h-auto">
          <span
            className={classNames(
              customOpen
                ? 'rotate-45 translate-x-[1px] -translate-y-[2px]'
                : '',
              'w-full h-[5px] bg-stone transform transition-all duration-500 origin-top-left'
            )}
          ></span>
          <span
            className={classNames(
              customOpen ? 'opacity-0' : 'opacity-1',
              'w-full h-[5px] bg-stone transition-opacity duration-300'
            )}
          ></span>
          <span
            className={classNames(
              customOpen ? '-rotate-45 translate-x-[1px]' : '',
              'w-full h-[5px] bg-stone transform transition-all duration-500 origin-bottom-left'
            )}
          ></span>
        </div>
      </Btn>

      <div
        className={classNames(
          customOpen
            ? 'opacity-100 pointer-events-all'
            : 'opacity-0 pointer-events-none',
          'flex flex-col justify-between fixed w-[100vw] h-[100vh] top-0 right-0 px-xhalf md:px-xdouble pb-ydouble overflow-hidden bg-red text-white text-left transition-opacity'
        )}
      >
        <div
          className={classNames(
            customOpen ? 'pointer-events-auto' : '',
            'flex items-center absolute w-full h-header pointer-events-none'
          )}
        >
          <Link
            href="/"
            className="flex items-center relative pointer-events-auto"
          >
            <span className="sr-only">Joint Venture</span>
          </Link>
        </div>

        <nav className={classNames(customOpen ? 'pointer-events-auto' : '')}>
          <ul className="flex flex-col justify-center items-center w-full h-[calc(100svh-var(--space-y))] pt-0 outline-none">
            {mainMenu?.items?.map(({ _key, text, link }) => (
              <Fragment key={_key}>
                <li className="w-full py-yhalf">
                  <SanityLink
                    className={classNames(
                      // asPath !== '' &&
                      //   asPath ===
                      //     `/${
                      //       (link as SanityLinkType)?.internalLink?.slug
                      //         ?.current
                      //     }`
                      //   ? 'text-yellow'
                      //   : '',
                      'relative top-1 text-h2 uppercase leading-[0.9]'
                    )}
                    text={text}
                    onClick={() => {
                      setTimeout(() => setCustomOpen(false), 100)
                    }}
                    {...(link as SanityLinkType)}
                  />
                </li>
              </Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default HeaderMenu
