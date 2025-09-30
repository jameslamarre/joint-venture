import { useRef, type FC, HTMLAttributes, useEffect } from 'react'
import classNames from 'classnames'
import type { RichText as RichTextType } from '@studio/gen/sanity-schema'
import {
  Disclosure,
  Transition,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { RichText } from '@components/sanity'
import IconPlus from '@components/icons/IconPlus'
import IconMinus from '@components/icons/IconMinus'

export interface AccordionProps extends HTMLAttributes<HTMLElement> {
  header?: string
  text?: RichTextType
  firstIndex?: boolean
  open?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export const Accordion: FC<AccordionProps> = ({
  header,
  text,
  open,
  className,
  onOpen,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const beforeEnter = () => {
    if (onOpen) onOpen()
    if (ref.current) {
      ref.current.style.maxHeight = ref.current.scrollHeight + 'px'
      setTimeout(() => {
        if (ref.current)
          ref.current.style.maxHeight = ref.current.scrollHeight + 'px'
      }, 1000)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const resizeAccordion = () => {
        if (ref.current) {
          ref.current.style.maxHeight = ref.current.scrollHeight + 'px'
        }
      }

      window.addEventListener('resize', resizeAccordion)

      return () => {
        window.removeEventListener('resize', resizeAccordion)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classNames(className, 'border-black')}>
      <Disclosure defaultOpen={open}>
        {({ open }) => {
          return (
            <>
              <DisclosureButton
                className={classNames(
                  `flex justify-between items-center px-xhalf py-yhalf w-full text-left`
                )}
              >
                {header && (
                  <h2 className={classNames('text-h2 uppercase')}>{header}</h2>
                )}

                {open ? (
                  <IconMinus className="w-[11px]" width={8} height={12} />
                ) : (
                  <IconPlus
                    className="relative w-[16px] top-[1px]"
                    width={16}
                    height={16}
                  />
                )}
              </DisclosureButton>

              <Transition
                show={open}
                enter="maxHeight duration-500 ease-in-out"
                enterFrom="max-h-0"
                enterTo="max-h-[1000px]"
                beforeEnter={beforeEnter}
                leave="maxHeight duration-500 ease-in-out"
                leaveFrom="max-h-[1000px]"
                leaveTo="max-h-0"
                beforeLeave={() => {
                  if (ref.current) {
                    ref.current.style.maxHeight =
                      ref.current.scrollHeight + 'px'
                    setTimeout(() => {
                      if (ref.current) ref.current.style.maxHeight = '0px'
                    }, 10)
                  }
                  if (onClose) onClose()
                }}
              >
                <div
                  ref={ref}
                  className={classNames(
                    open
                      ? 'overflow-visible md:overflow-hidden'
                      : 'overflow-hidden',
                    'will-change-[maxHeight] bg-black text-white'
                  )}
                >
                  <DisclosurePanel>
                    <div className={classNames('px-xhalf py-yhalf')}>
                      {text && <RichText blocks={text} />}
                    </div>
                  </DisclosurePanel>
                </div>
              </Transition>
            </>
          )
        }}
      </Disclosure>
    </div>
  )
}

export default Accordion
