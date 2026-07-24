export type FlowSlug = '' | 'about' | 'films' | 'events' | 'join'

export type RoutePageMeta = {
  headerTitle: string
  flowSlug: FlowSlug | null
}

const normalizePath = (asPath: string): string => {
  const withoutQuery = asPath.split('?')[0].split('#')[0]

  if (withoutQuery !== '/' && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1)
  }

  return withoutQuery
}

export const getRoutePageMeta = (asPath: string): RoutePageMeta => {
  const pathname = normalizePath(asPath)

  if (pathname === '/') {
    return { headerTitle: 'Home', flowSlug: '' }
  }

  if (pathname === '/about') {
    return { headerTitle: 'About', flowSlug: 'about' }
  }

  if (pathname === '/films') {
    return { headerTitle: 'Films', flowSlug: 'films' }
  }

  if (pathname === '/events') {
    return { headerTitle: 'Events', flowSlug: 'events' }
  }

  if (pathname === '/join') {
    return { headerTitle: 'Join', flowSlug: 'join' }
  }

  if (pathname.startsWith('/jobs')) {
    return { headerTitle: 'Jobs', flowSlug: null }
  }

  if (pathname.startsWith('/film/')) {
    return { headerTitle: 'Films', flowSlug: null }
  }

  return { headerTitle: '', flowSlug: null }
}
