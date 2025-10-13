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
import { forwardRef, ForwardRefRenderFunction } from 'react'
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
  const { asPath } = useRouter()
  const page: SanityPage = filterDataToSingleItem(data)

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
