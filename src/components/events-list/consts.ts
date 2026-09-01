import slugify from 'slugify'

export const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
})

const getDatePartsForTimezone = (
  date: Date,
  timezone?: string | null
): { year: string; month: string; day: string } => {
  const normalizedTimezone = timezone?.trim() || undefined

  if (!normalizedTimezone) {
    return {
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      day: String(date.getDate()).padStart(2, '0'),
    }
  }

  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: normalizedTimezone,
    }).formatToParts(date)

    const year = parts.find(part => part.type === 'year')?.value
    const month = parts.find(part => part.type === 'month')?.value
    const day = parts.find(part => part.type === 'day')?.value

    if (!year || !month || !day) {
      throw new Error('Missing date parts')
    }

    return { year, month, day }
  } catch {
    return {
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      day: String(date.getDate()).padStart(2, '0'),
    }
  }
}

export const SELECT_HYPHEN_BG =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 190 77%27%3E%3Cpath fill=%27white%27 stroke=%27none%27 d=%27M1.28 1.02C29.937-.063 59.124.283 87.41.63c24.501.3 97.169.346 101.672.392v75.484L.033 74.73 1.257 1.02h.023Z%27/%3E%3C/svg%3E")'

export const monthKeyFromISO = (
  isoDate: string,
  timezone?: string | null
): string => {
  const date = new Date(isoDate)
  const { year, month } = getDatePartsForTimezone(date, timezone)
  return `${year}-${month}`
}

export const monthLabelFromISO = (
  isoDate: string,
  timezone?: string | null
): string => {
  const date = new Date(isoDate)
  const normalizedTimezone = timezone?.trim() || undefined

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      timeZone: normalizedTimezone,
    }).format(date)
  } catch {
    return monthFormatter.format(date)
  }
}

export const dateKeyFromDate = (
  date: Date,
  timezone?: string | null
): string => {
  const { year, month, day } = getDatePartsForTimezone(date, timezone)
  return `${year}-${month}-${day}`
}

export const dateKeyFromISO = (
  isoDate: string,
  timezone?: string | null
): string => {
  return dateKeyFromDate(new Date(isoDate), timezone)
}

const EVENT_UID_DELIMITER = '--'

export const getEventSlug = (title: string, uid: string): string => {
  const readableTitle = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  })

  return `${readableTitle || 'event'}${EVENT_UID_DELIMITER}${uid}`
}

export const getEventHref = (title: string, uid: string): string => {
  return `/events/${getEventSlug(title, uid)}`
}

export const getUidFromEventSlug = (slug: string): string | null => {
  const delimiterIndex = slug.lastIndexOf(EVENT_UID_DELIMITER)

  if (delimiterIndex === -1) {
    return slug || null
  }

  const uid = slug.slice(delimiterIndex + EVENT_UID_DELIMITER.length)
  return uid || null
}
