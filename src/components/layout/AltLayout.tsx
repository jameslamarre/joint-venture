import { useEffect, type FC } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import { Head } from '@components/head'
import { MicrositeHeader } from '@components/header'
import { filterDataToSingleItem } from '@studio/lib'
import { triggerToastPreview } from '@components/toast'
import { AltLayoutProps, MicrositeData } from './types'
import THEME_CSS_VARS from './consts'
import { Footer } from '@components/footer'
import type {
  Microsite,
  MicrositePage,
  Menus as SanityMenu,
} from '@gen/sanity-schema'

type THEME_OPTIONS = 'stone' | 'yellow' | 'blue' | 'dark'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const AltLayout: FC<AltLayoutProps> = ({
  children,
  data,
  preview = false,
}) => {
  const { asPath } = useRouter()
  const page: MicrositeData = filterDataToSingleItem(data)

  const currentTheme: THEME_OPTIONS =
    page._type === 'microsite'
      ? page.theme || 'stone'
      : (page.microsite as any)?.theme || 'stone'

  const seoImage =
    (page as any)?.previewImage || (page as any)?.image || undefined

  // Set CSS custom properties for theme colors
  useEffect(() => {
    const root = document.documentElement

    const vars = THEME_CSS_VARS[currentTheme]
    Object.entries(vars).forEach(([prop, value]) => {
      root.style.setProperty(prop, value)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (preview)
      triggerToastPreview({
        deactivateUrl: `${BASE_URL}/api/exit-preview?path=${asPath}`,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath])

  const siteSettings =
    page?._type === 'microsite'
      ? {
          _id: (page as Microsite)?._id,
          _type: (page as Microsite)?._type,
          title: (page as Microsite)?.title,
          description: (page as Microsite)?.description,
          newsletterId: (page as Microsite)?.newsletterId,
          image: (page as Microsite)?.image,
          siteKeywords: (page as Microsite)?.siteKeywords,
          mainMenu: (page as Microsite)?.mainMenu,
          footerMenu: (page as Microsite)?.footerMenu,
          instagramLink: (page as Microsite)?.instagramLink,
          youtubeLink: (page as Microsite)?.instagramLink,
          tiktokLink: (page as Microsite)?.tiktokLink,
          facebookLink: (page as Microsite)?.facebookLink,
        }
      : {
          _id: page?._id as string,
          _type: page?._type as string,
          title: page?.title as string,
          description: (page?.microsite as any)?.description as string,
          newsletterId: (page?.microsite as any)?.newsletterId,
          image: (page?.microsite as any)?.image as any,
          siteKeywords: (page?.microsite as any)?.siteKeywords as any,
          mainMenu: (page?.microsite as any)?.mainMenu as SanityMenu,
          footerMenu: (page?.microsite as any)?.footerMenu as SanityMenu,
          instagramLink: (page?.microsite as any)?.instagramLink,
          youtubeLink: (page?.microsite as any)?.instagramLink,
          tiktokLink: (page?.microsite as any)?.tiktokLink,
          facebookLink: (page?.microsite as any)?.facebookLink,
        }

  return (
    <>
      <Head
        siteTitle={`${page?.title} | 'Joint Venture'`}
        siteDescription={siteSettings?.description}
        siteImage={siteSettings?.image}
        siteKeywords={siteSettings?.siteKeywords}
        seoTitle={(page as MicrositePage)?.seo?.title}
        pageTitle={page?.title}
        pageDescription={(page as MicrositePage)?.seo?.description}
        pageKeywords={(page as MicrositePage)?.seo?.keywords}
        pageImage={seoImage}
        pageUrl={`${BASE_URL}${asPath}`}
      />
      <div
        className="flex flex-col min-h-full transition-colors duration-100"
        style={{ backgroundColor: 'var(--theme-bg)' }}
      >
        <MicrositeHeader
          mainMenu={siteSettings?.mainMenu as SanityMenu}
          socials={{
            instagram: siteSettings?.instagramLink,
            youtube: siteSettings?.youtubeLink,
            tiktok: siteSettings?.tiktokLink,
            facebook: siteSettings?.facebookLink,
          }}
          className="flex-initial"
        />

        <main key={`main-${asPath}`} className="flex-auto">
          {children}
        </main>

        <Footer
          footerMenu={siteSettings?.footerMenu as SanityMenu}
          newsletterId={siteSettings?.newsletterId}
        />
      </div>
      <ToastContainer />
    </>
  )
}
