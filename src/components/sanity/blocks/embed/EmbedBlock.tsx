import { type FC } from 'react'
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
  return (
    <Block className={classNames(className, 'relative w-full bg-yellow')}>
      <div className="w-full max-w-app min-h-[75svh] px-xhalf 2xl:px-0 py-yhalf mt-y mx-auto">
        {embed && (
          <div
            className="h-full min-h-[75svh] bg-white"
            dangerouslySetInnerHTML={{ __html: embed }}
          />
        )}
      </div>
    </Block>
  )
}

export default EmbedBlock
