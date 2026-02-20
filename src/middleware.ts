import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Check if it's a subdomain of ajointventure.com
  if (hostname.includes('.ajointventure.com') && !hostname.startsWith('www.')) {
    const subdomain = hostname.split('.')[0]
    url.pathname = `/microsite/${subdomain}${url.pathname}` // maps foo.ajointventure.com/about -> /foo/about
    return NextResponse.rewrite(url)
  }

  // Check if it's colonoscopyreminder.com
  if (hostname.includes('colonoscopyreminder.com')) {
    url.pathname = `/psa/${url.pathname}` // maps colonoscopyreminder.com -> /psa/about
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
