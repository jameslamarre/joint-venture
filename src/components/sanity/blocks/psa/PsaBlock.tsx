import { type FC } from 'react'
import classNames from 'classnames'
import type { PsaBlock as PsaBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block } from '@components/sanity'

export type PsaBlockProps = Omit<SanityBlockElement, keyof PsaBlockType> &
  PsaBlockType

export const PsaBlock: FC<PsaBlockProps> = ({ showPsa, className }) => {
  return (
    <Block className={classNames(className, 'pt-header px-xhalf pb-ydouble')}>
      {showPsa && (
        <div className="w-full h-[80dvh]">
          <iframe
            src="/code/psa-for-iframe/index.html"
            width="100%"
            height="100%"
          />
        </div>
      )}
    </Block>
  )
}

export default PsaBlock
