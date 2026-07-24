/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '../../wdyr'
import { Layout, AltLayout } from '@components/layout'
import { Scripts } from '@components/scripts'
import { Analytics } from '@vercel/analytics/react'
import { animateScroll as scroll } from 'react-scroll'
import ContextProvider from '@/contexts'

import 'focus-visible'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/virtual'
import '../styles/main.css'
import '../styles/toast.css'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'
import { Head } from '@components/head'

if (process.env.NODE_ENV === 'development') {
  require('../../wdyr')
}

function App({ Component, pageProps }: AppProps<{}>) {
  const { events } = useRouter()
  const type = (pageProps as any).data?.[0]?._type || 'page'

  useEffect(() => {
    const handleRouteChange = () => {
      scroll.scrollToTop({ behavior: 'smooth', duration: 900 })
    }

    events.on('routeChangeStart', handleRouteChange)

    return () => {
      events.off('routeChangeStart', handleRouteChange)
    }
  }, [events])

  // eslint-disable-next-line no-console
  console.log('🔵 Site developed by https://masthead.dev 🟡')

  return (
    <ContextProvider>
      {type === 'psa' ? (
        <>
          <Head
            siteTitle={(pageProps as any).data[0]?.seo?.title}
            siteDescription={(pageProps as any).siteSettings?.description}
            siteImage={(pageProps as any).siteSettings?.image}
            siteKeywords={(pageProps as any).siteSettings?.siteKeywords}
            seoTitle={(pageProps as any).data[0]?.seo?.title}
            pageType={(pageProps as any).data[0]?._type}
            pageTitle={(pageProps as any).data[0]?.title}
            pageDescription={(pageProps as any).data[0]?.seo?.description}
            pageImage={
              (pageProps as any).data[0]?.previewImage ||
              (pageProps as any).data[0]?.image ||
              undefined
            }
            pageUrl={`https://colonoscopyreminder.com`}
          />
          <Scripts />
          <Component {...pageProps} key={`psa-${(pageProps as any).slug}`} />
          <Analytics />
        </>
      ) : type === 'page' || type === 'project' || type === 'job' ? (
        <Layout {...pageProps}>
          <Scripts />
          <AnimatePresence initial={false} mode="wait">
            <Component {...pageProps} key={`page-${(pageProps as any).slug}`} />
          </AnimatePresence>
          <Analytics />
        </Layout>
      ) : (
        <AltLayout {...pageProps}>
          <Scripts />
          <Component {...pageProps} key={`page-${(pageProps as any).slug}`} />
          <Analytics />
        </AltLayout>
      )}
    </ContextProvider>
  )
}

export default App
