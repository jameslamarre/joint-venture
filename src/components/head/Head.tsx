import type { FC } from 'react'
import NextHead from 'next/head'
import type { HeadProps } from './types'
import { useHeadTitle } from './use-title'
import { useHeadImages } from './use-images'

const capitalizeTitleIfNeeded = (value: string): string => {
  const firstLetterIndex = value.search(/[a-zA-Z]/)

  if (firstLetterIndex === -1) {
    return value
  }

  const firstLetter = value[firstLetterIndex]

  if (firstLetter === firstLetter.toUpperCase()) {
    return value
  }

  return `${value.slice(
    0,
    firstLetterIndex
  )}${firstLetter.toUpperCase()}${value.slice(firstLetterIndex + 1)}`
}

export const Head: FC<HeadProps> = props => {
  const title = useHeadTitle({
    seoTitle: props.seoTitle,
    pageTitle: props.pageTitle,
    siteTitle: props.siteTitle,
  })
  const { pageImage, siteImage } = useHeadImages({
    pageImage: props.pageImage,
    siteImage: props.siteImage,
  })
  const normalizedTitle = capitalizeTitleIfNeeded(title || 'Joint Venture')

  const currentPageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${window.location.search}`
      : props.pageUrl

  return (
    <NextHead>
      <title key="title">{normalizedTitle}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1 maximum-scale=1"
      />
      <meta
        name="description"
        content={props.pageDescription || props.siteDescription}
        key="description"
      />
      <meta
        name="keywords"
        content={props.pageKeywords || props.siteKeywords}
        key="keywords"
      />
      {currentPageUrl && <link rel="canonical" href={currentPageUrl} />}
      {/* og */}
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={normalizedTitle} />
      <meta
        name="og:description"
        property="og:description"
        content={props.pageDescription || props.siteDescription}
      />
      <meta property="og:site_name" content={props.siteTitle} />
      {currentPageUrl && <meta property="og:url" content={currentPageUrl} />}
      <meta property="og:image" content={pageImage?.src || siteImage?.src} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={normalizedTitle} />
      <meta
        name="twitter:description"
        content={props.pageDescription || props.siteDescription}
      />
      <link rel="icon" href={'/favicon.png'} />
    </NextHead>
  )
}

export default Head
