import classNames from 'classnames'
import { useState, type FC } from 'react'

type NewsletterFormProps = {
  newsletterId: string
  className?: string
}

export const NewsletterForm: FC<NewsletterFormProps> = ({
  newsletterId,
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
      <div className={classNames(className, 'font-medium text-center')}>
        Thanks for subscribing!
      </div>
    )
  }

  return (
    <div className={classNames(className, '')}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-yquarter w-full h-full pt-1"
      >
        <label className="block text-xs">{`Join our TINY mailing list!`}</label>

        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="input flex-1 h-input"
            required
          />

          <button
            className={`flex justify-between items-center h-input px-[14px] ${
              isSubmitting ? 'opacity-50' : ''
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            <span className="relative inline-block top-[2px] text-center">
              {isSubmitting ? 'Submitting...' : 'Subscribe'}
            </span>
          </button>
        </div>
      </form>

      {formError && (
        <div className="text-sm text-red mt-yhalf">{formError}</div>
      )}
    </div>
  )
}

export default NewsletterForm
