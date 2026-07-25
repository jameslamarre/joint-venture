import { useEffect, useState, useCallback, type FC } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import { Head } from '@components/head'
import { Header } from '@components/header'
import { filterDataToSingleItem } from '@studio/lib'
import { triggerToastPreview } from '@components/toast'
import LogoContainer from '@components/logo/LogoContainer'
import { AnimatePresence, motion } from 'framer-motion'
import classNames from 'classnames'
import { useRef } from 'react'
import { useNavigation } from '@contexts/view/ViewContext'
import PAGE_ORDER from '@globals/pages'
import { LogoButton } from '@components/logo'
import { TransitionIndicator } from '@components/transition-indicator'
import { LayoutProps, PageData } from './types'
import THEME_CSS_VARS from './consts'
import { FaRotateLeft } from 'react-icons/fa6'
import { getRoutePageMeta } from '@lib/page-meta'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const Layout: FC<LayoutProps> = ({
  children,
  data,
  preview = false,
  siteSettings,
}) => {
  const scrollAccumulator = useRef<number>(0)
  const lastScrollTime = useRef<number>(0)

  const { asPath, push } = useRouter()
  const page: PageData = filterDataToSingleItem(data)
  const routeMeta = getRoutePageMeta(asPath)
  const [view, updateView, { setNavigating, canNavigate }] =
    useNavigation() as any

  const themeSetRef = useRef(false)

  const [showIntro, setShowIntro] = useState(asPath === '/')
  const [showContent, setShowContent] = useState(false)

  const [currentTheme, setCurrentTheme] = useState<
    'stone' | 'yellow' | 'blue' | 'dark'
  >(asPath.includes('/jobs') ? 'dark' : page?.initialColor || 'stone')

  const [showIndicator, setShowIndicator] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)
  const [keyHoldProgress, setKeyHoldProgress] = useState(0)

  const keyHoldTimer = useRef<NodeJS.Timeout | null>(null)
  const keyProgressInterval = useRef<NodeJS.Timeout | null>(null)
  const resetTimer = useRef<NodeJS.Timeout | null>(null)

  const [isNavigationInProgress, setIsNavigationInProgress] = useState(false)
  const [showWipe, setShowWipe] = useState(false)

  const seoImage =
    (page as any)?.previewImage || (page as any)?.image || undefined

  const getCurrentPageIndex = useCallback(() => {
    return routeMeta.flowSlug === null
      ? -1
      : PAGE_ORDER.indexOf(routeMeta.flowSlug)
  }, [routeMeta.flowSlug])

  const resetScrollProgress = useCallback(() => {
    scrollAccumulator.current = 0
    setShowIndicator(false)
    setKeyHoldProgress(0)
    if (keyHoldTimer.current) {
      clearTimeout(keyHoldTimer.current)
      keyHoldTimer.current = null
    }
  }, [])

  const currentIndex =
    routeMeta.flowSlug === null ? -1 : PAGE_ORDER.indexOf(routeMeta.flowSlug)

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
        routeMeta.flowSlug === null ||
        view?.isNavigating ||
        isNavigationInProgress ||
        (typeof window !== 'undefined' &&
          document.body.classList.contains('overflow-hidden'))
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
      routeMeta.flowSlug,
      resetScrollProgress,
      view?.isNavigating,
      canNavigate,
      navigateToPage,
      isNavigationInProgress,
    ]
  )

  const cycleTheme = useCallback(() => {
    const nextTheme = () => {
      switch (currentTheme) {
        case 'stone':
          return 'blue'
        case 'yellow':
          return 'blue'
        case 'blue':
          return 'dark'
        case 'dark':
          return 'stone'
        default:
          return 'stone'
      }
    }

    themeSetRef.current = true

    const newTheme = nextTheme()
    setCurrentTheme(newTheme)
  }, [currentTheme])

  // Update view context when page changes
  useEffect(() => {
    const currentPageSlug = routeMeta.flowSlug

    updateView({
      ...view,
      page: page?._type === 'project' ? 'film' : currentPageSlug ?? undefined,
      isNavigating: false,
      lastNavigationTime: view?.lastNavigationTime,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, routeMeta.flowSlug, view?.lastNavigationTime])

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

  // Apply CSS custom properties whenever currentTheme changes
  useEffect(() => {
    const vars = THEME_CSS_VARS[currentTheme]
    Object.entries(vars).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value)
    })
  }, [currentTheme])

  // Set CSS custom properties for theme colors
  useEffect(() => {
    // Only update theme from page if user hasn't overridden it
    if (asPath.includes('/jobs')) {
      setCurrentTheme('dark')
    } else if (page?.initialColor && !themeSetRef.current) {
      setCurrentTheme(page.initialColor)
    }
  }, [asPath, page?._type, page?.initialColor])

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
        seoTitle={page?.seo?.title || routeMeta.headerTitle}
        pageType={page?._type}
        pageTitle={page?.title || routeMeta.headerTitle}
        pageDescription={page?.seo?.description}
        pageKeywords={page?.seo?.keywords}
        pageImage={seoImage}
        pageUrl={`${BASE_URL}${asPath}`}
      />
      <div
        className="flex flex-col min-h-full transition-colors duration-100"
        style={{ backgroundColor: 'var(--theme-bg)' }}
      >
        <div
          className={classNames(
            'hidden landscape:flex base:landscape:hidden flex-col items-center justify-center gap-yhalf fixed w-full h-full top-0 left-0 inset-0 pointer-events-none z-alert'
          )}
          style={{ backgroundColor: 'var(--theme-bg)' }}
        >
          <FaRotateLeft
            size="32"
            className="animate-spin direction-reverse ease-in-out duration-snail"
          />
          <h3 className="text-h3">Site best viewed in portrait</h3>
        </div>

        <AnimatePresence>
          {showWipe && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={wipeVariants}
              className={classNames('fixed w-full h-full bg-yellow z-above')}
            ></motion.div>
          )}
        </AnimatePresence>

        {/* Page Navigation Indicator with Progress */}
        <AnimatePresence>
          {showIndicator &&
            routeMeta.flowSlug !== null &&
            !view?.isNavigating && (
              <TransitionIndicator
                direction={direction as 'up' | 'down'}
                keyHoldProgress={keyHoldProgress}
              />
            )}
        </AnimatePresence>

        {showIntro ? (
          <LogoContainer setShowIntro={() => setShowIntro(false)} />
        ) : (
          <>
            <Header
              className="flex-initial"
              currentPage={
                page?._type === 'project'
                  ? 'Films'
                  : page?._type === 'job'
                  ? 'Jobs'
                  : page?.title || routeMeta.headerTitle
              }
              showContent={showContent}
              setShowContent={() => setShowContent(true)}
            />

            {(page?._type === 'page' ||
              page?._type === 'project' ||
              routeMeta.flowSlug !== null) &&
              !asPath.includes('/jobs') && (
                <LogoButton
                  color={page?.initialColor}
                  asPath={asPath}
                  cycleTheme={cycleTheme}
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
      </div>
      <ToastContainer />
    </>
  )
}
