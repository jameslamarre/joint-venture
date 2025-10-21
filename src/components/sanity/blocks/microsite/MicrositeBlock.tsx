import { type FC } from 'react'
import classNames from 'classnames'
import type { MicrositeBlock as MicrositeBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement, SanityMediaProps } from '@components/sanity'
import { Block } from '@components/sanity'

interface MicrositeBlockProps
  extends Omit<SanityBlockElement, keyof MicrositeBlockType>,
    MicrositeBlockType {}

export const MicrositeBlock: FC<MicrositeBlockProps> = ({ className }) => {
  return <Block className={classNames(className)}>HELLO world</Block>
}

export default MicrositeBlock
