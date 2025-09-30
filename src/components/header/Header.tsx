/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState, type FC } from 'react'
import classNames from 'classnames'
import type { HeaderProps } from './types'
import { SanityLink } from '@components/sanity'
import { SanityLinkType } from '@studio/lib'
import HeaderMenu from './HeaderMenu'
import type { Menus as SanityMenu } from '@gen/sanity-schema'
import Link from 'next/link'

export const Header: FC<HeaderProps> = ({ mainMenu, className }) => {
  const onOpen = useCallback((open: boolean) => setMenuOpen(open), [])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen && typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }
  }, [menuOpen])

  return (
    <div
      id="header"
      className={classNames(
        className,
        'fixed w-full h-header mx-auto top-0 pointer-events-none text-base z-header'
      )}
    >
      <header
        role="banner"
        className="flex justify-between items-center relative w-full max-w-app h-header top-0 left-1/2 transform -translate-x-1/2"
      >
        <div>
          <Link
            href="/"
            className="flex items-center gap-xquarter relative hover:invert pointer-events-auto"
          >
            <span className="sr-only">Joint Venture</span>
          </Link>
        </div>

        <ul className="hidden lg:flex flex-row gap-x pointer-events-auto">
          {mainMenu?.items?.map(({ _key, text, link }) => (
            <li key={_key} className={classNames('relative text-right')}>
              <SanityLink
                text={text}
                {...(link as SanityLinkType)}
                className={classNames(
                  // asPath !== '' &&
                  //   asPath ===
                  //     `/${
                  //       (link as SanityLinkType)?.internalLink?.slug?.current
                  //     }`
                  //   ? 'text-yellow'
                  //   : '',
                  'inline-block w-full text-right uppercase whitespace-nowrap'
                )}
              />
            </li>
          ))}
        </ul>
      </header>

      <HeaderMenu
        customOpen={menuOpen}
        setCustomOpen={setMenuOpen}
        onOpen={onOpen}
        mainMenu={mainMenu as SanityMenu}
        className="inline-block lg:hidden h-auto pointer-events-auto"
      />
    </div>
  )
}

export default Header
