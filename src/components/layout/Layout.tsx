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
// import { Footer } from '@components/footer'
import { filterDataToSingleItem } from '@studio/lib'
import { triggerToastPreview } from '@components/toast'
import LogoContainer from '@components/logo/LogoContainer'
import { IconLogo } from '@components/icons'
import { AnimatePresence, motion } from 'framer-motion'
import classNames from 'classnames'
import { useRef } from 'react'
import { useNavigation } from '@contexts/view/ViewContext'

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
  const [view, updateView, { setNavigating, canNavigate }] =
    useNavigation() as any

  const [showIntro, setShowIntro] = useState(asPath === '/')
  const [showContent, setShowContent] = useState(false)

  const [showIndicator, setShowIndicator] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)
  const [keyHoldProgress, setKeyHoldProgress] = useState(0)

  const keyHoldTimer = useRef<NodeJS.Timeout | null>(null)
  const keyProgressInterval = useRef<NodeJS.Timeout | null>(null)
  const resetTimer = useRef<NodeJS.Timeout | null>(null)

  const [userOverrideTheme, setUserOverrideTheme] = useState<boolean>(false)
  const [currentTheme, setCurrentTheme] = useState<
    'stone' | 'yellow' | 'blue' | 'dark'
  >(page?.initialColor || 'stone')

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

  const scrollAccumulator = useRef<number>(0)
  const lastScrollTime = useRef<number>(0)

  const resetScrollProgress = useCallback(() => {
    scrollAccumulator.current = 0
    setShowIndicator(false)
    setKeyHoldProgress(0)
    if (keyHoldTimer.current) {
      clearTimeout(keyHoldTimer.current)
      keyHoldTimer.current = null
    }
  }, [])

  const [showWipe, setShowWipe] = useState(false)

  const wipeVariants = {
    initial: {
      y: direction === 'up' ? '-100dvh' : '100dvh',
    },
    animate: {
      y: direction === 'up' ? '100dvh' : '-100dvh',
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: 'easeInOut',
      },
    },
  }

  const navigateToPage = useCallback(
    (targetPage: string) => {
      if (!canNavigate()) return

      setShowIndicator(false)
      setShowWipe(true)
      setNavigating(true)

      // Start wipe animation, then navigate
      setTimeout(() => {
        push(`/${targetPage}`)
      }, 300)

      resetScrollProgress()

      // Reset navigation lock and hide wipe after transition
      setTimeout(() => {
        setNavigating(false)
        setShowWipe(false)
      }, 1200)
    },
    [canNavigate, setNavigating, push, resetScrollProgress]
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Only handle on pages, not projects or intro, and not during navigation
      if (showIntro || page?._type !== 'page' || view?.isNavigating) return

      const isAtTop = window.scrollY <= 10
      const isAtBottom =
        window.scrollY >=
        document.documentElement.scrollHeight - window.innerHeight - 10
      const hasScrollableContent =
        document.documentElement.scrollHeight > window.innerHeight

      // If there's scrollable content and we're not at boundaries, allow normal scrolling
      if (hasScrollableContent) {
        if (e.deltaY > 0 && !isAtBottom) return // Scrolling down but not at bottom
        if (e.deltaY < 0 && !isAtTop) return // Scrolling up but not at top
      }

      e.preventDefault()

      const currentTime = Date.now()
      const timeDelta = currentTime - lastScrollTime.current

      // Reset accumulator if too much time has passed (new scroll gesture)
      if (timeDelta > 300) {
        scrollAccumulator.current = 0
      }

      lastScrollTime.current = currentTime
      scrollAccumulator.current += e.deltaY

      // Clear existing reset timer
      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }

      // Set new reset timer
      resetTimer.current = setTimeout(() => {
        resetScrollProgress()
      }, 800) // Reset after 800ms of no scrolling

      const currentIndex = getCurrentPageIndex()
      const absAccumulator = Math.abs(scrollAccumulator.current)

      // Check if navigation is possible
      const canNavigateDown =
        scrollAccumulator.current > 0 && currentIndex < PAGE_ORDER.length - 1
      const canNavigateUp = scrollAccumulator.current < 0 && currentIndex > 0

      if (
        canNavigate() &&
        (canNavigateDown || canNavigateUp) &&
        !keyHoldTimer.current
      ) {
        setDirection(scrollAccumulator.current > 0 ? 'down' : 'up')
        setShowIndicator(true)

        if (absAccumulator < 150) {
          setKeyHoldProgress(0)
        } else {
          const progress = Math.min((absAccumulator - 50) / 700, 1) * 100 // 700px scroll distance for full progress
          setKeyHoldProgress(progress)

          // Trigger navigation when scroll threshold is reached
          if (progress >= 100) {
            if (canNavigateDown) {
              navigateToPage(PAGE_ORDER[currentIndex + 1])
            } else if (canNavigateUp) {
              navigateToPage(PAGE_ORDER[currentIndex - 1])
            }
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      getCurrentPageIndex,
      showIntro,
      page?._type,
      resetScrollProgress,
      view?.isNavigating,
      canNavigate,
      navigateToPage,
    ]
  )

  // Update view context when page changes
  useEffect(() => {
    const currentIndex = getCurrentPageIndex()
    const currentPageSlug = PAGE_ORDER[currentIndex] as '' | 'films' | 'contact'

    updateView({
      ...view,
      page: currentPageSlug,
      nextPage:
        currentIndex < PAGE_ORDER.length - 1
          ? (PAGE_ORDER[currentIndex + 1] as 'films' | 'contact')
          : view.nextPage || undefined,
      // previousPage:
      //   currentIndex > 0
      //     ? (PAGE_ORDER[currentIndex - 1] as '' | 'films' | 'contact')
      //     : view.previousPage || undefined,
      isNavigating: false,
      lastNavigationTime: view?.lastNavigationTime,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, getCurrentPageIndex, view?.lastNavigationTime])

  // Remove keyboard handlers and add wheel handler
  useEffect(() => {
    const keyHoldTimerRef = keyHoldTimer.current
    const keyProgressIntervalRef = keyProgressInterval.current
    const resetTimerRef = resetTimer.current

    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.removeEventListener('wheel', handleWheel)

      if (keyHoldTimerRef) {
        clearTimeout(keyHoldTimerRef)
      }
      if (keyProgressIntervalRef) {
        clearInterval(keyProgressIntervalRef)
      }
      if (resetTimerRef) {
        clearTimeout(resetTimerRef)
      }
    }
  }, [handleWheel])

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

    setTimeout(() => {
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
    }, 600)
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
        className="flex flex-col min-h-full transition-colors duration-100"
        style={{ backgroundColor: 'var(--theme-bg)' }}
      >
        <AnimatePresence>
          {showWipe && (
            <>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={wipeVariants}
                className={classNames('fixed w-full h-full bg-blue z-above')}
              ></motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Navigation Indicator with Progress */}
        <AnimatePresence>
          {showIndicator && page?._type === 'page' && !view?.isNavigating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ y: direction === 'up' ? 40 : -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
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
        </AnimatePresence>

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
                className="group fixed right-[calc(50%-40px)] md:right-[calc(50%-57px)] lg:right-x bottom-x p-2 mix-blend-difference md:mix-blend-normal bg-black md:bg-transparent hover:bg-black rounded-full z-above"
              >
                <IconLogo className="w-[80px] md:w-[114px] h-auto animate-fadeIn theme-menu-fill [&_path]:fill-white md:[&_path]:fill-black group-hover:[&_path]:fill-white" />
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
