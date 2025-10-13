import {
  useEffect,
  useState,
  useCallback,
  type FC,
  type ReactNode,
} from 'react'
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
import classNames from 'classnames'
import { useRef } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
type PageData = Page | Project

interface LayoutProps {
  children?: ReactNode | undefined
  preview?: boolean
  data?: PageData[]
  siteSettings?: SiteSettings | undefined
}

const PAGE_ORDER = ['', 'films', 'contact']

export const Layout: FC<LayoutProps> = ({
  children,
  data,
  preview = false,
  siteSettings,
}) => {
  const { asPath, push } = useRouter()
  const page: PageData = filterDataToSingleItem(data)

  const [showIntro, setShowIntro] = useState(asPath === '/')
  const [showContent, setShowContent] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)
  const [currentTheme, setCurrentTheme] = useState<
    'stone' | 'yellow' | 'blue' | 'dark'
  >(page?.initialColor || 'stone')
  const [userOverrideTheme, setUserOverrideTheme] = useState<boolean>(false)
  const [keyHoldProgress, setKeyHoldProgress] = useState(0)

  const keyHoldTimer = useRef<NodeJS.Timeout | null>(null)
  const keyProgressInterval = useRef<NodeJS.Timeout | null>(null)

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

  const getCurrentPageIndex = useCallback(() => {
    const currentSlug = asPath.substring(1)
    return PAGE_ORDER.indexOf(currentSlug)
  }, [asPath])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only handle on pages, not projects or intro
      if (showIntro || page?._type !== 'page') return

      if (
        (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
        !keyHoldTimer.current
      ) {
        e.preventDefault()
        const currentIndex = getCurrentPageIndex()

        // Check if navigation is possible
        const canNavigateDown =
          e.key === 'ArrowDown' && currentIndex < PAGE_ORDER.length - 1
        const canNavigateUp = e.key === 'ArrowUp' && currentIndex > 0

        if (canNavigateDown || canNavigateUp) {
          setDirection(e.key === 'ArrowDown' ? 'down' : 'up')
          setShowIndicator(true)
          setKeyHoldProgress(0)

          // Start progress animation
          keyProgressInterval.current = setInterval(() => {
            setKeyHoldProgress(prev => {
              const newProgress = prev + 100 / 8 // 8 intervals over 1 second
              return Math.min(newProgress, 100)
            })
          }, 100)

          // Set timer for navigation
          keyHoldTimer.current = setTimeout(() => {
            if (canNavigateDown) {
              push(`/${PAGE_ORDER[currentIndex + 1]}`)
            } else if (canNavigateUp) {
              push(`/${PAGE_ORDER[currentIndex - 1]}`)
            }
            setShowIndicator(false)
            setKeyHoldProgress(0)
            if (keyProgressInterval.current) {
              clearInterval(keyProgressInterval.current)
              keyProgressInterval.current = null
            }
            keyHoldTimer.current = null
          }, 800)
        }
      }
    },
    [getCurrentPageIndex, push, showIntro, page?._type]
  )

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // Cancel navigation if key is released early
      if (keyHoldTimer.current) {
        clearTimeout(keyHoldTimer.current)
        keyHoldTimer.current = null
      }
      if (keyProgressInterval.current) {
        clearInterval(keyProgressInterval.current)
        keyProgressInterval.current = null
      }
      setShowIndicator(false)
      setKeyHoldProgress(0)
    }
  }, [])

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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      if (keyHoldTimer.current) {
        clearTimeout(keyHoldTimer.current)
      }
      if (keyProgressInterval.current) {
        clearInterval(keyProgressInterval.current)
      }
    }
  }, [handleKeyDown, handleKeyUp])

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
        {/* Page Navigation Indicator with Progress */}
        {showIndicator && page?._type === 'page' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed h-dvh inset-0 z-above pointer-events-none flex items-center justify-center"
          >
            <div
              className={classNames(
                direction === 'up' ? 'top-page' : 'bottom-y',
                'absolute bg-white rounded-full'
              )}
            >
              <div className="relative w-[42px] h-[42px] flex items-center justify-center">
                <svg
                  className="absolute inset-0 w-[42px] h-[42px] -rotate-90"
                  viewBox="2 2 60 60"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="var(--theme-bg)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="var(--theme-text)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="175.929"
                    initial={{ strokeDashoffset: 175.929 }}
                    animate={{
                      strokeDashoffset:
                        175.929 - (175.929 * keyHoldProgress) / 100,
                    }}
                    transition={{
                      duration: 0.1,
                      ease: 'linear',
                    }}
                  />
                </svg>
                <div
                  className="flex items-center justify-center w-8 h-8 text-md z-10"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {direction === 'up' ? '↑' : '↓'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

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

            {page?._type === 'page' && (
              <motion.button
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
                onClick={cycleTheme}
                className="group absolute right-[calc(50%-40px)] md:right-[calc(50%-57px)] lg:right-x bottom-x p-2 hover:bg-black rounded-full z-above"
              >
                <IconLogo className="w-[80px] md:w-[114px] h-auto animate-fadeIn theme-menu-fill group-hover:[&_path]:fill-white" />
              </motion.button>
            )}
          </>
        )}

        {showContent && <main className="flex-auto">{children}</main>}

        {/* <Footer
          content={siteSettings?.footerSocials as any}
          newsletterId={siteSettings?.newsletterId}
        /> */}
      </div>
      <ToastContainer />
    </>
  )
}
