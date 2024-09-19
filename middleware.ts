export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/create-match/:path*',
    '/create-season/:path*',
    '/update-match/:path*',
    '/update-season/:path*',
    '/edit-lineup/:path*',
  ],
}
