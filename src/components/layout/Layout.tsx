import {
  useEffect,
  useState,
  useCallback,
  type FC,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import type { Page, Project, SiteSettings } from '@gen/sanity-schema'
import { Head } from '@components/head'
import { Header } from '@components/header'
// import { Footer } from '@components/footer'
import { filterDataToSingleItem } from '@studio/lib'
import { triggerToastPreview } from '@components/toast'
import LogoContainer from '@components/logo/LogoContainer'
import { AnimatePresence, motion } from 'framer-motion'
import classNames from 'classnames'
import { useRef } from 'react'
import { useNavigation } from '@contexts/view/ViewContext'
import PAGE_ORDER from '@globals/pages'
import { LogoButton } from '@components/logo'

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

  const getCurrentPageIndex = useCallback(() => {
    const currentSlug = asPath.substring(1) as '' | 'films' | 'join'
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

  const currentIndex = PAGE_ORDER.indexOf(
    asPath.substring(1) as '' | 'films' | 'join'
  )

  const pageVariants = {
    initial: {
      clipPath:
        view?.page === 'film' || view?.previousPage === undefined
          ? 'inset(0)'
          : view?.previousPage === 'film'
          ? 'inset(0 100% 0 0)'
          : currentIndex > PAGE_ORDER.indexOf(view?.previousPage)
          ? 'inset(100% 0 0 0)'
          : 'inset(0 0 100% 0)',
      opacity: 0.9,
    },
    animate: {
      clipPath: 'inset(0)',
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
    exit: {
      clipPath:
        view?.page === 'film'
          ? 'inset(0)'
          : view?.nextPage === 'film'
          ? 'inset(0 100% 0 0)'
          : direction === 'up'
          ? 'inset(100% 0 0 0)'
          : 'inset(0 0 100% 0)',
      opacity: 0.9,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  }

  const [isNavigationInProgress, setIsNavigationInProgress] = useState(false)

  const navigateToPage = useCallback(
    (targetPage: string) => {
      if (!canNavigate() || isNavigationInProgress) return

      setIsNavigationInProgress(true)
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
        setIsNavigationInProgress(false)
      }, 1200)
    },
    [
      canNavigate,
      setNavigating,
      push,
      resetScrollProgress,
      isNavigationInProgress,
    ]
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Only handle on pages, not projects or intro, and not during navigation
      if (
        showIntro ||
        page?._type !== 'page' ||
        view?.isNavigating ||
        isNavigationInProgress
      )
        return

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
        !isNavigationInProgress &&
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
            updateView({
              ...view,
              previousPage: view?.page,
            })
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
      isNavigationInProgress,
    ]
  )

  // Update view context when page changes
  useEffect(() => {
    const currentIndex = getCurrentPageIndex()
    const currentPageSlug = PAGE_ORDER[currentIndex] as '' | 'films' | 'join'

    updateView({
      ...view,
      page: page?._type === 'project' ? 'film' : currentPageSlug,
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
    if (!userOverrideTheme && page?.initialColor) {
      // eslint-disable-next-line react-you-might-not-need-an-effect/no-derived-state
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
          root.style.setProperty('--theme-text', '#000')
          root.style.setProperty('--theme-text--menu', '#CFE806')
          root.style.setProperty('--theme-menu', '#000')
          root.style.setProperty('--theme-highlight', '#CFE806')
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
    }, 300)
  }, [currentTheme, page?.initialColor, userOverrideTheme])

  // Reset user override when navigating to new page
  // useEffect(() => {
  //   setUserOverrideTheme(false)
  // }, [asPath])

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
                className={classNames('fixed w-full h-full bg-yellow z-above')}
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
                  'absolute rounded-full'
                )}
              >
                <div className="relative w-[42px] h-[42px] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 53 50"
                    className="absolute inset-0 w-[42px] h-[42px] -rotate-90"
                  >
                    <path
                      key="path-black"
                      fill="#000"
                      fillRule="evenodd"
                      d="M26.12.085c7.015 0 13.524 2.11 17.416 5.658 1.553 1.423 5.38 6.77 6.328 8.716 5.086 10.286 1.93 23.205-7.506 30.728-3.253 2.598-8.483 4.037-14.71 4.039-5.884-.002-11.996-1.277-16.36-3.418-4.334-2.126-9.828-12.46-10.286-17.89-.933-10.826 1.667-17.335 9.271-23.222C14.051 1.77 19.823.085 26.12.085m-.322 8.564c-1.018 0-2.036.105-3.001.288-4.126.783-7.573 3.394-9.688 7.363-2.297 4.282-2.742 9.608-1.201 14.23 2.271 6.814 6.476 10.13 12.873 10.13 1.723 0 3.655-.234 5.9-.73 5.953-1.28 12.455-10.68 12.011-17.364C41.886 10.604 32.377 9.364 28.741 8.89l-.044-.006-.6-.078a17 17 0 0 0-2.272-.157z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <motion.div
                    initial={{ maxHeight: 0 }}
                    animate={{ maxHeight: `${keyHoldProgress}%` }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                    style={{ backgroundColor: 'var(--theme-highlight)' }}
                    className={classNames(
                      direction === 'up' ? 'top-2' : 'bottom-2',
                      'absolute w-3/4 h-3/4 bg-white rounded-full z-behind'
                    )}
                  />
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
              setShowContent={() => setShowContent(true)}
            />

            {page?._type === 'page' && (
              <LogoButton
                color={page?.initialColor}
                asPath={asPath}
                setCurrentTheme={setCurrentTheme}
                setUserOverrideTheme={setUserOverrideTheme}
              />
            )}
          </>
        )}

        <AnimatePresence mode="wait">
          {showContent && (
            <motion.main
              key={`main-${asPath}`}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-auto overflow-hidden"
            >
              {children}
            </motion.main>
          )}
        </AnimatePresence>

        {/* <Footer
          content={siteSettings?.footerSocials as any}
          newsletterId={siteSettings?.newsletterId}
        /> */}
      </div>
      <ToastContainer />
    </>
  )
}
