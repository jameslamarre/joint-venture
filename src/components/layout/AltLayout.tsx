import { useEffect, useState, type FC } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import { Head } from '@components/head'
import { MicrositeHeader } from '@components/header'
import { filterDataToSingleItem } from '@studio/lib'
import { triggerToastPreview } from '@components/toast'
import { LayoutProps, PageData } from './types'
import THEME_CSS_VARS from './consts'
import { Footer } from '@components/footer'
import type { Menus as SanityMenu } from '@gen/sanity-schema'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const AltLayout: FC<LayoutProps> = ({
  children,
  data,
  preview = false,
  siteSettings,
}) => {
  const { asPath } = useRouter()
  const page: PageData = filterDataToSingleItem(data)

  const [currentTheme, setCurrentTheme] = useState<
    'stone' | 'yellow' | 'blue' | 'dark'
  >(page?.initialColor || 'stone')

  const seoImage =
    (page as any)?.previewImage || (page as any)?.image || undefined

  // Set CSS custom properties for theme colors
  useEffect(() => {
    const root = document.documentElement

    // Only update theme from page if user hasn't overridden it
    if (page?.initialColor) {
      // eslint-disable-next-line react-you-might-not-need-an-effect/no-derived-state
      setCurrentTheme(page.initialColor)
    }

    setTimeout(() => {
      const vars = THEME_CSS_VARS[currentTheme]
      Object.entries(vars).forEach(([prop, value]) => {
        root.style.setProperty(prop, value)
      })
    }, 300)
  }, [currentTheme, page?.initialColor])

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
        className="flex flex-col min-h-full transition-colors duration-100"
        style={{ backgroundColor: 'var(--theme-bg)' }}
      >
        <MicrositeHeader
          mainMenu={(page as any)?.mainMenu as SanityMenu}
          className="flex-initial"
        />

        <main key={`main-${asPath}`} className="flex-auto overflow-hidden">
          {children}
        </main>

        {/* <Footer
          content={siteSettings?.footerSocials as any}
          newsletterId={siteSettings?.newsletterId}
        /> */}
      </div>
      <ToastContainer />
    </>
  )
}
