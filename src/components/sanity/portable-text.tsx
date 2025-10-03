import type { PortableTextBlockStyle } from '@portabletext/types'
import type {
  PortableTextReactComponents,
  PortableTextBlockComponent,
} from '@portabletext/react'
import { reactNodeToString } from '@lib/util'
import { SanityLink, SanityMedia } from '.'
import { SanityLinkType } from '@studio/lib'

/**
 * PortableText types used globally
 */
export const blockTypes: Partial<PortableTextReactComponents['types']> = {
  media: ({ value }) => {
    return (
      <SanityMedia
        imageProps={{
          alt: value?.alt || 'Media',
          lqip: (value?.image as any)?.asset?.metadata?.lqip,
        }}
        {...(value as any)}
        className="max-w-full h-auto"
      />
    )
  },
  divider: () => {
    return <span className="block h-[2px]" />
  },
  cta: ({ value }) => {
    return (
      <div className="inline-block relative mt-y z-above">
        <SanityLink cta={true} {...(value.link as SanityLinkType)}>
          {value.text}
        </SanityLink>
      </div>
    )
  },
}

/**
 * PortableText marks used globally
 */
export const blockMarks: Partial<PortableTextReactComponents['marks']> = {
  link: ({ children, value }) => {
    const text = reactNodeToString(children)
    return <SanityLink {...{ ...value, text }} />
  },
  highlight: ({ children }) => {
    return <span className="highlight">{children}</span>
  },
  anchor: ({ children, value }) => {
    return <span id={value.anchorId}>{children}</span>
  },
}

/**
 * PortableText blocks used globally
 */
export const blockBlock: Record<
  PortableTextBlockStyle,
  PortableTextBlockComponent | undefined
> = {}
