import { type FC } from 'react'
import classNames from 'classnames'
import type {
  RichText as RichTextType,
  TextBlock as TextBlockType,
} from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block, RichText } from '@components/sanity'

type TextBlockProps = Omit<SanityBlockElement, keyof TextBlockType> &
  TextBlockType

export const TextBlock: FC<TextBlockProps> = ({ text, className }) => {
  return (
    <Block className={classNames(className)}>
      <RichText
        blocks={text as RichTextType}
        className={classNames('w-full max-w-textWrap mx-auto')}
      />
    </Block>
  )
}

export default TextBlock
