/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '../../wdyr'
import { Layout } from '@components/layout'
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

if (process.env.NODE_ENV === 'development') {
  require('../../wdyr')
}

function App({ Component, pageProps }: AppProps<{}>) {
  const { events } = useRouter()

  useEffect(() => {
    const handleHashChange = (url: string) => {
      const el = document.getElementById(url.slice(url.lastIndexOf('#') + 1))
      const elRectTop = el?.getBoundingClientRect().top
      const scrollTop = window.pageYOffset || document.body.scrollTop
      const headerEl = document.getElementById('header')
      const headerStyle = getComputedStyle(headerEl as HTMLElement)
      const offset = parseInt(headerStyle.height) + parseInt(headerStyle.top)
      elRectTop && scroll.scrollTo(Math.floor(elRectTop + scrollTop - offset))
    }

    events.on('hashChangeStart', handleHashChange)

    return () => {
      events.off('hashChangeStart', handleHashChange)
    }
  }, [events])

  // eslint-disable-next-line no-console
  console.log('🔵 Site developed by https://masthead.dev 🟡')

  return (
    <ContextProvider>
      <Layout {...pageProps}>
        <Scripts />
        <AnimatePresence initial={false} mode="wait">
          <Component {...pageProps} key={`page-${(pageProps as any).slug}`} />
        </AnimatePresence>
        <Analytics />
      </Layout>
    </ContextProvider>
  )
}

export default App
