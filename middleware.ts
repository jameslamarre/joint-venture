import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const match = hostname.match(/^(.+)\.ajointventure\.com$/)

  if (match) {
    const microsite = match[1]
    const url = request.nextUrl.clone()
    url.pathname = `/microsite/${microsite}${url.pathname}`
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: '/:path*',
}
