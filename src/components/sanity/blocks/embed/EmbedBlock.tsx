import { type FC, useEffect, useRef } from 'react'
import classNames from 'classnames'
import type { EmbedBlock as EmbedBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block } from '@components/sanity'

interface EmbedBlockProps
  extends Omit<SanityBlockElement, keyof EmbedBlockType>,
    EmbedBlockType {
  bgColor?: 'black' | 'white'
}

export const EmbedBlock: FC<EmbedBlockProps> = ({ embed, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !embed) return

    // Find all script tags in the embed HTML
    const container = containerRef.current
    const scripts = container.querySelectorAll('script')

    scripts.forEach(oldScript => {
      // Create a new script element to force execution
      const newScript = document.createElement('script')

      // Copy all attributes
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value)
      })

      // Copy inline script content
      newScript.textContent = oldScript.textContent

      // Replace old script with new one to trigger execution
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [embed])

  return (
    <Block className={classNames(className, 'w-full')}>
      <div className="w-full max-w-textWrap min-h-[50svh] mt-y mx-auto">
        {embed && (
          <div
            ref={containerRef}
            className="h-full min-h-[50svh]"
            dangerouslySetInnerHTML={{ __html: embed }}
          />
        )}
      </div>
    </Block>
  )
}

export default EmbedBlock
