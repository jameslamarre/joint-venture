import { useEffect, useState, type FC, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import type { Menus, Page, SiteSettings } from '@gen/sanity-schema'
import { Head } from '@components/head'
import { Header } from '@components/header'
import { Footer } from '@components/footer'
import { filterDataToSingleItem } from '@studio/lib'
import { triggerToastPreview } from '@components/toast'
import LogoContainer from '@components/logo/LogoContainer'
import classNames from 'classnames'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
type PageData = Page

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

  const seoImage =
    (page as any)?.previewImage || (page as any)?.image || undefined

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
        className={classNames(
          'flex flex-col min-h-full transition-colors duration-300',
          page?.initialColor === 'green' ? 'bg-yellow' : 'bg-stone'
        )}
      >
        {showIntro ? (
          <LogoContainer setShowIntro={() => setShowIntro(false)} />
        ) : (
          <Header
            className="flex-initial"
            currentPage={page?.title}
            pageBackground={page?.initialColor}
            setShowContent={() => setShowContent(true)}
            mainMenu={siteSettings?.mainMenu as Menus | undefined}
          />
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
