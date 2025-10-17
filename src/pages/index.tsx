import groq from 'groq'
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next'
import type { Page as SanityPage } from '@gen/sanity-schema'
import type { PageProps } from '@lib/next'
import { getPageStaticProps } from '@lib/next'
import { BODY_QUERY, filterDataToSingleItem } from '@studio/lib'
import { BlockContent } from '@components/sanity'
import { forwardRef, ForwardRefRenderFunction } from 'react'
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

export const getStaticProps: GetStaticProps = context =>
  getPageStaticProps({ ...context, query: HOME_QUERY })

const Page: NextPage<PageProps> = (
  { data, preview }: InferGetStaticPropsType<typeof getStaticProps>,
  ref: PageRefType
) => {
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
      <AnimatePresence>
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
          className="pt-y md:pt-page"
        >
          <BlockContent blocks={page?.body} className="flex flex-col w-full" />
        </motion.article>
      </AnimatePresence>
    </PageTransition>
  ) : null
}

export default forwardRef(Page as ForwardRefRenderFunction<unknown, {}>)
