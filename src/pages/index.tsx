import groq from 'groq'
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next'
import type { Page as SanityPage } from '@gen/sanity-schema'
import type { PageProps } from '@lib/next'
import { getPageStaticProps } from '@lib/next'
import { BODY_QUERY, filterDataToSingleItem } from '@studio/lib'
import { BlockContent } from '@components/sanity'
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import PageTransition from '@components/transition/PageTransition'

type PageRefType = React.ForwardedRef<HTMLDivElement>

const HOME_QUERY = groq`
  *[_type == "page" && slug.current == $slug]{
    _id,
    _type,
    title,
    initialColor,
    seo,
    ${BODY_QUERY}
  }
`

const PAGE_ORDER = ['', 'films', 'contact']

export const getStaticProps: GetStaticProps = context =>
  getPageStaticProps({ ...context, query: HOME_QUERY })

const Page: NextPage<PageProps> = (
  { data, preview }: InferGetStaticPropsType<typeof getStaticProps>,
  ref: PageRefType
) => {
  const page: SanityPage = filterDataToSingleItem(data)
  const { push } = useRouter()

  const [showIndicator, setShowIndicator] = useState(false)

  const handleKeyPressDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShowIndicator(true)
    }
  }

  const handleKeyPressUp = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShowIndicator(false)
      setTimeout(() => {
        push(`/films`)
        setShowIndicator(false)
      }, 200)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPressDown)
    document.addEventListener('keyup', handleKeyPressUp)

    return () => {
      document.removeEventListener('keydown', handleKeyPressDown)
      document.removeEventListener('keyup', handleKeyPressUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pageVariants = {
    initial: {
      clipPath: 'inset(100% 0 0 0)',
      opacity: 0,
    },
    animate: {
      clipPath: 'inset(0 0 0 0)',
      opacity: 1,
    },
    exit: {
      clipPath: 'inset(0 0 100% 0)',
      opacity: 0,
    },
  }

  return page?.body && (!page?._id.includes('drafts.') || preview) ? (
    <PageTransition ref={ref}>
      {/* Swipe Indicator */}
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed h-dvh inset-0 z-above pointer-events-none flex items-center justify-center"
        >
          <div className="absolute bottom-y bg-white rounded-full p-4">
            <div
              className="flex items-center justify-center w-8 h-8 mb-1 text-2xl"
              style={{ color: 'var(--theme-text)' }}
            >
              ↓
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.article
          key="home-page"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            clipPath: { duration: 0.4 },
          }}
          className="pt-page"
        >
          <BlockContent blocks={page?.body} className="flex flex-col w-full" />
        </motion.article>
      </AnimatePresence>
    </PageTransition>
  ) : null
}

export default forwardRef(Page as ForwardRefRenderFunction<unknown, {}>)
