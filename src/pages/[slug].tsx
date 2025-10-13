import groq from 'groq'
import type {
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticProps,
  NextPage,
} from 'next'
import type { Page as SanityPage } from '@gen/sanity-schema'
import type { PageProps } from '@lib/next'
import { getPageStaticProps } from '@lib/next'
import { BODY_QUERY, client, filterDataToSingleItem } from '@studio/lib'
import { BlockContent } from '@components/sanity'
import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useState,
} from 'react'
import PageTransition from '@components/transition/PageTransition'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

type PageRefType = React.ForwardedRef<HTMLDivElement>

const ALL_SLUGS_QUERY = groq`*[_type == "page" && defined(slug.current)][].slug.current`
const PAGE_QUERY = groq`
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

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await client.fetch(ALL_SLUGS_QUERY)
  return {
    paths: pages.map((slug: string) => `/${slug}`),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = context =>
  getPageStaticProps({ ...context, query: PAGE_QUERY })

const Page: NextPage<PageProps> = (
  { data, preview }: InferGetStaticPropsType<typeof getStaticProps>,
  ref: PageRefType
) => {
  const { asPath, push } = useRouter()
  const page: SanityPage = filterDataToSingleItem(data)
  const [showIndicator, setShowIndicator] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)

  const getCurrentPageIndex = () => {
    const currentSlug = asPath.substring(1)
    return PAGE_ORDER.indexOf(currentSlug)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    console.log('Key pressed:', e.key)
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const currentIndex = getCurrentPageIndex()

      if (e.key === 'ArrowDown' && currentIndex < PAGE_ORDER.length - 1) {
        // Arrow down - next page
        setDirection('down')
        setShowIndicator(true)
        setTimeout(() => {
          push(`/${PAGE_ORDER[currentIndex + 1]}`)
          setShowIndicator(false)
        }, 200)
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        // Arrow up - previous page
        setDirection('up')
        setShowIndicator(true)
        setTimeout(() => {
          push(`/${PAGE_ORDER[currentIndex - 1]}`)
          setShowIndicator(false)
        }, 200)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath])

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
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-full p-4">
            <div
              className="w-8 h-8 flex items-center justify-center text-2xl"
              style={{ color: 'var(--theme-text)' }}
            >
              {direction === 'up' ? '↑' : '↓'}
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.article
          key={asPath}
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
