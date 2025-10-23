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
    <Block className={classNames(className, 'w-full')}>
      <div className="w-full max-w-textWrap min-h-[75svh] mt-y mx-auto">
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
