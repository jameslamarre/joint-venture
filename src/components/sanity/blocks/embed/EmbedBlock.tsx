import { type FC, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import type { EmbedBlock as EmbedBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block } from '@components/sanity'
import { useRouter } from 'next/router'

interface EmbedBlockProps
  extends Omit<SanityBlockElement, keyof EmbedBlockType>,
    EmbedBlockType {
  bgColor?: 'black' | 'white'
}

export const EmbedBlock: FC<EmbedBlockProps> = ({
  embed,
  index,
  className,
}) => {
  const { events } = useRouter()
  const [key, setKey] = useState(Date.now())

  // Reset key when route completes to force remount
  useEffect(() => {
    const handleRouteComplete = () => {
      setKey(Date.now())
    }

    events.on('routeChangeComplete', handleRouteComplete)
    return () => {
      events.off('routeChangeComplete', handleRouteComplete)
    }
  }, [events])

  // Use callback ref to execute scripts when the element mounts
  const containerRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !embed) return

      // Use requestAnimationFrame to ensure DOM is fully painted
      requestAnimationFrame(() => {
        const scripts = node.querySelectorAll('script')

        scripts.forEach(oldScript => {
          const newScript = document.createElement('script')

          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value)
          })

          newScript.textContent = oldScript.textContent
          oldScript.parentNode?.replaceChild(newScript, oldScript)
        })
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [embed, key]
  )

  if (!embed) return null

  return (
    <Block className={classNames(className, 'w-full')}>
      <div className="w-full max-w-textWrap min-h-[70dvh] md:min-h-[50dvh] mt-y mx-auto">
        <div
          key={`${key}-${index}`}
          ref={containerRefCallback}
          className="h-full min-h-[70dvh] md:min-h-[50dvh]"
          dangerouslySetInnerHTML={{ __html: embed as string }}
        />
      </div>
    </Block>
  )
}

export default EmbedBlock
