import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Redirect /psa paths on main domain to colonoscopyreminder.com
  if (
    (hostname === 'www.ajointventure.com' ||
      hostname === 'ajointventure.com') &&
    url.pathname.startsWith('/psa')
  ) {
    const newPath = url.pathname.replace(/^\/psa/, '') || '/'
    return NextResponse.redirect(`https://colonoscopyreminder.com${newPath}`)
  }

  // Check if it's colonoscopyreminder.com
  if (hostname.includes('colonoscopyreminder.com')) {
    // Normalize: /psa for root, /psa/something for subpaths
    const newPath = url.pathname === '/' ? '/psa' : `/psa${url.pathname}`
    url.pathname = newPath
    return NextResponse.rewrite(url)
  }

  if (hostname === 'andre.ajointventure.com') {
    // redirect andre.ajointventure.com/tickets to andreisanidiot.film/tickets
    if (url.pathname === '/tickets') {
      return NextResponse.redirect('https://andreisanidiot.film/tickets')
    }
  }

  // Check if it's a subdomain of ajointventure.com
  if (hostname.includes('.ajointventure.com') && !hostname.startsWith('www.')) {
    const subdomain = hostname.split('.')[0]
    url.pathname = `/microsite/${subdomain}${url.pathname}` // maps foo.ajointventure.com/about -> /foo/about
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
    '/robots.txt',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
