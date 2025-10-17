import type { PortableTextBlockStyle } from '@portabletext/types'
import type {
  PortableTextReactComponents,
  PortableTextBlockComponent,
} from '@portabletext/react'
import { reactNodeToString } from '@lib/util'
import { SanityLink, SanityMedia } from '.'
import { SanityLinkType } from '@studio/lib'
import { RoughNotation } from 'react-rough-notation'

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
  redUnderline: ({ children }) => {
    return (
      <RoughNotation
        type="underline"
        show={true}
        color="#A90736"
        strokeWidth={2.5}
        iterations={1}
        padding={-1}
        animationDelay={100}
        animationDuration={600}
      >
        {children}
      </RoughNotation>
    )
  },
  redCircle: ({ children }) => {
    return (
      <RoughNotation
        type="circle"
        show={true}
        color="#A90736"
        strokeWidth={2.5}
        iterations={1}
        animationDelay={100}
        animationDuration={600}
      >
        {children}
      </RoughNotation>
    )
  },
  alignment: ({ children, value }) => {
    return (
      <span style={{ textAlign: value.align }} className="inline-block w-full">
        {children}
      </span>
    )
  },
}

/**
 * PortableText blocks used globally
 */
export const blockBlock: Record<
  PortableTextBlockStyle,
  PortableTextBlockComponent | undefined
> = {}
