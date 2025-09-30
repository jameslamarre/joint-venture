import type { FC } from 'react'
import classNames from 'classnames'
import type { AccordionBlock as AccordionBlockType } from '@gen/sanity-schema'
import type { SanityBlockElement } from '@components/sanity'
import { Block } from '@components/sanity'
import { Accordion } from '@components/accordion'

type AccordionBlockProps = Omit<SanityBlockElement, keyof AccordionBlockType> &
  AccordionBlockType

export const AccordionBlock: FC<AccordionBlockProps> = ({
  accordions,
  className,
}) => {
  return (
    <Block
      className={classNames(
        className,
        'min-h-[50svh] bg-yellow text-black px-x lg:px-0'
      )}
    >
      <div className="max-w-wrapsm py-yhalf mx-auto">
        {accordions &&
          accordions.length > 0 &&
          accordions.map(({ _key, header, text }) => (
            <Accordion
              key={_key}
              header={header}
              text={text}
              className="mt-yhalf first-of-type:mt-0"
            />
          ))}
      </div>
    </Block>
  )
}

export default AccordionBlock
