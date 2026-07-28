/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Script from 'next/script'
import { Fragment } from 'react'

import { dateTimeFormatter } from '@lib/util/date-formatters'

const DESCRIPTION_TOKEN_REGEX = /(\*\*[^*]+\*\*|\*[^*]+\*)/g

const renderFormattedDescription = (description: string) => {
  const lines = description.split(/\r?\n/)

  return lines.map((line, lineIndex) => {
    const segments = line.split(DESCRIPTION_TOKEN_REGEX)

    return (
      <Fragment key={`line-${lineIndex}`}>
        {segments.map((segment, segmentIndex) => {
          if (
            segment.startsWith('**') &&
            segment.endsWith('**') &&
            segment.length > 4
          ) {
            return (
              <strong key={`segment-${lineIndex}-${segmentIndex}`}>
                {segment.slice(2, -2)}
              </strong>
            )
          }

          if (
            segment.startsWith('*') &&
            segment.endsWith('*') &&
            segment.length > 2
          ) {
            return (
              <em key={`segment-${lineIndex}-${segmentIndex}`}>
                {segment.slice(1, -1)}
              </em>
            )
          }

          return (
            <Fragment key={`segment-${lineIndex}-${segmentIndex}`}>
              {segment}
            </Fragment>
          )
        })}

        {lineIndex < lines.length - 1 ? <br /> : null}
      </Fragment>
    )
  })
}

export type EventContent = {
  uid: string
  momentSlug: string | null
  title: string
  startDate: string
  location: string
  description: string
  imageUrl: string | null
}

type EventProps = {
  event: EventContent
}

export const Event = ({ event }: EventProps) => {
  return (
    <article className="py-page px-x">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y md:gap-xdouble w-full">
        <div className="order-2 md:order-1 flex flex-col gap-yhalf md:gap-y w-full">
          <div className="flex flex-col gap-yhalf md:gap-y w-full">
            <h1 className="text-h2">{event.title}</h1>

            <div className="flex flex-col">
              <p>
                <span className="font-sans">When: </span>
                <time dateTime={event.startDate} className="text-baseSerif">
                  {dateTimeFormatter.format(new Date(event.startDate))}
                </time>
              </p>
              <p>
                <span className="font-sans">Location: </span>
                <span className="text-baseSerif">{event.location}</span>
              </p>
            </div>

            <div
              id="itm-embed-container"
              data-itm-ticket-button
              data-itm-origin="https://jointventure.itm.studio"
              data-itm-moment={event.momentSlug || event.uid}
              data-itm-color="#FFFFFF"
              data-itm-radius="0"
              data-itm-text="Get Tickets"
              data-itm-theme="dark"
              className="highlight w-fit"
              style={{
                maxWidth: '100%',
                margin: 0,
                padding: 0,
                lineHeight: 0,
                color: 'black',
                fontSize: '16px',
              }}
            />

            <style jsx global>{`
              #itm-embed-container,
              #itm-embed-container * {
                color: #000 !important;
                text-transform: uppercase !important;
                font-family: 'Monument', sans-serif !important;
                background: none !important;
              }
            `}</style>
          </div>

          {event.description && (
            <p className="text-baseSerif">
              {renderFormattedDescription(event.description)}
            </p>
          )}

          <div className="relative block w-full">
            <Link href="/events">← Back to all events</Link>
          </div>
        </div>

        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="order-1 md:order-2 w-full object-cover"
          />
        ) : null}
      </div>

      <Script
        src="https://jointventure.itm.studio/embed/v1.js"
        strategy="afterInteractive"
      />
    </article>
  )
}
