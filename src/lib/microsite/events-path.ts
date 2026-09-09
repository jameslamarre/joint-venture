const getHostName = (host?: string): string => {
  return (host ?? '').split(':')[0].toLowerCase()
}

export const isMicrositeSubdomainRequest = (host?: string): boolean => {
  const hostname = getHostName(host)

  return hostname.endsWith('.ajointventure.com') && !hostname.startsWith('www.')
}

export const getMicrositeEventsBasePath = (
  micrositeKey: string,
  host?: string
): string => {
  if (isMicrositeSubdomainRequest(host)) {
    return '/events'
  }

  return `/microsite/${micrositeKey}/events`
}
