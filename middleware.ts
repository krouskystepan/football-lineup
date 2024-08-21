export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/create-match/:path*',
    '/update-match/:path*',
    '/edit-lineup/:path*',
  ],
}
