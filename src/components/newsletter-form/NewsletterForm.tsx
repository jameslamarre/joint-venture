import { Cta } from '@components/btns'
import { RichText } from '@components/sanity'
import { TypedObject } from '@portabletext/types'
import { RichText as RichTextType } from '@studio/gen/sanity-schema'
import classNames from 'classnames'
import { useState, type FC } from 'react'

type NewsletterFormProps = {
  newsletterId: string
  className?: string
  footer?: boolean
  successMessage?: RichTextType
}

export const NewsletterForm: FC<NewsletterFormProps> = ({
  newsletterId,
  successMessage,
  footer = true,
  className,
}) => {
  const [email, setEmail] = useState('')

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterId) return

    setIsSubmitting(true)
    setFormError(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          audienceId: newsletterId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setFormSubmitted(true)
      setEmail('')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (formSubmitted && !formError) {
    return (
      <RichText
        blocks={successMessage as TypedObject | TypedObject[]}
        className="w-full text-center"
      />
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div
          className={classNames(
            footer ? '' : 'justify-center items-center gap-y',
            'flex flex-col'
          )}
        >
          <input
            type="email"
            value={email}
            name="email"
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={classNames(
              className,
              footer ? 'input--footer h-[32px]' : 'h-[35px]',
              'input w-full'
            )}
            required
          />

          {footer ? (
            <button
              style={{
                color: 'var(--theme-text)',
                backgroundColor: 'var(--theme-bg)',
              }}
              className={classNames(
                className,
                'w-full h-[30px] px-xhalf hover:!bg-black hover:!text-white border-left border-right border-bottom font-sans text-sm uppercase'
              )}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <Cta
              style={{
                color: 'var(--theme-text)',
                backgroundColor: 'var(--theme-highlight)',
              }}
              className={classNames(className, 'w-fit h-btn pr-xhalf')}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Cta>
          )}
        </div>
      </form>

      {formError && (
        <div
          className={classNames(
            className,
            'w-full text-sm font-serif text-red mt-yhalf'
          )}
        >
          {formError}
        </div>
      )}
    </div>
  )
}

export default NewsletterForm
