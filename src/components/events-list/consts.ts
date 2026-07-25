import slugify from 'slugify'

export const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
})

export const SELECT_HYPHEN_BG =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 190 77%27%3E%3Cpath fill=%27white%27 stroke=%27none%27 d=%27M1.28 1.02C29.937-.063 59.124.283 87.41.63c24.501.3 97.169.346 101.672.392v75.484L.033 74.73 1.257 1.02h.023Z%27/%3E%3C/svg%3E")'

export const monthKeyFromISO = (isoDate: string): string => {
  const date = new Date(isoDate)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
    2,
    '0'
  )}`
}

export const monthLabelFromISO = (isoDate: string): string => {
  return monthFormatter.format(new Date(isoDate))
}

export const dateKeyFromDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`
}

export const dateKeyFromISO = (isoDate: string): string => {
  return dateKeyFromDate(new Date(isoDate))
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
