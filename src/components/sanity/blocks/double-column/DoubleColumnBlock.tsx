import { type FC } from 'react'
import classNames from 'classnames'
import type {
  RichText as RichTextType,
  DoubleColumnBlock as DoubleColumnBlockType,
} from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block, RichText } from '@components/sanity'

type DoubleColumnBlockProps = Omit<
  SanityBlockElement,
  keyof DoubleColumnBlockType
> &
  DoubleColumnBlockType

export const DoubleColumnBlock: FC<DoubleColumnBlockProps> = ({
  columnOne,
  columnTwo,
  className,
}) => {
  return (
    <Block className={classNames(className)}>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-y lg:gap-x-ydouble w-full max-w-[900px] mx-auto">
        <RichText
          blocks={columnOne as RichTextType}
          className={classNames('w-full')}
        />

        <RichText
          blocks={columnTwo as RichTextType}
          className={classNames('w-full')}
        />
      </div>
    </Block>
  )
}

export default DoubleColumnBlock
