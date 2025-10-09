import { useEffect, useState, type FC, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import type { Menus, Page, Project, SiteSettings } from '@gen/sanity-schema'
import { Head } from '@components/head'
import { Header } from '@components/header'
import { Footer } from '@components/footer'
import { filterDataToSingleItem } from '@studio/lib'
import { triggerToastPreview } from '@components/toast'
import LogoContainer from '@components/logo/LogoContainer'
import { IconLogo } from '@components/icons'
import { motion } from 'framer-motion'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
type PageData = Page | Project

interface LayoutProps {
  children?: ReactNode | undefined
  preview?: boolean
  data?: PageData[]
  siteSettings?: SiteSettings | undefined
}

export const Layout: FC<LayoutProps> = ({
  children,
  data,
  preview = false,
  siteSettings,
}) => {
  const { asPath } = useRouter()
  const page: PageData = filterDataToSingleItem(data)

  const [showIntro, setShowIntro] = useState(asPath === '/')
  const [showContent, setShowContent] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<
    'stone' | 'yellow' | 'blue' | 'dark'
  >(page?.initialColor || 'stone')
  const [userOverrideTheme, setUserOverrideTheme] = useState<boolean>(false)

  const seoImage =
    (page as any)?.previewImage || (page as any)?.image || undefined

  const cycleTheme = () => {
    setUserOverrideTheme(true)
    setCurrentTheme(prev => {
      switch (prev) {
        case 'stone':
          return 'yellow'
        case 'yellow':
          return 'blue'
        case 'blue':
          return 'dark'
        case 'dark':
          return 'stone'
        default:
          return 'stone'
      }
    })
  }

  // Set CSS custom properties for theme colors
  useEffect(() => {
    const root = document.documentElement

    // Only update theme from page if user hasn't overridden it
    if (
      !userOverrideTheme &&
      page?.initialColor &&
      page.initialColor !== currentTheme
    ) {
      setCurrentTheme(page.initialColor)
    }

    switch (currentTheme) {
      case 'stone':
        root.style.setProperty('--theme-bg', '#A59F8D')
        root.style.setProperty('--theme-text', '#000000')
        root.style.setProperty('--theme-text--menu', '#A59F8D')
        root.style.setProperty('--theme-menu', '#000')
        root.style.setProperty('--theme-highlight', '#CFE806')
        break
      case 'yellow':
        root.style.setProperty('--theme-bg', '#CFE806')
        root.style.setProperty('--theme-text', '#31383C')
        root.style.setProperty('--theme-text--menu', '#CFE806')
        root.style.setProperty('--theme-menu', '#31383C')
        root.style.setProperty('--theme-highlight', '#91D2DA')
        break
      case 'blue':
        root.style.setProperty('--theme-bg', '#91D2DA')
        root.style.setProperty('--theme-text', '#000')
        root.style.setProperty('--theme-text--menu', '#91D2DA')
        root.style.setProperty('--theme-menu', '#000')
        root.style.setProperty('--theme-highlight', '#FFF')
        break
      case 'dark':
        root.style.setProperty('--theme-bg', '#31383C')
        root.style.setProperty('--theme-text', '#fff')
        root.style.setProperty('--theme-text--menu', '#31383C')
        root.style.setProperty('--theme-menu', '#fff')
        root.style.setProperty('--theme-highlight', '#A90736')
        break
    }
  }, [currentTheme, page?.initialColor, userOverrideTheme])

  // Reset user override when navigating to new page
  useEffect(() => {
    setUserOverrideTheme(false)
  }, [asPath])

  useEffect(() => {
    if (preview)
      triggerToastPreview({
        deactivateUrl: `${BASE_URL}/api/exit-preview?path=${asPath}`,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath])

  return (
    <>
      <Head
        siteTitle={siteSettings?.title || 'Joint Venture'}
        siteDescription={siteSettings?.description}
        siteImage={siteSettings?.image}
        siteKeywords={siteSettings?.siteKeywords}
        seoTitle={page?.seo?.title}
        pageType={page?._type}
        pageTitle={page?.title}
        pageDescription={page?.seo?.description}
        pageKeywords={page?.seo?.keywords}
        pageImage={seoImage}
        pageUrl={`${BASE_URL}${asPath}`}
      />
      <div
        className="flex flex-col min-h-full transition-colors duration-300"
        style={{ backgroundColor: 'var(--theme-bg)' }}
      >
        {showIntro ? (
          <LogoContainer setShowIntro={() => setShowIntro(false)} />
        ) : (
          <>
            <Header
              className="flex-initial"
              currentPage={page?._type === 'project' ? 'Films' : page?.title}
              pageBackground={currentTheme}
              setShowContent={() => setShowContent(true)}
              mainMenu={siteSettings?.mainMenu as Menus | undefined}
            />

            <motion.button
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
              onClick={cycleTheme}
              className="group absolute right-1/2 lg:right-x bottom-x p-2 hover:bg-black rounded-full transform -translate-y-1/2 lg:translate-y-0 z-above"
            >
              <IconLogo className="w-[114px] h-auto animate-fadeIn theme-menu-fill group-hover:[&_path]:fill-white" />
            </motion.button>
          </>
        )}

        {showContent && <main className="flex-auto pt-page">{children}</main>}

        {/* <Footer
          content={siteSettings?.footerSocials as any}
          newsletterId={siteSettings?.newsletterId}
        /> */}
      </div>
      <ToastContainer />
    </>
  )
}
